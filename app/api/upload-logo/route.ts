import { NextResponse } from 'next/server';
import { ensureAdminApi } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  if (!(await ensureAdminApi())) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Arquivo não enviado.' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() || 'png';
  const fileName = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from('branding')
    .upload(fileName, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from('branding').getPublicUrl(fileName);

  return NextResponse.json({ ok: true, url: data.publicUrl });
}
