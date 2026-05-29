import { config } from "dotenv";
config({ path: ".env.local" });

import { getDb } from "./index";
import {
  brands,
  categories,
  leads,
  orderItems,
  orders,
  partBrands,
  parts,
  sellers,
} from "./schema";
import { slugify } from "../lib/slug";
import type { StockStatus } from "../lib/format";

const brandData = [
  { name: "BYD", country: "China" },
  { name: "GWM", country: "China" },
  { name: "Volvo", country: "Suécia" },
  { name: "Renault", country: "França" },
  { name: "Nissan", country: "Japão" },
  { name: "Chevrolet", country: "EUA" },
  { name: "JAC", country: "China" },
  { name: "Caoa Chery", country: "China/Brasil" },
  { name: "BMW", country: "Alemanha" },
  { name: "Tesla", country: "EUA" },
];

const categoryData = [
  { name: "Freios", description: "Pastilhas, discos e sensores de frenagem." },
  { name: "Suspensão", description: "Bandejas, amortecedores e bieletas." },
  { name: "Recarga", description: "Cabos, conectores Tipo 2 e adaptadores." },
  { name: "Filtros", description: "Filtros de cabine e ar-condicionado." },
  {
    name: "Elétrica & Bateria 12V",
    description: "Bateria auxiliar 12V, conversores e carregadores.",
  },
  { name: "Carroceria", description: "Para-choques, retrovisores e maçanetas." },
  { name: "Iluminação", description: "Faróis e lanternas em LED." },
  { name: "Pneus & Rodas", description: "Pneus de baixa resistência e TPMS." },
  {
    name: "Arrefecimento",
    description: "Gerenciamento térmico do pack de bateria.",
  },
];

const sellerData = [
  { name: "EV Parts Brasil", city: "São Paulo, SP", rating: 49 },
  { name: "ReposiCar Elétricos", city: "Curitiba, PR", rating: 47 },
  { name: "Volt Distribuidora", city: "Campinas, SP", rating: 48 },
];

type SeedPart = {
  name: string;
  description: string;
  sku: string;
  category: string;
  seller: string;
  priceCents: number;
  status: StockStatus;
  featured?: boolean;
  image: string;
  brands: { brand: string; model: string }[];
};

