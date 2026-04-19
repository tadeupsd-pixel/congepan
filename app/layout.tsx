import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Congepan',
  description: 'Landing page Congepan com painel administrativo e rastreio de visitas.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
