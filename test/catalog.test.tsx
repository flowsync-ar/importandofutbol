import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Catalog } from "@/components/catalog";
import { ProductCard } from "@/components/product-card";
import { StoreProvider } from "@/components/store-provider";
import products from "@/data/products.json";
import type { Product } from "@/lib/types";

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

  it("shows the uploaded photo instead of the mock jersey", () => {
    const product = { ...(products[0] as Product), image: "https://cdn.example/argentina.jpg", images: ["https://cdn.example/argentina.jpg"] };
    render(<StoreProvider><ProductCard product={product} /></StoreProvider>);
    expect(screen.getByRole("img", { name: "Camiseta Argentina" })).toHaveAttribute("src", "https://cdn.example/argentina.jpg");
  });
});
