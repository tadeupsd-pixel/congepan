import { buildWhatsAppUrl } from '@/lib/utils';

type Props = {
  number: string;
  message: string;
};

export function FloatingWhatsApp({ number, message }: Props) {
  const href = buildWhatsAppUrl(number, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="floating-whatsapp"
      aria-label="Falar no WhatsApp"
    >
      <span className="floating-whatsapp-icon">✆</span>
      <span className="floating-whatsapp-text">WhatsApp</span>
    </a>
  );
}
