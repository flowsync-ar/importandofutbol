import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Catalog } from "@/components/catalog";
import { StoreProvider } from "@/components/store-provider";
import products from "@/data/products.json";

const renderCatalog = () => render(<StoreProvider><Catalog products={products} /></StoreProvider>);

describe("Catalog", () => {
  it("filters products by search and category", () => {
    renderCatalog();
    fireEvent.change(screen.getByLabelText("Buscar camisetas"), { target: { value: "Argentina" } });
    expect(screen.getByText("Camiseta Argentina")).toBeVisible();
    expect(screen.queryByText("Camiseta Club Blanca")).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no matches", () => {
    renderCatalog();
    fireEvent.change(screen.getByLabelText("Buscar camisetas"), { target: { value: "Inter Miami" } });
    expect(screen.getByText(/no encontramos camisetas/i)).toBeVisible();
  });

  it("lists extra categories from the store", () => {
    render(<StoreProvider><Catalog products={products} categoryNames={["Niños"]} /></StoreProvider>);
    expect(screen.getByRole("option", { name: "Niños" })).toBeInTheDocument();
  });
});
