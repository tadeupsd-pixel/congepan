# Congepan - landing page com painel ADM

Projeto Next.js de uma tela só, no estilo do mockup aprovado, com:

- header com logo e menu
- 3 banners/carrossel
- cards principais
- seção institucional
- CTA para WhatsApp
- painel ADM para editar textos, links e cores
- rastreio de visitas com IP e cidade aproximada
- pronto para Vercel + Supabase

## 1. Variáveis de ambiente
Crie um arquivo `.env.local` com base no `.env.example`.

## 2. Banco de dados
Rode `supabase/schema.sql` no SQL Editor do Supabase.

## 3. Storage
Crie um bucket público chamado `branding`.

## 4. Rodar localmente
```bash
npm install
npm run dev
```

Site: `http://localhost:3000`

Painel: `http://localhost:3000/admin/login`

## 5. Imagens padrão
As imagens padrão já vêm dentro da pasta `public/`:
- `congepan-logo.png`
- `congepan-banner-1.png`
- `congepan-banner-2.png`
- `congepan-banner-3.png`
