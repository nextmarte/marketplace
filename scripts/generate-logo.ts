import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const KEY = process.env.OPENAI_API_KEY;

const prompt =
  "A flat 2D vector emblem logo, app-icon style, for 'Amperia' — an electric " +
  "vehicle auto-parts marketplace. Concept: a lightning bolt integrated with a " +
  "mechanical gear/cog (energy meets car parts). Bold, geometric, minimal, solid " +
  "emerald electric-green (#03c489) shapes on a fully transparent background. " +
  "No text, no letters, no words, no numbers, no 3D, no gradients, no shadows, " +
  "no background. Centered, balanced, crisp clean edges.";

async function main() {
  if (!KEY) {
    console.error("OPENAI_API_KEY ausente no .env.local");
    process.exit(1);
  }

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      quality: "high",
      background: "transparent",
      output_format: "png",
      n: 1,
    }),
  });

  if (!res.ok) {
    console.error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 300)}`);
    process.exit(1);
  }

  const data = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    console.error("Resposta sem imagem.");
    process.exit(1);
  }

  const resized = await sharp(Buffer.from(b64, "base64"))
    .resize(256, 256, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const out = join(process.cwd(), "public", "logo.png");
  writeFileSync(out, resized);
  console.log(`✅ logo salvo em public/logo.png (${(resized.length / 1024).toFixed(0)} KB)`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
