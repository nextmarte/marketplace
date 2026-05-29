import { config } from "dotenv";
config({ path: ".env.local" });

import sharp from "sharp";
import { uploadToR2 } from "../src/lib/r2-server";

type Asset = { asset: string; query: string; label: string };

// 12 assets representativos — cada peça do seed referencia um destes.
const assets: Asset[] = [
  { asset: "freio", query: "car brake disc", label: "Freios" },
  { asset: "recarga", query: "electric car charging plug", label: "Recarga" },
  { asset: "bateria", query: "car battery", label: "Bateria 12V" },
  { asset: "eletronica", query: "car fuse box", label: "Eletronica" },
  { asset: "filtro", query: "car air filter", label: "Filtro" },
  { asset: "suspensao", query: "car coil spring suspension", label: "Suspensao" },
  { asset: "iluminacao", query: "car headlight", label: "Iluminacao" },
  { asset: "retrovisor", query: "car wing mirror", label: "Retrovisor" },
  { asset: "carroceria", query: "car bumper", label: "Carroceria" },
  { asset: "pneu", query: "car tyre", label: "Pneu" },
  { asset: "arrefecimento", query: "car water pump", label: "Arrefecimento" },
  { asset: "palheta", query: "windscreen wiper", label: "Palhetas" },
];

async function findFromPexels(a: Asset): Promise<string | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        a.query,
      )}&per_page=1&orientation=landscape`,
      { headers: { Authorization: key } },
    );
    if (res.ok) {
      const data = (await res.json()) as {
        photos?: { src?: { large2x?: string } }[];
      };
      return data.photos?.[0]?.src?.large2x ?? null;
    }
  } catch {
    // ignora e tenta a próxima fonte
  }
  return null;
}

async function findFromCommons(a: Asset): Promise<string | null> {
  try {
    const url =
      "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*" +
      `&generator=search&gsrnamespace=6&gsrlimit=1&gsrsearch=${encodeURIComponent(
        a.query,
      )}&prop=imageinfo&iiprop=url&iiurlwidth=1000`;
    const res = await fetch(url, {
      headers: { "User-Agent": "AmperiaPOC/1.0 (POC; demo)" },
    });
    if (res.ok) {
      const data = (await res.json()) as {
        query?: {
          pages?: Record<
            string,
            { imageinfo?: { url?: string; thumburl?: string }[] }
          >;
        };
      };
      const pages = data.query?.pages;
      if (pages) {
        const info = Object.values(pages)[0]?.imageinfo?.[0];
        return info?.thumburl ?? info?.url ?? null;
      }
    }
  } catch {
    // ignora e usa placeholder
  }
  return null;
}

async function findImageUrl(a: Asset): Promise<string> {
  const src = (await findFromPexels(a)) ?? (await findFromCommons(a));
  if (src) return src;
  console.warn(`⚠️  Sem foto para "${a.query}" — usando placeholder.`);
  return `https://placehold.co/1000x750/0b1220/03c489.png?text=${encodeURIComponent(
    a.label,
  )}`;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Baixa a imagem com retry exponencial em caso de 429 (rate limit). */
async function download(url: string, tries = 3): Promise<Response | null> {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, {
      headers: { "User-Agent": "AmperiaPOC/1.0 (POC; demo)" },
    });
    if (res.ok) return res;
    if (res.status === 429) {
      await sleep(2500 * (i + 1));
      continue;
    }
    console.error(`❌ ${url} (${res.status})`);
    return null;
  }
  console.error(`❌ ${url} (429 após ${tries} tentativas)`);
  return null;
}

async function main() {
  let count = 0;
  for (const a of assets) {
    const url = await findImageUrl(a);
    const res = await download(url);
    if (res) {
      const input = Buffer.from(await res.arrayBuffer());
      const output = await sharp(input)
        .resize(1000, 750, { fit: "cover" })
        .webp({ quality: 80 })
        .toBuffer();
      const key = `parts/${a.asset}.webp`;
      await uploadToR2(key, output, "image/webp");
      count++;
      console.log(`✅ ${key} (${(output.length / 1024).toFixed(0)} KB)`);
    }
    await sleep(1200);
  }
  console.log(`\n🏁 ${count}/${assets.length} imagens enviadas ao R2.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
