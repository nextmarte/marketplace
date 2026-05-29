import { describe, it, expect } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("remove acentos e normaliza espaços", () => {
    expect(slugify("Pastilha de Freio Dianteira")).toBe(
      "pastilha-de-freio-dianteira",
    );
  });

  it("remove símbolos e parênteses", () => {
    expect(slugify("Conector Tipo 2 (Mennekes)")).toBe("conector-tipo-2-mennekes");
  });

  it("não deixa hífens nas pontas", () => {
    expect(slugify("  BYD!  ")).toBe("byd");
  });
});
