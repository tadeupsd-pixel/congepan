'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  logoUrl?: string | null;
  brandName: string;
  primaryColor: string;
};

export function SiteHeader({ logoUrl, brandName, primaryColor }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header-shell">
      <div className="site-header-card">
        <a href="#topo" className="site-header-logo" aria-label={brandName}>
          {logoUrl ? <Image src={logoUrl} alt={brandName} width={300} height={86} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} /> : <strong>{brandName}</strong>}
        </a>
        <button type="button" className="site-menu-button" aria-label="Abrir menu" onClick={() => setOpen((current) => !current)} style={{ color: primaryColor }}>
          <span />
          <span />
          <span />
        </button>
      </div>
      {open ? (
        <nav className="site-nav-dropdown">
          <a href="#topo" onClick={() => setOpen(false)}>Início</a>
          <a href="#sobre" onClick={() => setOpen(false)}>Sobre</a>
          <a href="#contato" onClick={() => setOpen(false)}>Contato</a>
          <a href="#privacidade" onClick={() => setOpen(false)}>Privacidade</a>
        </nav>
      ) : null}
    </header>
  );
}
