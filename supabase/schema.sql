create extension if not exists pgcrypto;

create table if not exists public.site_content (
  id bigint primary key,
  brand_name text not null,
  headline text not null,
  subheadline text not null,
  whatsapp_number text not null,
  whatsapp_message text not null,
  hero_logo_url text,
  primary_color text not null,
  secondary_color text not null,
  accent_color text not null,
  info_card_1_title text not null,
  info_card_1_value text not null,
  info_card_2_title text not null,
  info_card_2_value text not null,
  info_card_3_title text not null,
  info_card_3_value text not null,
  privacy_policy_text text not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_site_content_updated_at
before update on public.site_content
for each row
execute function public.set_updated_at();

insert into public.site_content (
  id,
  brand_name,
  headline,
  subheadline,
  whatsapp_number,
  whatsapp_message,
  hero_logo_url,
  primary_color,
  secondary_color,
  accent_color,
  info_card_1_title,
  info_card_1_value,
  info_card_2_title,
  info_card_2_value,
  info_card_3_title,
  info_card_3_value,
  privacy_policy_text
)
values (
  1,
  'Ponto Congelado',
  'A qualidade congelada do jeito certo para o seu negócio.',
  'Produtos, praticidade e atendimento rápido para quem precisa de solução com padrão profissional.',
  '5585999999999',
  'Olá! Quero falar com a equipe do Ponto Congelado.',
  null,
  '#0f172a',
  '#111827',
  '#22c55e',
  'Atendimento',
  'Rápido e direto',
  'Qualidade',
  'Padrão profissional',
  'Contato',
  'Fale conosco no WhatsApp',
  'Este site pode registrar endereço IP, cidade aproximada, dispositivo e dados básicos de navegação para fins de segurança, estatística e controle interno. Essas informações não são utilizadas para fins irregulares e são tratadas de forma restrita.'
)
on conflict (id) do nothing;

create table if not exists public.site_visits (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  page_path text not null,
  ip_address text,
  city text,
  region text,
  country text,
  latitude text,
  longitude text,
  referer text,
  user_agent text,
  device_type text
);

create index if not exists idx_site_visits_created_at on public.site_visits (created_at desc);
create index if not exists idx_site_visits_ip_address on public.site_visits (ip_address);
create index if not exists idx_site_visits_city on public.site_visits (city);
