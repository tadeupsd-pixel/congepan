import { NextResponse } from 'next/server';
import { geolocation, ipAddress } from '@vercel/functions';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';

const schema = z.object({
  pagePath: z.string().min(1)
});

function detectDevice(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(ua)) return 'Mobile';
  if (/ipad|tablet/.test(ua)) return 'Tablet';
  return 'Desktop';
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 });
  }

  const ip = ipAddress(request) || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  const geo = geolocation(request);
  const userAgent = request.headers.get('user-agent') || null;
  const referer = request.headers.get('referer') || null;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('site_visits').insert({
    page_path: parsed.data.pagePath,
    ip_address: ip,
    city: geo.city || null,
    region: geo.region || null,
    country: geo.country || null,
    latitude: geo.latitude || null,
    longitude: geo.longitude || null,
    referer,
    user_agent: userAgent,
    device_type: userAgent ? detectDevice(userAgent) : null
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
