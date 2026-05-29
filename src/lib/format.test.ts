import { describe, it, expect } from "vitest";
import { formatPriceBRL, stockStatusLabel } from "./format";

describe("formatPriceBRL", () => {
  it("formata centavos como real brasileiro", () => {
    expect(formatPriceBRL(123456).replace(/ /g, " ")).toBe("R$ 1.234,56");
  });

  it("formata zero", () => {
    expect(formatPriceBRL(0).replace(/ /g, " ")).toBe("R$ 0,00");
  });

  it("arredonda corretamente valores simples", () => {
    expect(formatPriceBRL(9990).replace(/ /g, " ")).toBe("R$ 99,90");
  });
});

describe("stockStatusLabel", () => {
  it("retorna rótulo de 'em falta'", () => {
    expect(stockStatusLabel("em_falta")).toBe("Em falta na concessionária");
  });

  it("retorna rótulo de 'disponível'", () => {
    expect(stockStatusLabel("disponivel")).toBe("Disponível");
  });
});
