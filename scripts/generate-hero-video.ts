import { config } from "dotenv";
config({ path: ".env.local" });

import { uploadToR2 } from "../src/lib/r2-server";

const KEY = process.env.OPENAI_API_KEY;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const prompt =
  "Commercial advertisement shot, 8 seconds. A friendly, professional woman " +
  "presenter in her early 30s stands in a bright, modern electric-vehicle parts " +
  "showroom, looking straight at the camera and speaking confidently with a warm " +
  "smile. Clean premium lighting with subtle emerald-green accents, shallow depth " +
  "of field, polished brand-commercial feel. She gestures welcomingly toward " +
  "shelves of car parts. She speaks in Brazilian Portuguese: 'Amperia: a peca do " +
  "seu carro eletrico, sem espera.' Subtle upbeat background music.";

type Job = { id: string; status: string; progress?: number; error?: unknown };

async function main() {
  if (!KEY) {
    console.error("OPENAI_API_KEY ausente no .env.local");
    process.exit(1);
  }

  let job: Job;
  const resumeId = process.env.RESUME_VIDEO_ID;
  if (resumeId) {
    job = { id: resumeId, status: "in_progress" };
    console.log(`Retomando job existente: ${resumeId}`);
  } else {
    const form = new FormData();
    form.set("model", "sora-2");
    form.set("prompt", prompt);
    form.set("size", "1280x720");
    form.set("seconds", "8");

    const createRes = await fetch("https://api.openai.com/v1/videos", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}` },
      body: form,
    });
    if (!createRes.ok) {
      console.error(
        `Falha ao criar vídeo (${createRes.status}): ${(await createRes.text()).slice(0, 500)}`,
      );
      process.exit(1);
    }
    job = (await createRes.json()) as Job;
    console.log(`Job criado: ${job.id} (${job.status})`);
  }

  const started = Date.now();
  while (job.status === "queued" || job.status === "in_progress") {
    if (Date.now() - started > 15 * 60 * 1000) {
      console.error("Timeout (15 min).");
      process.exit(1);
    }
    await sleep(12000);
    let text: string;
    try {
      const s = await fetch(`https://api.openai.com/v1/videos/${job.id}`, {
        headers: { Authorization: `Bearer ${KEY}` },
      });
      if (!s.ok) {
        console.warn(`  poll HTTP ${s.status}, repetindo…`);
        continue;
      }
      text = await s.text();
    } catch {
      console.warn("  poll: erro de rede, repetindo…");
      continue;
    }
    try {
      job = JSON.parse(text) as Job;
    } catch {
      console.warn("  poll: resposta não-JSON (transitória), repetindo…");
      continue;
    }
    console.log(
      `  status: ${job.status}${job.progress != null ? ` ${job.progress}%` : ""}`,
    );
  }

  if (job.status !== "completed") {
    console.error(`Geração não concluída: ${JSON.stringify(job).slice(0, 500)}`);
    process.exit(1);
  }

  const vid = await fetch(
    `https://api.openai.com/v1/videos/${job.id}/content`,
    { headers: { Authorization: `Bearer ${KEY}` } },
  );
  if (!vid.ok) {
    console.error(`Falha no download do vídeo (${vid.status}).`);
    process.exit(1);
  }
  const mp4 = Buffer.from(await vid.arrayBuffer());
  await uploadToR2("media/hero.mp4", mp4, "video/mp4");
  console.log(`✅ media/hero.mp4 (${(mp4.length / 1024 / 1024).toFixed(1)} MB)`);

  try {
    const th = await fetch(
      `https://api.openai.com/v1/videos/${job.id}/content?variant=thumbnail`,
      { headers: { Authorization: `Bearer ${KEY}` } },
    );
    if (th.ok) {
      const thumb = Buffer.from(await th.arrayBuffer());
      await uploadToR2("media/hero-poster.jpg", thumb, "image/jpeg");
      console.log(`✅ media/hero-poster.jpg (${(thumb.length / 1024).toFixed(0)} KB)`);
    }
  } catch {
    // poster é opcional
  }

  console.log("🏁 Vídeo do hero pronto no R2.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
