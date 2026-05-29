import { config } from "dotenv";
config({ path: ".env.local" });

import { uploadToR2 } from "../src/lib/r2-server";

const KEY = process.env.OPENAI_API_KEY;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const clips = [
  {
    key: "media/hero-3.mp4",
    prompt:
      "Macro cinematic product shot: a Type 2 EV charging connector with a " +
      "coiled cable rotating slowly on a reflective dark surface, emerald-green " +
      "rim lighting, crisp reflections, premium commercial look, shallow depth " +
      "of field. No people, no text, no logos.",
  },
  {
    key: "media/hero-4.mp4",
    prompt:
      "Cinematic dolly shot moving past tidy warehouse shelves stacked with " +
      "boxed electric-vehicle parts and tires, cool blue and emerald-green " +
      "lighting, futuristic clean logistics feel, depth of field. No people, " +
      "no text, no logos.",
  },
];

type Job = { id: string; status: string; progress?: number };

async function createJob(prompt: string): Promise<Job | null> {
  const form = new FormData();
  form.set("model", "sora-2");
  form.set("prompt", prompt);
  form.set("size", "1280x720");
  form.set("seconds", "8");
  const res = await fetch("https://api.openai.com/v1/videos", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}` },
    body: form,
  });
  if (!res.ok) {
    console.error(`  create ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return null;
  }
  return (await res.json()) as Job;
}

async function pollUntilDone(id: string): Promise<string> {
  const started = Date.now();
  let status = "in_progress";
  while (status === "queued" || status === "in_progress") {
    if (Date.now() - started > 15 * 60 * 1000) return "timeout";
    await sleep(12000);
    try {
      const s = await fetch(`https://api.openai.com/v1/videos/${id}`, {
        headers: { Authorization: `Bearer ${KEY}` },
      });
      if (!s.ok) {
        console.warn(`  poll HTTP ${s.status}, repetindo…`);
        continue;
      }
      const job = JSON.parse(await s.text()) as Job;
      status = job.status;
      console.log(
        `  ${status}${job.progress != null ? ` ${job.progress}%` : ""}`,
      );
    } catch {
      console.warn("  poll transitório, repetindo…");
    }
  }
  return status;
}

async function generateWithSora(clip: (typeof clips)[number]): Promise<boolean> {
  const job = await createJob(clip.prompt);
  if (!job) return false;
  console.log(`  job ${job.id} (${job.status})`);
  const status = await pollUntilDone(job.id);
  if (status !== "completed") {
    console.error(`  status final: ${status}`);
    return false;
  }
  const vid = await fetch(
    `https://api.openai.com/v1/videos/${job.id}/content`,
    { headers: { Authorization: `Bearer ${KEY}` } },
  );
  if (!vid.ok) {
    console.error(`  download ${vid.status}`);
    return false;
  }
  const mp4 = Buffer.from(await vid.arrayBuffer());
  await uploadToR2(clip.key, mp4, "video/mp4");
  console.log(`✅ ${clip.key} (${(mp4.length / 1024 / 1024).toFixed(1)} MB)`);
  return true;
}

async function main() {
  if (!KEY) {
    console.error("OPENAI_API_KEY ausente no .env.local");
    process.exit(1);
  }
  let ok = 0;
  for (const clip of clips) {
    console.log(`\n— Gerando ${clip.key} —`);
    if (await generateWithSora(clip)) ok++;
    else console.error(`Falhou (Sora): ${clip.key}`);
  }
  console.log(`\n🏁 ${ok}/${clips.length} vídeos enviados ao R2.`);
  process.exit(ok === clips.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
