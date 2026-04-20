export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function buildWhatsAppUrl(phone: string, text: string) {
  const digits = onlyDigits(phone);
  const encoded = encodeURIComponent(text || 'Olá!');
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}
