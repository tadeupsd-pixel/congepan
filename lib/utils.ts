export function onlyDigits(value: string) {
  return (value || '').replace(/\D/g, '');
}

export function normalizeWhatsAppNumber(phone: string) {
  const digits = onlyDigits(phone);
  if (!digits) return '';
  if (digits.startsWith('55')) return digits;
  return `55${digits}`;
}

export function buildWhatsAppUrl(phone: string, text: string) {
  const digits = normalizeWhatsAppNumber(phone);
  const encoded = encodeURIComponent(text || 'Olá!');
  return digits ? `https://wa.me/${digits}?text=${encoded}` : '#';
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}
