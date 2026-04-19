'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

type Props = {
  images: string[];
  logoUrl?: string | null;
  title: string;
  bullets: string[];
  primaryColor: string;
  secondaryColor: string;
  subtitle?: string;
};

export function HeroCarousel({ images, logoUrl, title, bullets, primaryColor, secondaryColor, subtitle }: Props) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [index, setIndex] = useState(0);
  const current = safeImages[index] || '/congepan-banner-1.png';

  useEffect(() => {
    if (safeImages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % safeImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [safeImages.length]);

  function previous() {
    if (safeImages.length <= 1) return;
    setIndex((currentIndex) => (currentIndex - 1 + safeImages.length) % safeImages.length);
  }

  function next() {
    if (safeImages.length <= 1) return;
    setIndex((currentIndex) => (currentIndex + 1) % safeImages.length);
  }

  return (
    <section className="hero-visual-shell">
      <div className="hero-visual-card">
        <div className="hero-media-wrap">
          <Image src={current} alt="Banner principal" fill priority sizes="(max-width: 900px) 100vw, 1200px" className="hero-media" />
          <div className="hero-overlay" />

          <button type="button" className="hero-arrow hero-arrow-left" onClick={previous} aria-label="Banner anterior">
            ‹
          </button>
          <button type="button" className="hero-arrow hero-arrow-right" onClick={next} aria-label="Próximo banner">
            ›
          </button>

          <div className="hero-copy">
            <div className="hero-kicker" style={{ color: secondaryColor }}>
              構造 premium · Congepan
            </div>
            <h1>{title}</h1>
            {subtitle ? <p className="hero-subtitle">{subtitle}</p> : null}

            <div className="hero-bullets-panel">
              {bullets.filter(Boolean).map((bullet) => (
                <div className="hero-bullet" key={bullet}>
                  <span className="hero-bullet-check" style={{ color: secondaryColor }}>✓</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-floating-logo">
            <div className="hero-floating-logo-inner">
              {logoUrl ? <Image src={logoUrl} alt="Logo" width={440} height={190} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} /> : null}
            </div>
          </div>

          <div className="hero-scroll-chip" style={{ borderColor: secondaryColor }}>
            role para baixo
          </div>
        </div>
      </div>
      <div className="hero-dots" aria-label="Indicadores do carrossel">
        {safeImages.map((item, dotIndex) => (
          <button
            key={item + dotIndex}
            type="button"
            className={dotIndex === index ? 'hero-dot active' : 'hero-dot'}
            style={dotIndex === index ? { background: primaryColor } : undefined}
            onClick={() => setIndex(dotIndex)}
            aria-label={`Ir para banner ${dotIndex + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
