import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase';
import { ensureAdminApi } from '@/lib/auth';
import { defaultSiteContent } from '@/lib/content-defaults';

const maybeUrl = z.string().trim().refine((value) => {
  if (!value) return true;
  return value.startsWith('/') || /^https?:\/\//.test(value);
}, 'URL inválida');

const schema = z.object({
  id: z.number().optional(),
  brand_name: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  whatsapp_number: z.string().min(1),
  whatsapp_message: z.string().min(1),
  hero_logo_url: maybeUrl.nullable().transform((value) => value || null),
  banner_1_url: maybeUrl.nullable().transform((value) => value || null),
  banner_2_url: maybeUrl.nullable().transform((value) => value || null),
  banner_3_url: maybeUrl.nullable().transform((value) => value || null),
  primary_color: z.string().min(4),
  secondary_color: z.string().min(4),
  accent_color: z.string().min(4),
  bullet_1: z.string().min(1),
  bullet_2: z.string().min(1),
  bullet_3: z.string().min(1),
  card_1_title: z.string().min(1),
  card_1_text: z.string().min(1),
  card_2_title: z.string().min(1),
  card_2_text: z.string().min(1),
  card_3_title: z.string().min(1),
  card_3_text: z.string().min(1),
  about_title: z.string().min(1),
  about_text: z.string().min(1),
  cta_title: z.string().min(1),
  cta_text: z.string().min(1),
  cta_button_text: z.string().min(1),
  footer_text: z.string().min(1),
  privacy_policy_text: z.string().min(1)
});

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from('site_content').select('*').eq('id', 1).single();
  return NextResponse.json({ data: { id: 1, ...defaultSiteContent, ...(data || {}) } });
}

export async function PUT(request: Request) {
  if (!(await ensureAdminApi())) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos.', details: parsed.error.flatten() }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const payload = { id: 1, ...parsed.data };
  const { data, error } = await supabase.from('site_content').upsert(payload).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data: { id: 1, ...defaultSiteContent, ...data } });
}
