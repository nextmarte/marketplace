import { config } from "dotenv";
config({ path: ".env.local" });

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { uploadToR2 } from "../src/lib/r2-server";

const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
const keys = [
  "media/hero-1.mp4",
  "media/hero-2.mp4",
  "media/hero-3.mp4",
  "media/hero-4.mp4",
];

async function main() {
  if (!base) {
    console.error("NEXT_PUBLIC_R2_PUBLIC_URL ausente");
    process.exit(1);
  }
  const inFile = join(tmpdir(), "amperia-opt-in.mp4");
  const outFile = join(tmpdir(), "amperia-opt-out.mp4");

  for (const key of keys) {
    const res = await fetch(`${base}/${key}`);
    if (!res.ok) {
      console.warn(`pulando ${key} (${res.status})`);
      continue;
    }
    writeFileSync(inFile, Buffer.from(await res.arrayBuffer()));
    const before = readFileSync(inFile).length;

    // Reencoda leve: 720p, sem áudio, faststart (web).
    execFileSync(
      "ffmpeg",
      [
        "-y", "-i", inFile,
        "-an",
        "-vf", "scale=1280:-2",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "28",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        outFile,
      ],
      { stdio: "ignore" },
    );

    const out = readFileSync(outFile);
    await uploadToR2(key, out, "video/mp4");
    console.log(
      `✅ ${key}: ${(before / 1024 / 1024).toFixed(1)}MB → ${(out.length / 1024 / 1024).toFixed(1)}MB (+ cache 1 ano)`,
    );
  }
  console.log("🏁 vídeos otimizados e re-enviados ao R2.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
