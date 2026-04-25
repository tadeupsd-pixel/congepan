import Image from 'next/image';
import { getSiteContent } from '@/lib/server-data';
import { buildWhatsAppUrl } from '@/lib/utils';
import { TrackVisit } from '@/components/TrackVisit';
import { HeroCarousel } from '@/components/HeroCarousel';
import { SiteHeader } from '@/components/SiteHeader';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { VideoSection } from '@/components/VideoSection';

export const dynamic = 'force-dynamic';

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="whatsapp-mark inline-wa">
      <path d="M19.11 17.23c-.27-.14-1.58-.78-1.83-.86-.24-.09-.42-.14-.6.14-.18.27-.68.86-.84 1.03-.15.18-.31.2-.58.07-.27-.14-1.12-.41-2.14-1.31-.79-.71-1.33-1.59-1.49-1.86-.15-.27-.02-.41.12-.54.13-.13.27-.31.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46h-.51c-.18 0-.47.07-.71.34-.24.27-.92.9-.92 2.2 0 1.3.94 2.56 1.07 2.74.14.18 1.86 2.84 4.51 3.98.63.27 1.12.43 1.5.55.63.2 1.2.17 1.65.1.5-.07 1.58-.65 1.8-1.28.22-.63.22-1.17.16-1.28-.06-.11-.24-.18-.5-.31Z" fill="currentColor"/>
      <path d="M16 3.2c-7.05 0-12.77 5.72-12.77 12.77 0 2.25.59 4.45 1.71 6.39L3 29l6.82-1.78a12.72 12.72 0 0 0 6.18 1.58h.01c7.05 0 12.79-5.72 12.79-12.77 0-3.42-1.33-6.64-3.75-9.05A12.69 12.69 0 0 0 16 3.2Zm0 23.44h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.05 1.06 1.08-3.95-.25-.41a10.57 10.57 0 0 1-1.62-5.65c0-5.85 4.77-10.61 10.64-10.61 2.84 0 5.5 1.1 7.51 3.11a10.53 10.53 0 0 1 3.12 7.51c0 5.87-4.77 10.64-10.63 10.64Z" fill="currentColor"/>
    </svg>
  );
}

export default async function HomePage() {
  const content = await getSiteContent();
  const whatsappUrl = buildWhatsAppUrl(content.whatsapp_number, content.whatsapp_message);
  const cards = [
    { icon: '🥖', title: content.card_1_title, text: content.card_1_text, href: '' },
    { icon: '🍞', title: content.card_2_title, text: content.card_2_text, href: '' },
    { icon: '🚚', title: content.card_3_title, text: content.card_3_text, href: whatsappUrl },
  ];
  const bullets = [content.bullet_1, content.bullet_2, content.bullet_3].filter(Boolean);

  const videos = [
    { url: content.video_1_url, title: content.video_1_title, description: content.video_1_description, visible: content.video_1_visible, index: 1 },
    { url: content.video_2_url, title: content.video_2_title, description: content.video_2_description, visible: content.video_2_visible, index: 2 },
    { url: content.video_3_url, title: content.video_3_title, description: content.video_3_description, visible: content.video_3_visible, index: 3 },
  ];

  return (
    <main
      id="topo"
      className="congepan-shell"
      style={{
        ['--brand' as string]: content.primary_color,
        ['--gold' as string]: content.secondary_color,
        ['--accent' as string]: content.accent_color,
      }}
    >
      <TrackVisit />
      <FloatingWhatsApp number={content.whatsapp_number} message={content.whatsapp_message} />

      <div className="congepan-frame">
        <SiteHeader
          brandName={content.brand_name}
          primaryColor={content.primary_color}
        />

        <HeroCarousel
          images={[content.banner_1_url || '', content.banner_2_url || '', content.banner_3_url || '']}
          title={content.headline}
          subtitle={content.subheadline}
          bullets={bullets}
          primaryColor={content.primary_color}
          secondaryColor={content.secondary_color}
        />

        {content.section_cards_visible && (
          <RevealOnScroll as="section" className="card-section" id="linhas" delay={80}>
            <div className="card-grid">
              {cards.map((card, index) => {
                const inner = (
                  <>
                    <div className="feature-icon">{card.icon}</div>
                    <h3>{card.title}</h3>
                    <p>{card.text}</p>
                    {index === 2 ? (
                      <span className="feature-wa-badge"><WhatsAppMark /></span>
                    ) : null}
                  </>
                );

                return card.href ? (
                  <a
                    key={card.title}
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`feature-card feature-card-${index + 1} feature-card-link`}
                  >
                    {inner}
                  </a>
                ) : (
                  <article key={card.title} className={`feature-card feature-card-${index + 1}`}>
                    {inner}
                  </article>
                );
              })}
            </div>
          </RevealOnScroll>
        )}

        {content.section_about_visible && (
          <RevealOnScroll as="section" className="about-section" id="sobre" delay={120}>
            <div className="about-panel">
              <h2>{content.about_title}</h2>
              <p>{content.about_text}</p>
            </div>
          </RevealOnScroll>
        )}

        {content.section_videos_visible && (
          <RevealOnScroll as="section" className="videos-section" id="videos" delay={140}>
            <div className="videos-section-header">
              <h2 className="videos-section-title">Veja por dentro</h2>
              <p className="videos-section-sub">Conheça a empresa, ouça nossos clientes e esclareça suas dúvidas</p>
            </div>
            <VideoSection videos={videos} />
          </RevealOnScroll>
        )}

        {content.section_cta_visible && (
          <RevealOnScroll as="section" className="cta-section" id="contato" delay={200}>
            <div className="cta-card">
              <div className="cta-copy">
                <h2>{content.cta_title}</h2>
                <p>{content.cta_text}</p>
              </div>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-button">
                <span className="whatsapp-icon"><WhatsAppMark /></span>
                {content.cta_button_text}
              </a>
            </div>
          </RevealOnScroll>
        )}

        <RevealOnScroll as="footer" className="site-footer" id="privacidade" delay={240}>
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
          <p className="footer-main-text">{content.footer_text}</p>
          <p className="footer-privacy">{content.privacy_policy_text}</p>
        </RevealOnScroll>
      </div>
    </main>
  );
}
