import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { ensureAdminApi } from '@/lib/auth';

function sanitizeFileName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

export async function POST(request: Request) {
  if (!(await ensureAdminApi())) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const formData = await request.formData();

    const file = formData.get('file');
    const folder = String(formData.get('folder') || 'branding');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Arquivo não enviado.' }, { status: 400 });
    }

    const allowedFolders = ['branding', 'banners'];
    const safeFolder = allowedFolders.includes(folder) ? folder : 'branding';

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = sanitizeFileName(file.name || 'imagem.png');
    const ext = safeName.includes('.') ? safeName.split('.').pop() : 'png';
    const fileName = `${safeFolder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('branding')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/png',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from('branding')
      .getPublicUrl(fileName);

    return NextResponse.json({
      ok: true,
      path: fileName,
      url: publicUrlData.publicUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao enviar imagem.' },
      { status: 500 }
    );
  }
}