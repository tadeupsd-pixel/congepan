'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type SiteHeaderProps = {
  logoUrl?: string;
  brandName?: string;
  primaryColor?: string;
};

const navItems = [
  { label: 'Início', href: '#topo' },
  { label: 'Linhas', href: '#linhas' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
];

export function SiteHeader({
  logoUrl,
  brandName = 'Congepan',
  primaryColor = '#2F4F1F',
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="site-header-shell">
        <div className="site-header">
          <nav className="site-nav desktop-nav" aria-label="Navegação principal">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="site-nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <a href="#topo" className="site-logo-link" aria-label={brandName}>
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={brandName}
                width={260}
                height={110}
                className="site-logo-image"
                priority
              />
            ) : (
              <span className="site-logo-text">{brandName}</span>
            )}
          </a>

          <button
            type="button"
            className={`mobile-menu-button ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mobile-menu-panel"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`mobile-menu-backdrop ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
      />

      <aside
        id="mobile-menu-panel"
        className={`mobile-menu-panel ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
      >
        <div className="mobile-menu-top">
          <span className="mobile-menu-title">Menu</span>
          <button
            type="button"
            className="mobile-menu-close"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            ×
          </button>
        </div>

        <nav className="mobile-nav" aria-label="Menu mobile">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="mobile-nav-link"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <style jsx>{`
        .site-header-shell {
          padding: 18px 18px 0;
        }

        .site-header {
          position: relative;
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          justify-content: center;
          gap: 16px;
          min-height: 112px;
          padding: 18px 22px;
          border-radius: 28px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(249, 246, 239, 0.94));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            0 10px 28px rgba(47, 79, 31, 0.08);
          border: 1px solid rgba(201, 138, 61, 0.18);
          overflow: hidden;
        }

        .site-header::before,
        .site-header::after {
          content: '';
          position: absolute;
          top: 18px;
          bottom: 18px;
          width: 18px;
          border-radius: 999px;
          opacity: 0.18;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(201, 138, 61, 0.18),
              rgba(201, 138, 61, 0.05)
            );
        }

        .site-header::before {
          left: 12px;
        }

        .site-header::after {
          right: 12px;
        }

        .desktop-nav {
          display: none;
          align-items: center;
          gap: 18px;
          min-width: 0;
        }

        .desktop-nav:first-of-type {
          justify-content: flex-start;
        }

        .site-nav-link {
          position: relative;
          z-index: 1;
          font-size: 15px;
          font-weight: 700;
          color: ${primaryColor};
          text-decoration: none;
          transition: all 0.3s ease;
          white-space: nowrap;
          padding: 8px 12px;
          border-radius: 12px;
          letter-spacing: 0.02em;
        }

        .site-nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, ${primaryColor}, rgba(201, 138, 61, 0.6));
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .site-nav-link:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          background: rgba(201, 138, 61, 0.08);
          box-shadow: 0 4px 12px rgba(201, 138, 61, 0.15);
        }

        .site-logo-link {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          min-width: 0;
          padding: 8px 14px;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .site-logo-link:hover {
          background: rgba(201, 138, 61, 0.06);
          transform: scale(1.02);
        }

        .site-logo-image {
          width: min(100%, 240px);
          height: auto;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
          transition: filter 0.3s ease;
        }

        .site-logo-link:hover .site-logo-image {
          filter: drop-shadow(0 4px 8px rgba(201, 138, 61, 0.2));
        }

        .site-logo-text {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0.04em;
          color: ${primaryColor};
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
        }

        .mobile-menu-button {
          display: none !important;
          justify-self: end;
          position: relative;
          z-index: 3;
          width: 52px;
          height: 52px;
          border-radius: 16px;
          border: 1px solid rgba(201, 138, 61, 0.32);
          background: rgba(255, 255, 255, 0.9);
          box-shadow:
            0 8px 20px rgba(47, 79, 31, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 0;
          transition: all 0.3s ease;
        }

        .mobile-menu-button:hover {
          background: rgba(255, 255, 255, 0.95);
          box-shadow:
            0 10px 28px rgba(47, 79, 31, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transform: translateY(-2px);
        }

        .mobile-menu-button span {
          position: absolute;
          left: 13px;
          right: 13px;
          height: 3px;
          border-radius: 999px;
          background: ${primaryColor};
          transition: all 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .mobile-menu-button span:nth-child(1) {
          top: 16px;
        }

        .mobile-menu-button span:nth-child(2) {
          top: 24px;
        }

        .mobile-menu-button span:nth-child(3) {
          top: 32px;
        }

        .mobile-menu-button.is-open span:nth-child(1) {
          top: 24px;
          transform: rotate(45deg);
        }

        .mobile-menu-button.is-open span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-button.is-open span:nth-child(3) {
          top: 24px;
          transform: rotate(-45deg);
        }

        .mobile-menu-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.36);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
          z-index: 60;
        }

        .mobile-menu-backdrop.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .mobile-menu-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: min(82vw, 340px);
          height: 100vh;
          background:
            linear-gradient(180deg, #fffdf8 0%, #f6f1e7 100%);
          box-shadow: -12px 0 40px rgba(0, 0, 0, 0.2);
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          z-index: 61;
          padding: 22px 18px 28px;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(10px);
        }

        .mobile-menu-panel.is-open {
          transform: translateX(0);
        }

        .mobile-menu-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .mobile-menu-title {
          font-size: 22px;
          font-weight: 800;
          color: ${primaryColor};
        }

        .mobile-menu-close {
          border: none;
          background: transparent;
          color: ${primaryColor};
          font-size: 34px;
          line-height: 1;
          cursor: pointer;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }

        .mobile-nav-link {
          display: block;
          text-decoration: none;
          color: ${primaryColor};
          font-size: 18px;
          font-weight: 700;
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(201, 138, 61, 0.22);
          transition: all 0.25s ease;
          letter-spacing: 0.02em;
        }

        .mobile-nav-link:hover {
          background: rgba(255, 255, 255, 0.92);
          border-color: rgba(201, 138, 61, 0.38);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(201, 138, 61, 0.1);
        }

        @media (max-width: 860px) {
          .site-header {
            grid-template-columns: 1fr auto 1fr;
            min-height: 96px;
            padding: 14px 16px;
          }

          .desktop-nav {
            display: none;
          }

          .mobile-menu-button {
            display: block;
          }

          .site-logo-image {
            width: min(100%, 170px);
          }

          .site-header::before,
          .site-header::after {
            width: 12px;
            top: 16px;
            bottom: 16px;
            opacity: 0.12;
          }

          .site-header::before {
            left: 8px;
          }

          .site-header::after {
            right: 8px;
          }
        }

        @media (max-width: 520px) {
          .site-header-shell {
            padding: 14px 14px 0;
          }

          .site-header {
            min-height: 90px;
            border-radius: 24px;
            padding: 12px 14px;
          }

          .site-logo-image {
            width: min(100%, 145px);
          }

          .mobile-menu-button {
            width: 46px;
            height: 46px;
            border-radius: 14px;
          }

          .mobile-menu-button span {
            left: 11px;
            right: 11px;
          }

          .mobile-menu-button span:nth-child(1) {
            top: 14px;
          }

          .mobile-menu-button span:nth-child(2) {
            top: 21px;
          }

          .mobile-menu-button span:nth-child(3) {
            top: 28px;
          }

          .mobile-menu-button.is-open span:nth-child(1),
          .mobile-menu-button.is-open span:nth-child(3) {
            top: 21px;
          }
        }
      `}</style>
    </>
  );
}
