# Amperia ⚡

Marketplace de peças de reposição para **carros elétricos** no Brasil — foco nos itens
notoriamente **em falta nas concessionárias** (BYD, GWM, Volvo, Renault, Nissan,
Chevrolet, JAC, Caoa Chery, BMW, Tesla…). Projeto de demonstração (POC).

## ✨ Funcionalidades
- **Catálogo** com busca e filtros (marca, categoria, status de estoque)
- **Página de produto** com compatibilidade, especificações e imagem (Cloudflare R2)
- **Carrinho** (persistido em localStorage) + **checkout simulado** (gera pedido)
- **Cotação (lead)** por peça
- **Painel admin** protegido (Basic Auth): CRUD de peças com upload de imagem ao R2,
  além de cotações e pedidos recebidos
- Imagens otimizadas (webp) servidas pelo **Cloudflare R2**

## 🧱 Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Drizzle ORM + **Neon** (Postgres serverless)
- **Cloudflare R2** (S3 API) + sharp
- Vitest + Testing Library + **PGlite** (TDD)
- Deploy: **Vercel**

## 🚀 Rodando localmente
```bash
pnpm install
cp .env.example .env.local   # preencha os valores (veja abaixo)
pnpm db:migrate              # cria as tabelas no Neon
pnpm db:seed                 # popula marcas, categorias, vendedores e peças
pnpm seed:images             # (opcional) baixa imagens e envia ao R2
pnpm dev                     # http://localhost:3000
```

## 🔑 Variáveis de ambiente (`.env.local`)
| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Neon **pooled** (`-pooler`) — usada pela aplicação |
| `DATABASE_URL_UNPOOLED` | Neon **direct** — usada por migrações/seed |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | Cloudflare R2 (upload) |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | URL pública do R2 (`https://pub-xxxx.r2.dev`) para exibir imagens |
| `PEXELS_API_KEY` | (opcional) fotos reais no `seed:images`; sem ela, gera placeholders |
| `ADMIN_USER`, `ADMIN_PASSWORD` | credenciais do `/admin` (Basic Auth) |

## 🧪 Testes
```bash
pnpm test        # roda a suíte completa (Vitest)
pnpm test:watch  # modo watch
```
Cobre utilitários (preço/slug), consultas Drizzle (contra PGlite em memória),
reducer do carrinho, validações Zod e componentes.

## 📦 Scripts
| Script | O que faz |
|---|---|
| `pnpm dev` / `build` / `start` | desenvolvimento / build / produção |
| `pnpm test` | testes |
| `pnpm db:generate` | gera migrações a partir do schema Drizzle |
| `pnpm db:migrate` | aplica migrações no Neon |
| `pnpm db:seed` | popula o banco |
| `pnpm db:studio` | Drizzle Studio |
| `pnpm seed:images` | baixa imagens e envia ao R2 |

## ☁️ Deploy na Vercel
```bash
npm i -g vercel        # ou use: npx vercel
vercel login
vercel                 # cria o projeto e faz um deploy de preview
vercel --prod          # deploy de produção
```
Depois, no painel da Vercel (**Project → Settings → Environment Variables**), configure
as mesmas variáveis do `.env.local` (ou via `vercel env add NOME`). O Neon e o R2 são os
mesmos de desenvolvimento — não é preciso recriar o banco.

> O aviso *"middleware is deprecated, use proxy"* do Next 16 é inofensivo: o Basic Auth do
> `/admin` continua funcionando normalmente.

## 🗂️ Estrutura
```
src/
  app/            rotas (home, /pecas, /pecas/[slug], /carrinho, /checkout, /admin)
    _actions/     server actions (leads, orders, parts)
  components/     UI (header, footer, cards, formulários, carrinho)
  db/             schema, client, migrate, seed (Drizzle/Neon)
  lib/            utils (format, slug, cn, r2, queries, cart, validation)
scripts/          pipeline de imagens (R2)
drizzle/          migrações geradas
```

## ⚠️ Notas
- Imagens são **genéricas/ilustrativas** (Pexels — uso comercial livre).
- Checkout e pagamento são **simulados** (nenhuma cobrança é feita).
- A autenticação do admin é **grau-POC** (Basic Auth). Em produção, use um provedor de identidade.
