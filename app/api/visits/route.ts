import { NextResponse } from 'next/server';
import { ensureAdminApi } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  if (!(await ensureAdminApi())) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit') || '500'), 1000);

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('site_visits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data || [] });
}
