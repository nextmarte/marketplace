import { config } from "dotenv";
config({ path: ".env.local" });

import sharp from "sharp";
import { uploadToR2 } from "../src/lib/r2-server";

type Asset = { asset: string; query: string; label: string };

// 12 assets representativos — cada peça do seed referencia um destes.
const assets: Asset[] = [
  { asset: "freio", query: "car brake disc pads", label: "Freios" },
  { asset: "recarga", query: "electric car charging plug", label: "Recarga" },
  { asset: "bateria", query: "car battery", label: "Bateria 12V" },
  { asset: "eletronica", query: "car electronic control unit", label: "Eletronica" },
  { asset: "filtro", query: "car cabin air filter", label: "Filtro" },
  { asset: "suspensao", query: "car shock absorber suspension", label: "Suspensao" },
  { asset: "iluminacao", query: "car led headlight", label: "Iluminacao" },
  { asset: "retrovisor", query: "car side mirror", label: "Retrovisor" },
  { asset: "carroceria", query: "car bumper", label: "Carroceria" },
  { asset: "pneu", query: "car tire", label: "Pneu" },
  { asset: "arrefecimento", query: "car water pump coolant", label: "Arrefecimento" },
  { asset: "palheta", query: "car windshield wiper blade", label: "Palhetas" },
];

async function findImageUrl(a: Asset): Promise<string> {
  const key = process.env.PEXELS_API_KEY;
  if (key) {
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
      const src = data.photos?.[0]?.src?.large2x;
      if (src) return src;
    }
    console.warn(`⚠️  Pexels sem resultado para "${a.query}" — usando placeholder.`);
  }
  return `https://placehold.co/1000x750/0b1220/03c489.png?text=${encodeURIComponent(
    a.label,
  )}`;
}

async function main() {
  let count = 0;
  for (const a of assets) {
    const url = await findImageUrl(a);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`❌ Falha ao baixar ${url} (${res.status})`);
      continue;
    }
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
  console.log(`\n🏁 ${count}/${assets.length} imagens enviadas ao R2.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