const partData: SeedPart[] = [
  {
    name: "Pastilha de Freio Dianteira",
    description: "Jogo de pastilhas cerâmicas dianteiras com baixo ruído.",
    sku: "FR-1001",
    category: "freios",
    seller: "ev-parts-brasil",
    priceCents: 38900,
    status: "em_falta",
    featured: true,
    image: "freio",
    brands: [
      { brand: "byd", model: "Dolphin" },
      { brand: "byd", model: "Yuan Plus" },
    ],
  },
  {
    name: "Pastilha de Freio Traseira",
    description: "Pastilhas traseiras compatíveis com sistema de frenagem regenerativa.",
    sku: "FR-1002",
    category: "freios",
    seller: "reposicar-eletricos",
    priceCents: 32900,
    status: "sob_encomenda",
    image: "freio",
    brands: [{ brand: "gwm", model: "Ora 03" }],
  },
  {
    name: "Disco de Freio Ventilado Dianteiro",
    description: "Disco ventilado de alta dissipação para uso urbano e estrada.",
    sku: "FR-1003",
    category: "freios",
    seller: "ev-parts-brasil",
    priceCents: 64900,
    status: "em_falta",
    image: "freio",
    brands: [
      { brand: "byd", model: "Song Plus" },
      { brand: "volvo", model: "XC40 Recharge" },
    ],
  },
  {
    name: "Disco de Freio Traseiro",
    description: "Disco traseiro sólido com tratamento anticorrosão.",
    sku: "FR-1004",
    category: "freios",
    seller: "volt-distribuidora",
    priceCents: 44900,
    status: "disponivel",
    image: "freio",
    brands: [{ brand: "nissan", model: "Leaf" }],
  },
  {
    name: "Sensor ABS Dianteiro",
    description: "Sensor de rotação da roda para o módulo ABS/ESP.",
    sku: "FR-1005",
    category: "freios",
    seller: "reposicar-eletricos",
    priceCents: 34900,
    status: "sob_encomenda",
    image: "eletronica",
    brands: [{ brand: "bmw", model: "iX1" }],
  },
  {
    name: "Conector de Recarga Tipo 2 (Mennekes)",
    description: "Conector fêmea Tipo 2 para reparo de estações e cabos.",
    sku: "RC-2001",
    category: "recarga",
    seller: "ev-parts-brasil",
    priceCents: 89900,
    status: "em_falta",
    featured: true,
    image: "recarga",
    brands: [
      { brand: "byd", model: "Diversos" },
      { brand: "gwm", model: "Diversos" },
      { brand: "renault", model: "Diversos" },
    ],
  },
  {
    name: "Cabo de Recarga Modo 3 (Tipo 2, 32A)",
    description: "Cabo de recarga AC trifásico até 22 kW, 5 metros.",
    sku: "RC-2002",
    category: "recarga",
    seller: "volt-distribuidora",
    priceCents: 159900,
    status: "sob_encomenda",
    featured: true,
    image: "recarga",
    brands: [
      { brand: "byd", model: "Diversos" },
      { brand: "tesla", model: "Diversos" },
    ],
  },
  {
    name: "Adaptador de Recarga Tipo 1 para Tipo 2",
    description: "Adaptador para recarregar veículos Tipo 1 em estações Tipo 2.",
    sku: "RC-2003",
    category: "recarga",
    seller: "reposicar-eletricos",
    priceCents: 45900,
    status: "em_falta",
    image: "recarga",
    brands: [{ brand: "nissan", model: "Leaf" }],
  },
  {
    name: "Bateria Auxiliar 12V AGM",
    description: "Bateria auxiliar AGM 12V que alimenta os módulos do veículo.",
    sku: "EL-3001",
    category: "eletrica-bateria-12v",
    seller: "ev-parts-brasil",
    priceCents: 79900,
    status: "em_falta",
    featured: true,
    image: "bateria",
    brands: [
      { brand: "byd", model: "Dolphin" },
      { brand: "byd", model: "Seal" },
      { brand: "tesla", model: "Model 3" },
    ],
  },
  {
    name: "Conversor DC-DC",
    description: "Conversor de alta para baixa tensão (carrega a bateria 12V).",
    sku: "EL-3002",
    category: "eletrica-bateria-12v",
    seller: "volt-distribuidora",
    priceCents: 289900,
    status: "sob_encomenda",
    image: "eletronica",
    brands: [{ brand: "jac", model: "e-JS1" }],
  },
  {
    name: "Módulo Carregador de Bordo (OBC)",
    description: "On-Board Charger responsável pela recarga AC do pack.",
    sku: "EL-3003",
    category: "eletrica-bateria-12v",
    seller: "reposicar-eletricos",
    priceCents: 489900,
    status: "em_falta",
    image: "eletronica",
    brands: [{ brand: "caoa-chery", model: "iCar" }],
  },
  {
    name: "Filtro de Cabine com Carvão Ativado",
    description: "Filtro de ar-condicionado com carvão ativado antiodor.",
    sku: "FL-4001",
    category: "filtros",
    seller: "ev-parts-brasil",
    priceCents: 12900,
    status: "disponivel",
    image: "filtro",
    brands: [
      { brand: "byd", model: "Yuan Plus" },
      { brand: "gwm", model: "Ora 03" },
    ],
  },
  {
    name: "Bandeja de Suspensão Dianteira",
    description: "Bandeja inferior com pivô e buchas para a suspensão dianteira.",
    sku: "SP-5001",
    category: "suspensao",
    seller: "reposicar-eletricos",
    priceCents: 54900,
    status: "em_falta",
    image: "suspensao",
    brands: [{ brand: "byd", model: "Song Plus" }],
  },
  {
    name: "Amortecedor Dianteiro",
    description: "Amortecedor pressurizado dianteiro calibrado para EV.",
    sku: "SP-5002",
    category: "suspensao",
    seller: "volt-distribuidora",
    priceCents: 47900,
    status: "sob_encomenda",
    image: "suspensao",
    brands: [{ brand: "renault", model: "Kwid E-Tech" }],
  },
  {
    name: "Bieleta Estabilizadora",
    description: "Bieleta da barra estabilizadora com terminais reforçados.",
    sku: "SP-5003",
    category: "suspensao",
    seller: "ev-parts-brasil",
    priceCents: 18900,
    status: "disponivel",
    image: "suspensao",
    brands: [{ brand: "chevrolet", model: "Bolt EV" }],
  },
  {
    name: "Farol Full LED Dianteiro Direito",
    description: "Conjunto óptico Full LED com DRL para o lado direito.",
    sku: "IL-6001",
    category: "iluminacao",
    seller: "ev-parts-brasil",
    priceCents: 389900,
    status: "em_falta",
    featured: true,
    image: "iluminacao",
    brands: [{ brand: "byd", model: "Seal" }],
  },
  {
    name: "Lanterna Traseira em LED",
    description: "Lanterna traseira LED de reposição com conector original.",
    sku: "IL-6002",
    category: "iluminacao",
    seller: "reposicar-eletricos",
    priceCents: 129900,
    status: "sob_encomenda",
    image: "iluminacao",
    brands: [{ brand: "gwm", model: "Ora 03" }],
  },
  {
    name: "Palhetas do Limpador (par)",
    description: "Par de palhetas de silicone dianteiras de encaixe rápido.",
    sku: "CB-7001",
    category: "carroceria",
    seller: "volt-distribuidora",
    priceCents: 8900,
    status: "disponivel",
    image: "palheta",
    brands: [
      { brand: "byd", model: "Diversos" },
      { brand: "gwm", model: "Diversos" },
    ],
  },
  {
    name: "Retrovisor Externo Elétrico Esquerdo",
    description: "Espelho retrovisor elétrico com pisca integrado, lado esquerdo.",
    sku: "CB-7002",
    category: "carroceria",
    seller: "ev-parts-brasil",
    priceCents: 109900,
    status: "em_falta",
    image: "retrovisor",
    brands: [{ brand: "byd", model: "Dolphin" }],
  },
  {
    name: "Maçaneta Externa Escamoteável",
    description: "Maçaneta retrátil com atuador — item de alta procura.",
    sku: "CB-7003",
    category: "carroceria",
    seller: "reposicar-eletricos",
    priceCents: 69900,
    status: "em_falta",
    featured: true,
    image: "retrovisor",
    brands: [{ brand: "tesla", model: "Model 3" }],
  },
  {
    name: "Para-choque Dianteiro",
    description: "Para-choque dianteiro com recortes para sensores e câmera.",
    sku: "CB-7004",
    category: "carroceria",
    seller: "volt-distribuidora",
    priceCents: 219900,
    status: "sob_encomenda",
    image: "carroceria",
    brands: [{ brand: "tesla", model: "Model Y" }],
  },
  {
    name: "Pneu Aro 18 de Baixa Resistência",
    description: "Pneu de baixa resistência ao rolamento para maior autonomia.",
    sku: "PN-8001",
    category: "pneus-rodas",
    seller: "ev-parts-brasil",
    priceCents: 89900,
    status: "disponivel",
    image: "pneu",
    brands: [{ brand: "byd", model: "Atto 3" }],
  },
  {
    name: "Sensor de Pressão dos Pneus (TPMS)",
    description: "Sensor TPMS programável de reposição, 433 MHz.",
    sku: "PN-8002",
    category: "pneus-rodas",
    seller: "reposicar-eletricos",
    priceCents: 24900,
    status: "em_falta",
    image: "pneu",
    brands: [
      { brand: "byd", model: "Diversos" },
      { brand: "gwm", model: "Diversos" },
    ],
  },
  {
    name: "Bomba d'Água Elétrica de Arrefecimento",
    description: "Bomba elétrica do circuito de arrefecimento do pack de bateria.",
    sku: "AR-9001",
    category: "arrefecimento",
    seller: "ev-parts-brasil",
    priceCents: 99900,
    status: "em_falta",
    featured: true,
    image: "arrefecimento",
    brands: [
      { brand: "byd", model: "Seal" },
      { brand: "byd", model: "Dolphin" },
    ],
  },
  {
    name: "Válvula Térmica do Pack de Bateria",
    description: "Válvula de controle térmico do gerenciamento da bateria.",
    sku: "AR-9002",
    category: "arrefecimento",
    seller: "volt-distribuidora",
    priceCents: 74900,
    status: "sob_encomenda",
    image: "arrefecimento",
    brands: [{ brand: "gwm", model: "Ora 03" }],
  },
  {
    name: "Fluido de Arrefecimento de Bateria (1L)",
    description: "Fluido dielétrico/glicol para o circuito térmico da bateria.",
    sku: "AR-9003",
    category: "arrefecimento",
    seller: "reposicar-eletricos",
    priceCents: 9900,
    status: "disponivel",
    image: "arrefecimento",
    brands: [
      { brand: "byd", model: "Diversos" },
      { brand: "gwm", model: "Diversos" },
      { brand: "volvo", model: "Diversos" },
    ],
  },
];

