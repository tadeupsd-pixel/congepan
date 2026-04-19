import { requireAdmin } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getSiteContent } from '@/lib/server-data';
import { AdminPanel } from '@/components/AdminPanel';

export default async function AdminPage() {
  await requireAdmin();

  const supabase = getSupabaseAdmin();
  const content = await getSiteContent();
  const { data: visits } = await supabase
    .from('site_visits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return <AdminPanel initialContent={content} initialVisits={(visits || []) as any} />;
}
