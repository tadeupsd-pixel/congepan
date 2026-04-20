import Image from 'next/image';
import { getSiteContent } from '@/lib/server-data';
import { buildWhatsAppUrl } from '@/lib/utils';
import { TrackVisit } from '@/components/TrackVisit';
import { HeroCarousel } from '@/components/HeroCarousel';
import { SiteHeader } from '@/components/SiteHeader';
import { RevealOnScroll } from '@/components/RevealOnScroll';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export default async function HomePage() {
  const content = await getSiteContent();
  const whatsappUrl = buildWhatsAppUrl(content.whatsapp_number, content.whatsapp_message);
  const cards = [
    { icon: '🥖', title: content.card_1_title, text: content.card_1_text, href: '' },
    { icon: '🍞', title: content.card_2_title, text: content.card_2_text, href: '' },
    { icon: '🚚', title: content.card_3_title, text: content.card_3_text, href: whatsappUrl }
  ];
  const bullets = [content.bullet_1, content.bullet_2, content.bullet_3].filter(Boolean);

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
      <FloatingWhatsApp number={content.whatsapp_number} message={content.whatsapp_message} />
      <div className="wheat-flight" aria-hidden="true">
        <span className="wheat wheat-1">🌾</span>
        <span className="wheat wheat-2">🌾</span>
        <span className="wheat wheat-3">🌾</span>
        <span className="wheat wheat-4">🌾</span>
        <span className="wheat wheat-5">🌾</span>
        <span className="wheat wheat-6">🌾</span>
      </div>
      <div className="congepan-frame">
        <SiteHeader logoUrl={content.hero_logo_url} brandName={content.brand_name} primaryColor={content.primary_color} />

        <HeroCarousel
          images={[content.banner_1_url || '', content.banner_2_url || '', content.banner_3_url || '']}
          title={content.headline}
          subtitle={content.subheadline}
          bullets={bullets}
          primaryColor={content.primary_color}
          secondaryColor={content.secondary_color}
        />

        <RevealOnScroll as="section" className="zen-intro-band" delay={40}>
          <div className="zen-band-line" />
          <p>
            Estrutura inspirada em landing premium, com navegação fluida, blocos fortes, visual elegante e texto 100% editável no painel.
          </p>
          <div className="zen-band-line" />
        </RevealOnScroll>

        <RevealOnScroll as="section" className="card-section" id="linhas" delay={80}>
          <div className="section-heading compact">
            <span>Linhas principais</span>
            <h2>Organização visual forte para vender melhor</h2>
          </div>
          <div className="card-grid">
            {cards.map((card, index) => {
              const inner = (
                <>
                  <div className="feature-icon">{card.icon}</div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  {index === 2 ? (
                    <span className="feature-wa-badge"><WhatsAppIcon className="wa-icon-svg" /></span>
                  ) : null}
                </>
              );

              return card.href ? (
                <a key={card.title} href={card.href} target="_blank" rel="noreferrer" className={`feature-card feature-card-${index + 1} feature-card-link`}>
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

        <RevealOnScroll as="section" className="about-section" id="sobre" delay={120}>
          <div className="about-grid">
            <div className="about-copy">
              <span className="section-eyebrow">Tema com pegada japonesa</span>
              <h2>{content.about_title}</h2>
              <p>{content.about_text}</p>
              <div className="about-mini-list">
                {bullets.map((bullet) => (
                  <div key={bullet} className="about-mini-item">
                    <span>•</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-visual">
              <div className="about-visual-card">
                <div className="about-stamp">和</div>
                {content.banner_2_url ? (
                  <Image src={content.banner_2_url} alt="Visual da marca" fill className="about-visual-image" sizes="(max-width: 900px) 100vw, 420px" />
                ) : null}
                <div className="about-visual-overlay" />
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll as="section" className="journey-section" delay={160}>
          <div className="section-heading">
            <span>Como o site navega</span>
            <h2>Uma página, leitura clara e descida natural</h2>
          </div>
          <div className="journey-grid">
            <article className="journey-card">
              <strong>01</strong>
              <h3>Impacto no topo</h3>
              <p>Logo centralizada, banner forte, frase principal e prova visual logo de cara.</p>
            </article>
            <article className="journey-card">
              <strong>02</strong>
              <h3>Blocos objetivos</h3>
              <p>Os cards resumem o que importa e deixam a leitura rápida no celular e no desktop.</p>
            </article>
            <article className="journey-card">
              <strong>03</strong>
              <h3>Fechamento no contato</h3>
              <p>O usuário desce, entende a proposta e já encontra o WhatsApp com destaque.</p>
            </article>
          </div>
        </RevealOnScroll>

        <RevealOnScroll as="section" className="cta-section" id="contato" delay={200}>
          <div className="cta-card">
            <div className="cta-copy">
              <span className="section-eyebrow light">Contato direto</span>
              <h2>{content.cta_title}</h2>
              <p>{content.cta_text}</p>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-button">
              <span className="whatsapp-icon"><WhatsAppIcon className="wa-icon-svg" /></span>
              {content.cta_button_text}
            </a>
          </div>
        </RevealOnScroll>

        <RevealOnScroll as="footer" className="site-footer" id="privacidade" delay={240}>
          <div className="footer-logo-wrap">
            {content.hero_logo_url ? (
              <Image src={content.hero_logo_url} alt={content.brand_name} width={320} height={110} style={{ width: '100%', maxWidth: 250, height: 'auto', objectFit: 'contain' }} />
            ) : null}
          </div>
          <div className="footer-divider" />
          <p className="footer-main-text">{content.footer_text}</p>
          <p className="footer-privacy">{content.privacy_policy_text}</p>
        </RevealOnScroll>
      </div>
    </main>
  );
}
