import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import sharp from "sharp";
import { getDb } from "../src/db/index";
import { parts } from "../src/db/schema";
import { uploadToR2 } from "../src/lib/r2-server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Começa no gpt-image-1 (mais barato); cai para dall-e-3 se indisponível.
let model = "gpt-image-1";

function buildPrompt(name: string, category: string): string {
  return (
    `Realistic studio product photograph of a single automotive spare part: ${name} ` +
    `(category: ${category}) for an electric car. Isolated and centered on a clean light ` +
    `gray seamless background, soft even studio lighting, sharp focus, high detail. ` +
    `No text, no labels, no logos, no watermark, no people, no hands.`
  );
}

async function generate(prompt: string): Promise<Buffer | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const body =
      model === "gpt-image-1"
        ? { model, prompt, size: "1536x1024", quality: "low", n: 1 }
        : {
            model: "dall-e-3",
            prompt,
            size: "1792x1024",
            quality: "standard",
            n: 1,
            response_format: "b64_json",
          };

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = (await res.json()) as { data?: { b64_json?: string }[] };
      const b64 = data.data?.[0]?.b64_json;
      return b64 ? Buffer.from(b64, "base64") : null;
    }

    const txt = await res.text();
    if (res.status === 429) {
      await sleep(10000 * (attempt + 1));
      continue;
    }
    // Sem acesso ao gpt-image-1 → cai para dall-e-3 e tenta de novo.
    if (model === "gpt-image-1") {
      console.warn(`  gpt-image-1 indisponível (${res.status}); usando dall-e-3.`);
      model = "dall-e-3";
      continue;
    }
    console.error(`  OpenAI ${res.status}: ${txt.slice(0, 160)}`);
    return null;
  }
  return null;
}

async function main() {
  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY ausente no .env.local");
    process.exit(1);
  }

  const db = getDb();
  const all = await db.query.parts.findMany({ with: { category: true } });
  console.log(`Gerando ${all.length} imagens (modelo inicial: ${model})…\n`);

  let ok = 0;
  for (const p of all) {
    process.stdout.write(`• ${p.name} … `);
    try {
      const png = await generate(buildPrompt(p.name, p.category.name));
      if (!png) {
        console.log("falhou");
        continue;
      }
      const webp = await sharp(png)
        .resize(1000, 750, { fit: "cover" })
        .webp({ quality: 82 })
        .toBuffer();
      const key = `parts/${p.slug}.webp`;
      await uploadToR2(key, webp, "image/webp");
      await db.update(parts).set({ imageKey: key }).where(eq(parts.id, p.id));
      ok++;
      console.log(`ok → ${key} (${(webp.length / 1024).toFixed(0)}KB) [${model}]`);
    } catch (err) {
      console.log(`erro: ${(err as Error).message}`);
    }
    await sleep(800);
  }

  console.log(`\n🏁 ${ok}/${all.length} imagens geradas e enviadas ao R2.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
