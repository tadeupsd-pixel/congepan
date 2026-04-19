import { cache } from 'react';
import { defaultSiteContent } from '@/lib/content-defaults';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { SiteContent } from '@/lib/types';

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) {
    return {
      id: 1,
      updated_at: new Date().toISOString(),
      ...defaultSiteContent
    };
  }

  return data as SiteContent;
});
