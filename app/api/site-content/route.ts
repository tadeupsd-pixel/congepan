import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { ensureAdminApi } from '@/lib/auth';
import { defaultSiteContent } from '@/lib/content-defaults';

const schema = z.object({
  id: z.number().optional(),
  brand_name: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  whatsapp_number: z.string().min(1),
  whatsapp_message: z.string().min(1),
  hero_logo_url: z.string().url().nullable().or(z.literal('')).transform((value) => value || null),
  primary_color: z.string().min(4),
  secondary_color: z.string().min(4),
  accent_color: z.string().min(4),
  info_card_1_title: z.string().min(1),
  info_card_1_value: z.string().min(1),
  info_card_2_title: z.string().min(1),
  info_card_2_value: z.string().min(1),
  info_card_3_title: z.string().min(1),
  info_card_3_value: z.string().min(1),
  privacy_policy_text: z.string().min(1)
});

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from('site_content').select('*').eq('id', 1).single();
  return NextResponse.json({ data: data || { id: 1, ...defaultSiteContent } });
}

export async function PUT(request: Request) {
  if (!(await ensureAdminApi())) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos.', details: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const payload = { id: 1, ...parsed.data };
  const { data, error } = await supabase
    .from('site_content')
    .upsert(payload)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}
