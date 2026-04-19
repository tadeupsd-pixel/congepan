'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  logoUrl?: string | null;
  brandName: string;
  primaryColor: string;
};

const links = [
  { href: '#topo', label: 'Início' },
  { href: '#linhas', label: 'Linhas' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' }
];

export function SiteHeader({ logoUrl, brandName, primaryColor }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header-shell">
      <div className="site-header-card">
        <div className="site-header-side desktop-only">
          {links.slice(0, 2).map((item) => (
            <a key={item.href} href={item.href} className="site-nav-link">
              {item.label}
            </a>
          ))}
        </div>

        <a href="#topo" className="site-header-logo" aria-label={brandName}>
          {logoUrl ? (
            <Image src={logoUrl} alt={brandName} width={340} height={110} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
          ) : (
            <strong>{brandName}</strong>
          )}
        </a>

        <div className="site-header-side desktop-only right-align">
          {links.slice(2).map((item) => (
            <a key={item.href} href={item.href} className="site-nav-link">
              {item.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="site-menu-button mobile-only"
          aria-label="Abrir menu"
          onClick={() => setOpen((current) => !current)}
          style={{ color: primaryColor }}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open ? (
        <nav className="site-nav-dropdown mobile-only">
          {links.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="#privacidade" onClick={() => setOpen(false)}>
            Privacidade
          </a>
        </nav>
      ) : null}
    </header>
  );
}
