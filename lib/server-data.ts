import { unstable_noStore as noStore } from 'next/cache';
import { defaultSiteContent } from '@/lib/content-defaults';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { SiteContent } from '@/lib/types';

export async function getSiteContent(): Promise<SiteContent> {
  noStore();

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).single();

  if (error || !data) {
    return { id: 1, updated_at: new Date().toISOString(), ...defaultSiteContent };
  }

  return {
    id: 1,
    updated_at: data.updated_at ?? new Date().toISOString(),
    ...defaultSiteContent,
    ...data,
  } as SiteContent;
}
