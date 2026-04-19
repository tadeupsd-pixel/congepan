# Ponto Congelado - landing page + painel ADM

Projeto pronto em **Next.js + Supabase + Vercel** para:

- site de uma tela só
- logo grandona
- WhatsApp de contato
- painel administrativo simples
- upload de logo para o Supabase Storage
- registro de visitas, IP e cidade aproximada
- política de privacidade editável

## 1) Criar no Supabase

No painel do Supabase, crie um projeto e rode o SQL do arquivo:

```sql
supabase/schema.sql
```

Depois crie o bucket público chamado:

```text
branding
```

## 2) Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3) Rodar local

```bash
npm install
npm run dev
```

## 4) Deploy na Vercel

- suba o projeto para o GitHub
- importe na Vercel
- adicione as mesmas variáveis de ambiente
- deploy

## Rotas

- `/` → site público
- `/admin/login` → login do painel
- `/admin` → painel administrativo

## Observações

- O painel usa uma senha simples definida em `ADMIN_PASSWORD`.
- O rastreio de cidade, região, país e IP usa utilitários da Vercel e headers da própria plataforma. citeturn782641search9turn782641search4
- O upload da logo usa o Supabase Storage via SDK oficial. citeturn782641search2turn782641search5
- O projeto usa App Router e Route Handlers do Next.js. citeturn782641search0turn782641search10

## Melhorias futuras que você pode pedir depois

- domínio personalizado
- favicon e SEO completo
- mais blocos de conteúdo
- dashboard com gráficos
- filtro por período
- exportar visitas em CSV
- banner de cookies
