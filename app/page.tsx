import Image from 'next/image';
import { getSiteContent } from '@/lib/server-data';
import { buildWhatsAppUrl } from '@/lib/utils';
import { TrackVisit } from '@/components/TrackVisit';

export default async function HomePage() {
  const content = await getSiteContent();
  const whatsappUrl = buildWhatsAppUrl(content.whatsapp_number, content.whatsapp_message);

  return (
    <main className="site-shell" style={{ ['--accent' as string]: content.accent_color, ['--brand' as string]: content.primary_color }}>
      <TrackVisit />

      <section className="hero">
        <div className="container">
          <div className="hero-card" style={{ background: `linear-gradient(135deg, ${content.primary_color}dd 0%, ${content.secondary_color}dd 100%)` }}>
            <div className="hero-grid">
              <div>
                <span className="eyebrow">Ponto congelado • atendimento direto</span>
                <h1>{content.headline}</h1>
                <p className="lead">{content.subheadline}</p>

                <div className="action-row">
                  <a className="button button-primary" style={{ background: content.accent_color }} href={whatsappUrl} target="_blank" rel="noreferrer">
                    Fale conosco no WhatsApp
                  </a>
                  <a className="button button-secondary" href="#privacidade">
                    Política de privacidade
                  </a>
                </div>
              </div>

              <div className="logo-box">
                {content.hero_logo_url ? (
                  <Image src={content.hero_logo_url} alt={content.brand_name} width={640} height={640} priority style={{ objectFit: 'contain', width: '100%', maxHeight: 360 }} />
                ) : (
                  <div className="logo-fallback">{content.brand_name}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics">
        <div className="container">
          <div className="metric-grid">
            <div className="metric-card hero-card">
              <span className="metric-label">{content.info_card_1_title}</span>
              <div className="metric-value">{content.info_card_1_value}</div>
            </div>
            <div className="metric-card hero-card">
              <span className="metric-label">{content.info_card_2_title}</span>
              <div className="metric-value">{content.info_card_2_value}</div>
            </div>
            <div className="metric-card hero-card">
              <span className="metric-label">{content.info_card_3_title}</span>
              <div className="metric-value">{content.info_card_3_value}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="footer-note" id="privacidade">
        <div className="container">
          <div className="hero-card">
            <strong>Privacidade e segurança</strong>
            <p>{content.privacy_policy_text}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
