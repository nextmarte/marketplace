import { config } from "dotenv";
config({ path: ".env.local" });

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { uploadToR2 } from "../src/lib/r2-server";

const KEY = process.env.OPENAI_API_KEY;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const prompt =
  "Cinematic b-roll gliding slowly through a bright, modern electric-vehicle " +
  "auto-parts store: tidy shelves of brake discs, coiled Type 2 charging " +
  "cables, boxed 12V batteries, LED headlights and suspension arms. Glossy " +
  "surfaces, soft premium lighting with subtle emerald-green accents, shallow " +
  "depth of field, smooth steady camera motion. No people, no text, no logos.";

type Job = { id: string; status: string; progress?: number };

async function main() {
  if (!KEY) {
    console.error("OPENAI_API_KEY ausente no .env.local");
    process.exit(1);
  }

  // 1) Gera UM vídeo (8s) no Sora.
  const form = new FormData();
  form.set("model", "sora-2");
  form.set("prompt", prompt);
  form.set("size", "1280x720");
  form.set("seconds", "8");
  const create = await fetch("https://api.openai.com/v1/videos", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}` },
    body: form,
  });
  if (!create.ok) {
    console.error(`create ${create.status}: ${(await create.text()).slice(0, 300)}`);
    process.exit(1);
  }
  let job = (await create.json()) as Job;
  console.log(`job ${job.id} (${job.status})`);

  const started = Date.now();
  while (job.status === "queued" || job.status === "in_progress") {
    if (Date.now() - started > 15 * 60 * 1000) {
      console.error("timeout");
      process.exit(1);
    }
    await sleep(12000);
    try {
      const s = await fetch(`https://api.openai.com/v1/videos/${job.id}`, {
        headers: { Authorization: `Bearer ${KEY}` },
      });
      if (!s.ok) {
        console.warn(`  poll ${s.status}, repetindo…`);
        continue;
      }
      job = JSON.parse(await s.text()) as Job;
      console.log(`  ${job.status}${job.progress != null ? ` ${job.progress}%` : ""}`);
    } catch {
      console.warn("  poll transitório, repetindo…");
    }
  }
  if (job.status !== "completed") {
    console.error(`status final: ${job.status}`);
    process.exit(1);
  }

  // 2) Baixa o MP4 completo.
  const v = await fetch(`https://api.openai.com/v1/videos/${job.id}/content`, {
    headers: { Authorization: `Bearer ${KEY}` },
  });
  if (!v.ok) {
    console.error(`download ${v.status}`);
    process.exit(1);
  }
  const full = join(tmpdir(), "amperia-hero-full.mp4");
  writeFileSync(full, Buffer.from(await v.arrayBuffer()));
  console.log(`baixado: ${full}`);

  // 3) Corta em dois (0–4s e 4s–fim), sem áudio, otimizado para web.
  const cut1 = join(tmpdir(), "amperia-hero-1.mp4");
  const cut2 = join(tmpdir(), "amperia-hero-2.mp4");
  const enc = ["-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];
  execFileSync("ffmpeg", ["-y", "-i", full, "-t", "4", ...enc, cut1], { stdio: "ignore" });
  execFileSync("ffmpeg", ["-y", "-ss", "4", "-i", full, ...enc, cut2], { stdio: "ignore" });

  // 4) Sobe os dois cortes ao R2.
  await uploadToR2("media/hero-1.mp4", readFileSync(cut1), "video/mp4");
  await uploadToR2("media/hero-2.mp4", readFileSync(cut2), "video/mp4");
  console.log("✅ media/hero-1.mp4 e media/hero-2.mp4 (2 cortes de 1 vídeo) no R2");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
