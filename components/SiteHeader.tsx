'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type SiteHeaderProps = {
  logoUrl?: string | null;
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

  const finalLogo = logoUrl && logoUrl.trim() ? logoUrl : '/congepan-logo.png';

  return (
    <>
      <header className="site-header-shell">
        <div className="site-header">
          <nav className="desktop-nav-left" aria-label="Navegação principal esquerda">
            <a href="#topo" className="site-nav-link">Início</a>
            <a href="#linhas" className="site-nav-link">Linhas</a>
          </nav>

          <a href="#topo" className="site-logo-link" aria-label={brandName}>
            <Image
              src={finalLogo}
              alt={brandName}
              width={320}
              height={120}
              className="site-logo-image"
              priority
            />
          </a>

          <nav className="desktop-nav-right" aria-label="Navegação principal direita">
            <a href="#sobre" className="site-nav-link">Sobre</a>
            <a href="#contato" className="site-nav-link">Contato</a>
          </nav>

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
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 20px;
          min-height: 96px;
          padding: 14px 20px;
          border-radius: 24px;
          background:
            url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='wheat' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgba(201,138,61,0.12);stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:rgba(199,132,30,0.16);stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:rgba(201,138,61,0.12);stop-opacity:1' /%3E%3C/linearGradient%3E%3ClinearGradient id='wheat2' x1='100%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgba(199,132,30,0.1);stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:rgba(201,138,61,0.08);stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='120' height='120' fill='url(%23wheat)'/%3E%3Crect width='120' height='120' fill='url(%23wheat2)' opacity='0.7'/%3E%3Ccircle cx='25' cy='35' r='2.2' fill='rgba(199,132,30,0.15)'/%3E%3Ccircle cx='70' cy='60' r='1.8' fill='rgba(201,138,61,0.12)'/%3E%3Ccircle cx='95' cy='25' r='2' fill='rgba(199,132,30,0.14)'/%3E%3Ccircle cx='45' cy='85' r='1.8' fill='rgba(201,138,61,0.12)'/%3E%3Ccircle cx='15' cy='70' r='2' fill='rgba(199,132,30,0.13)'/%3E%3Cline x1='5' y1='40' x2='115' y2='48' stroke='rgba(199,132,30,0.11)' stroke-width='1.2'/%3E%3Cline x1='8' y1='75' x2='112' y2='82' stroke='rgba(201,138,61,0.1)' stroke-width='1.2'/%3E%3Cline x1='0' y1='20' x2='120' y2='22' stroke='rgba(201,138,61,0.09)' stroke-width='0.8'/%3E%3Cline x1='0' y1='55' x2='120' y2='58' stroke='rgba(199,132,30,0.08)' stroke-width='0.8'/%3E%3C/svg%3E"),
            linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(249, 246, 239, 0.94));
          background-size: 120px 120px, 100%;
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

        .site-header::before { left: 12px; }
        .site-header::after { right: 12px; }

        .desktop-nav-left,
        .desktop-nav-right {
          display: flex;
          align-items: center;
          gap: 18px;
          min-width: 0;
        }

        .desktop-nav-left {
          justify-content: flex-start;
        }

        .desktop-nav-right {
          justify-content: flex-end;
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
          padding: 6px 10px;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .site-logo-link:hover {
          background: rgba(201, 138, 61, 0.06);
          transform: scale(1.02);
        }

        .site-logo-image {
          width: min(100%, 220px);
          height: auto;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
          transition: filter 0.3s ease;
        }

        .site-logo-link:hover .site-logo-image {
          filter: drop-shadow(0 4px 8px rgba(201, 138, 61, 0.2));
        }

        .mobile-menu-button {
          display: none;
          justify-self: end;
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
          width: 46px;
          height: 46px;
          border-radius: 14px;
          border: 1px solid rgba(201, 138, 61, 0.32);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 8px 18px rgba(47, 79, 31, 0.1);
          cursor: pointer;
          padding: 0;
        }

        .mobile-menu-button span {
          position: absolute;
          left: 11px;
          right: 11px;
          height: 3px;
          border-radius: 999px;
          background: ${primaryColor};
          transition: 0.25s ease;
        }

        .mobile-menu-button span:nth-child(1) { top: 14px; }
        .mobile-menu-button span:nth-child(2) { top: 21px; }
        .mobile-menu-button span:nth-child(3) { top: 28px; }

        .mobile-menu-button.is-open span:nth-child(1) {
          top: 21px;
          transform: rotate(45deg);
        }

        .mobile-menu-button.is-open span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-button.is-open span:nth-child(3) {
          top: 21px;
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
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.18);
          transform: translateX(100%);
          transition: transform 0.28s ease;
          z-index: 61;
          padding: 22px 18px 28px;
          display: flex;
          flex-direction: column;
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
          background: rgba(255, 255, 255, 0.78);
          border: 1px solid rgba(201, 138, 61, 0.18);
        }

        @media (max-width: 900px) {
          .site-header {
            grid-template-columns: 1fr;
            min-height: 90px;
            padding: 12px 58px 12px 14px;
          }

          .desktop-nav-left,
          .desktop-nav-right {
            display: none;
          }

          .mobile-menu-button {
            display: block;
          }

          .site-logo-image {
            width: min(100%, 150px);
          }

          .site-header::before,
          .site-header::after {
            width: 12px;
            top: 16px;
            bottom: 16px;
            opacity: 0.12;
          }

          .site-header::before { left: 8px; }
          .site-header::after { right: 8px; }
        }

        @media (max-width: 520px) {
          .site-header-shell {
            padding: 14px 14px 0;
          }

          .site-header {
            border-radius: 24px;
          }

          .site-logo-image {
            width: min(100%, 136px);
          }
        }
      `}</style>
    </>
  );
}