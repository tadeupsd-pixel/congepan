import { buildWhatsAppUrl } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

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
      <span className="floating-whatsapp-icon"><WhatsAppIcon className="wa-icon-svg" /></span>
      <span className="floating-whatsapp-text">WhatsApp</span>
    </a>
  );
}
