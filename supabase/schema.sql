create extension if not exists pgcrypto;
create table if not exists public.site_content (
  id bigint primary key,
  brand_name text not null,
  headline text not null,
  subheadline text not null,
  whatsapp_number text not null,
  whatsapp_message text not null,
  hero_logo_url text,
  banner_1_url text,
  banner_2_url text,
  banner_3_url text,
  primary_color text not null,
  secondary_color text not null,
  accent_color text not null,
  bullet_1 text not null,
  bullet_2 text not null,
  bullet_3 text not null,
  card_1_title text not null,
  card_1_text text not null,
  card_2_title text not null,
  card_2_text text not null,
  card_3_title text not null,
  card_3_text text not null,
  about_title text not null,
  about_text text not null,
  cta_title text not null,
  cta_text text not null,
  cta_button_text text not null,
  footer_text text not null,
  privacy_policy_text text not null,
  updated_at timestamptz not null default now()
);
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at before update on public.site_content for each row execute function public.set_updated_at();
insert into public.site_content (id,brand_name,headline,subheadline,whatsapp_number,whatsapp_message,hero_logo_url,banner_1_url,banner_2_url,banner_3_url,primary_color,secondary_color,accent_color,bullet_1,bullet_2,bullet_3,card_1_title,card_1_text,card_2_title,card_2_text,card_3_title,card_3_text,about_title,about_text,cta_title,cta_text,cta_button_text,footer_text,privacy_policy_text)
values (1,'Congepan','O segredo das melhores padarias está aqui.','Pães congelados com qualidade, praticidade e atendimento rápido para sua padaria vender mais todos os dias.','5585999999999','Olá! Vim pelo site da Congepan e quero falar com a equipe.','/congepan-logo.png','/congepan-banner-1.png','/congepan-banner-2.png','/congepan-banner-3.png','#28411f','#c7841e','#0f7a3f','Mais de 10 anos de experiência','Pães congelados com qualidade superior','Atendimento personalizado para sua padaria','Tradicionais','Pães clássicos para o dia a dia com padrão e praticidade.','Linha Extra','Mais variedade para padarias que querem encantar o cliente.','Faça Já Seu Pedido','Entre em contato agora mesmo e fale direto no WhatsApp.','Pão, Propósito e Paixão','Na Congepan, oferecemos pães congelados de alta qualidade, prontos para assar, garantindo praticidade, rendimento e sabor irresistível para a sua padaria.','Fale Conosco','Estamos prontos para atender você e levar mais praticidade para sua produção.','Fale pelo WhatsApp','© 2026 Congepan - Qualidade e Praticidade na sua Padaria. Todos os direitos reservados.','Este site pode registrar endereço IP, cidade aproximada, dispositivo e dados básicos de navegação para fins de segurança, estatística e controle interno. Essas informações não são utilizadas para fins irregulares e são tratadas de forma restrita.')
on conflict (id) do update set brand_name=excluded.brand_name,headline=excluded.headline,subheadline=excluded.subheadline,whatsapp_number=excluded.whatsapp_number,whatsapp_message=excluded.whatsapp_message,hero_logo_url=excluded.hero_logo_url,banner_1_url=excluded.banner_1_url,banner_2_url=excluded.banner_2_url,banner_3_url=excluded.banner_3_url,primary_color=excluded.primary_color,secondary_color=excluded.secondary_color,accent_color=excluded.accent_color,bullet_1=excluded.bullet_1,bullet_2=excluded.bullet_2,bullet_3=excluded.bullet_3,card_1_title=excluded.card_1_title,card_1_text=excluded.card_1_text,card_2_title=excluded.card_2_title,card_2_text=excluded.card_2_text,card_3_title=excluded.card_3_title,card_3_text=excluded.card_3_text,about_title=excluded.about_title,about_text=excluded.about_text,cta_title=excluded.cta_title,cta_text=excluded.cta_text,cta_button_text=excluded.cta_button_text,footer_text=excluded.footer_text,privacy_policy_text=excluded.privacy_policy_text;
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

alter table public.site_content disable row level security;
alter table public.site_visits disable row level security;