async function main() {
  const db = getDb();

  // Limpa em ordem segura para as FKs
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(leads);
  await db.delete(partBrands);
  await db.delete(parts);
  await db.delete(brands);
  await db.delete(categories);
  await db.delete(sellers);

  const insertedBrands = await db
    .insert(brands)
    .values(brandData.map((b) => ({ ...b, slug: slugify(b.name) })))
    .returning();
  const brandId = Object.fromEntries(
    insertedBrands.map((b) => [b.slug, b.id]),
  );

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData.map((c) => ({ ...c, slug: slugify(c.name) })))
    .returning();
  const categoryId = Object.fromEntries(
    insertedCategories.map((c) => [c.slug, c.id]),
  );

  const insertedSellers = await db
    .insert(sellers)
    .values(sellerData.map((s) => ({ ...s, slug: slugify(s.name) })))
    .returning();
  const sellerId = Object.fromEntries(
    insertedSellers.map((s) => [s.slug, s.id]),
  );

  for (const p of partData) {
    const [inserted] = await db
      .insert(parts)
      .values({
        name: p.name,
        slug: slugify(p.name),
        description: p.description,
        sku: p.sku,
        categoryId: categoryId[p.category],
        sellerId: sellerId[p.seller],
        priceCents: p.priceCents,
        stockStatus: p.status,
        featured: p.featured ?? false,
        imageKey: `parts/${slugify(p.name)}.webp`,
      })
      .returning();

    if (p.brands.length > 0) {
      // A PK de part_brands é (peça, marca); agrupa modelos da mesma marca.
      const byBrand = new Map<string, string[]>();
      for (const b of p.brands) {
        const models = byBrand.get(b.brand) ?? [];
        models.push(b.model);
        byBrand.set(b.brand, models);
      }
      await db.insert(partBrands).values(
        [...byBrand.entries()].map(([brand, models]) => ({
          partId: inserted.id,
          brandId: brandId[brand],
          model: models.join(", "),
        })),
      );
    }
  }

  console.log(
    `✅ Seed concluído: ${insertedBrands.length} marcas, ${insertedCategories.length} categorias, ${insertedSellers.length} vendedores, ${partData.length} peças.`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
