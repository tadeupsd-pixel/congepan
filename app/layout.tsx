import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ponto Congelado',
  description: 'Landing page com painel administrativo e rastreio de visitas.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
