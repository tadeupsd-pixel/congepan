export type SiteContent = {
  id: number;
  brand_name: string;
  headline: string;
  subheadline: string;
  whatsapp_number: string;
  whatsapp_message: string;
  hero_logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  info_card_1_title: string;
  info_card_1_value: string;
  info_card_2_title: string;
  info_card_2_value: string;
  info_card_3_title: string;
  info_card_3_value: string;
  privacy_policy_text: string;
  updated_at: string;
};

export type VisitRecord = {
  id: number;
  created_at: string;
  page_path: string;
  ip_address: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
  referer: string | null;
  user_agent: string | null;
  device_type: string | null;
};
