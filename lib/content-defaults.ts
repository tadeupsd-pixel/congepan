import type { SiteContent } from '@/lib/types';

export const defaultSiteContent: Omit<SiteContent, 'id' | 'updated_at'> = {
  brand_name: 'Ponto Congelado',
  headline: 'A qualidade congelada do jeito certo para o seu negócio.',
  subheadline: 'Produtos, praticidade e atendimento rápido para quem precisa de solução com padrão profissional.',
  whatsapp_number: '5585999999999',
  whatsapp_message: 'Olá! Quero falar com a equipe do Ponto Congelado.',
  hero_logo_url: null,
  primary_color: '#0f172a',
  secondary_color: '#111827',
  accent_color: '#22c55e',
  info_card_1_title: 'Atendimento',
  info_card_1_value: 'Rápido e direto',
  info_card_2_title: 'Qualidade',
  info_card_2_value: 'Padrão profissional',
  info_card_3_title: 'Contato',
  info_card_3_value: 'Fale conosco no WhatsApp',
  privacy_policy_text: 'Este site pode registrar endereço IP, cidade aproximada, dispositivo e dados básicos de navegação para fins de segurança, estatística e controle interno. Essas informações não são utilizadas para fins irregulares e são tratadas de forma restrita.'
};
