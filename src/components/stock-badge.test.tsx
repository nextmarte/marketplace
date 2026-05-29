import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StockBadge } from "./stock-badge";

describe("StockBadge", () => {
  it("mostra o rótulo de 'em falta'", () => {
    render(<StockBadge status="em_falta" />);
    expect(
      screen.getByText("Em falta na concessionária"),
    ).toBeInTheDocument();
  });

  it("mostra o rótulo de 'sob encomenda'", () => {
    render(<StockBadge status="sob_encomenda" />);
    expect(screen.getByText("Sob encomenda")).toBeInTheDocument();
  });

  it("mostra o rótulo de 'disponível'", () => {
    render(<StockBadge status="disponivel" />);
    expect(screen.getByText("Disponível")).toBeInTheDocument();
  });
});
