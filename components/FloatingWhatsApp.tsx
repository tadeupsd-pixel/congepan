import { buildWhatsAppUrl } from '@/lib/utils';

type Props = {
  number: string;
  message: string;
};

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="whatsapp-mark">
      <path d="M19.11 17.23c-.27-.14-1.58-.78-1.83-.86-.24-.09-.42-.14-.6.14-.18.27-.68.86-.84 1.03-.15.18-.31.2-.58.07-.27-.14-1.12-.41-2.14-1.31-.79-.71-1.33-1.59-1.49-1.86-.15-.27-.02-.41.12-.54.13-.13.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46h-.51c-.18 0-.47.07-.71.34-.24.27-.92.9-.92 2.2 0 1.3.94 2.56 1.07 2.74.14.18 1.86 2.84 4.51 3.98.63.27 1.12.43 1.5.55.63.2 1.2.17 1.65.1.5-.07 1.58-.65 1.8-1.28.22-.63.22-1.17.16-1.28-.06-.11-.24-.18-.5-.31Z" fill="currentColor"/>
      <path d="M16 3.2c-7.05 0-12.77 5.72-12.77 12.77 0 2.25.59 4.45 1.71 6.39L3 29l6.82-1.78a12.72 12.72 0 0 0 6.18 1.58h.01c7.05 0 12.79-5.72 12.79-12.77 0-3.42-1.33-6.64-3.75-9.05A12.69 12.69 0 0 0 16 3.2Zm0 23.44h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.05 1.06 1.08-3.95-.25-.41a10.57 10.57 0 0 1-1.62-5.65c0-5.85 4.77-10.61 10.64-10.61 2.84 0 5.5 1.1 7.51 3.11a10.53 10.53 0 0 1 3.12 7.51c0 5.87-4.77 10.64-10.63 10.64Z" fill="currentColor"/>
    </svg>
  );
}

export function FloatingWhatsApp({ number, message }: Props) {
  const href = buildWhatsAppUrl(number, message);

  return (
    <a href={href} target="_blank" rel="noreferrer" className="floating-whatsapp" aria-label="Falar no WhatsApp">
      <span className="floating-whatsapp-icon"><WhatsAppMark /></span>
      <span className="floating-whatsapp-text">WhatsApp</span>
    </a>
  );
}
