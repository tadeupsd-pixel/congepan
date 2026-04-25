import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';

const schema = z.object({
  pagePath: z.string().min(1),
});

function detectDevice(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(ua)) return 'Mobile';
  if (/ipad|tablet/.test(ua)) return 'Tablet';
  return 'Desktop';
}

async function getGeoFromIP(ip: string) {
  try {
    const token = process.env.IPINFO_TOKEN;
    if (!token || !ip || ip === '127.0.0.1' || ip.startsWith('192.168') || ip.startsWith('10.')) {
      return { city: null, region: null, country: null, latitude: null, longitude: null };
    }
    const res = await fetch(`https://ipinfo.io/${ip}?token=${token}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { city: null, region: null, country: null, latitude: null, longitude: null };
    const data = await res.json();
    const [latitude, longitude] = (data.loc || '').split(',');
    return {
      city: data.city || null,
      region: data.region || null,
      country: data.country || null,
      latitude: latitude || null,
      longitude: longitude || null,
    };
  } catch {
    return { city: null, region: null, country: null, latitude: null, longitude: null };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : null;
    const userAgent = request.headers.get('user-agent') || null;
    const referer = request.headers.get('referer') || null;

    const geo = await getGeoFromIP(ip || '');

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('site_visits').insert({
      page_path: parsed.data.pagePath,
      ip_address: ip,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      latitude: geo.latitude,
      longitude: geo.longitude,
      referer,
      user_agent: userAgent,
      device_type: userAgent ? detectDevice(userAgent) : null,
    });

    if (error) {
      console.error('[track] supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[track] unexpected error:', err);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
