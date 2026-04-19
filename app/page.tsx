import Image from 'next/image';
import { getSiteContent } from '@/lib/server-data';
import { buildWhatsAppUrl } from '@/lib/utils';
import { TrackVisit } from '@/components/TrackVisit';
import { HeroCarousel } from '@/components/HeroCarousel';
import { SiteHeader } from '@/components/SiteHeader';

export default async function HomePage() {
  const content = await getSiteContent();
  const whatsappUrl = buildWhatsAppUrl(content.whatsapp_number, content.whatsapp_message);
  const cards = [
    { icon: '🥖', title: content.card_1_title, text: content.card_1_text },
    { icon: '🍞', title: content.card_2_title, text: content.card_2_text },
    { icon: '🚚', title: content.card_3_title, text: content.card_3_text }
  ];

  return (
    <main
      id="topo"
      className="congepan-shell"
      style={{
        ['--brand' as string]: content.primary_color,
        ['--gold' as string]: content.secondary_color,
        ['--accent' as string]: content.accent_color
      }}
    >
      <TrackVisit />
      <div className="congepan-frame">
        <SiteHeader logoUrl={content.hero_logo_url} brandName={content.brand_name} primaryColor={content.primary_color} />

        <HeroCarousel
          images={[content.banner_1_url || '', content.banner_2_url || '', content.banner_3_url || '']}
          logoUrl={content.hero_logo_url}
          title={content.headline}
          bullets={[content.bullet_1, content.bullet_2, content.bullet_3]}
          primaryColor={content.primary_color}
          secondaryColor={content.secondary_color}
        />

        <section className="card-section">
          <div className="card-grid">
            {cards.map((card, index) => (
              <article key={card.title} className={`feature-card feature-card-${index + 1}`}>
                <div className="feature-icon">{card.icon}</div>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="sobre">
          <div className="section-paper">
            <h2>{content.about_title}</h2>
            <p>{content.about_text}</p>
          </div>
        </section>

        <section className="cta-section" id="contato">
          <div className="cta-card">
            <h2>{content.cta_title}</h2>
            <p>{content.cta_text}</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-button">
              <span className="whatsapp-icon">✆</span>
              {content.cta_button_text}
            </a>
          </div>
        </section>

        <footer className="site-footer" id="privacidade">
          <div className="footer-logo-wrap">
            {content.hero_logo_url ? (
              <Image
                src={content.hero_logo_url}
                alt={content.brand_name}
                width={320}
                height={110}
                style={{ width: '100%', maxWidth: 250, height: 'auto', objectFit: 'contain' }}
              />
            ) : null}
          </div>

          <div className="footer-socials" aria-label="Redes sociais ilustrativas">
            <span>◔</span>
            <span>⌾</span>
            <span>f</span>
            <span>◎</span>
            <span>𝕏</span>
            <span>♬</span>
          </div>

          <p className="footer-main-text">{content.footer_text}</p>
          <p className="footer-privacy">{content.privacy_policy_text}</p>
        </footer>
      </div>
    </main>
  );
}
