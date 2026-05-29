# Amperia

Marketplace de peças de reposição para **carros elétricos** no Brasil, focado em itens
"notoriamente em falta nas concessionárias". POC.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Drizzle ORM + Neon (Postgres serverless)
- Cloudflare R2 (imagens, via AWS S3 SDK) + sharp
- Vitest + Testing Library (+ PGlite para testar repositórios) — TDD
- Deploy: Vercel

## Comandos
- `pnpm dev` — desenvolvimento (http://localhost:3000)
- `pnpm test` / `pnpm test:watch` — testes
- `pnpm db:push` — aplica o schema Drizzle no Neon
- `pnpm db:seed` — popula marcas, categorias, sellers e peças
- `pnpm seed:images` — baixa imagens curadas e envia ao R2
- `pnpm db:studio` — Drizzle Studio
- `pnpm build` / `pnpm start`

## Estrutura
- `src/app` — rotas (App Router)
- `src/db` — schema, client, seed
- `src/lib` — utils (format, slug, r2, validações zod)
- `src/components` — UI
- `scripts/` — pipeline de imagens
- `drizzle/` — migrações geradas

## Variáveis de ambiente
Ver `.env.example`. Local em `.env.local` (NÃO versionado).

## Convenções
- **TDD**: escreva o teste antes da implementação.
- **Commits atômicos** por feature (Conventional Commits, ex.: `feat(catalog): ...`).
- UI e conteúdo em **português (pt-BR)**.
- Preços em **centavos (int)** no banco; formatar com `formatPriceBRL` (`src/lib/format.ts`).
- Reutilize os utilitários de `src/lib` antes de criar novos.
