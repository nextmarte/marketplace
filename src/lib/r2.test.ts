import { afterEach, describe, expect, it, vi } from "vitest";
import { publicImageUrl } from "./r2";

describe("publicImageUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("retorna null quando a base pública não está configurada", () => {
    vi.stubEnv("NEXT_PUBLIC_R2_PUBLIC_URL", "");
    expect(publicImageUrl("parts/freio.webp")).toBeNull();
  });

  it("retorna null quando não há key", () => {
    vi.stubEnv("NEXT_PUBLIC_R2_PUBLIC_URL", "https://pub-x.r2.dev");
    expect(publicImageUrl(null)).toBeNull();
  });

  it("junta base e key sem barras duplicadas", () => {
    vi.stubEnv("NEXT_PUBLIC_R2_PUBLIC_URL", "https://pub-x.r2.dev/");
    expect(publicImageUrl("parts/freio.webp")).toBe(
      "https://pub-x.r2.dev/parts/freio.webp",
    );
  });
});
