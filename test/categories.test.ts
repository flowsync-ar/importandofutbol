import { describe, expect, it } from "vitest";
import { slugifyCategory, storeCategoryLinks, storeNavLinks } from "@/lib/category";
import { featuredProducts, formatPrice, parsePrice, parseSizes } from "@/lib/types";

describe("slugifyCategory", () => {
  it("turns names into URL slugs", () => {
    expect(slugifyCategory("Premier League")).toBe("premier-league");
    expect(slugifyCategory("Niños")).toBe("ninos");
  });
});

describe("storeNavLinks", () => {
  it("keeps the header to home, catalog and contact", () => {
    expect(storeNavLinks([{ name: "Niños", slug: "ninos" }]).map((link) => link.href)).toEqual(["/", "/camisetas", "/contacto"]);
  });
});

describe("storeCategoryLinks", () => {
  it("lists admin categories for the dropdown only", () => {
    expect(storeCategoryLinks([{ name: "Niños", slug: "ninos" }])).toEqual([{ label: "Niños", href: "/ninos" }]);
  });
});

describe("parseSizes", () => {
  it("keeps comma-separated sizes until save", () => {
    expect(parseSizes("S, M, L, XL")).toEqual(["S", "M", "L", "XL"]);
    expect(parseSizes(["M", " L "])).toEqual(["M", "L"]);
    expect(parseSizes("S,")).toEqual(["S"]);
  });
});

describe("parsePrice", () => {
  it("does not treat Argentine thousands as decimals", () => {
    expect(parsePrice("70000")).toBe(70000);
    expect(parsePrice("70.000")).toBe(70000);
    expect(parsePrice("70.000,50")).toBe(70000.5);
    expect(Number("70.000")).toBe(70);
  });
});

describe("formatPrice", () => {
  it("shows seventy thousand, not seventy", () => {
    expect(formatPrice(70000)).toMatch(/70[.\s\u00a0]000/);
    expect(formatPrice(70000)).not.toBe("$ 70");
  });
});

describe("featuredProducts", () => {
  it("keeps only highlighted products for the home carousel", () => {
    const products = [
      { id: "1", slug: "a", name: "A", category: "Clubes", team: "A", price: null, sizes: ["M"], badge: null, image: "", featured: true, featured_title: "Mundial" },
      { id: "2", slug: "b", name: "B", category: "Clubes", team: "B", price: null, sizes: ["M"], badge: null, image: "/photos/b.jpg" },
    ];
    expect(featuredProducts(products).map((product) => product.featured_title)).toEqual(["Mundial"]);
  });

  it("falls back to catalog photos when nothing is starred", () => {
    const products = [
      { id: "1", slug: "a", name: "A", category: "Clubes", team: "A", price: null, sizes: ["M"], badge: null, image: "/products/placeholder-club-1.jpg" },
      { id: "2", slug: "b", name: "B", category: "Clubes", team: "B", price: null, sizes: ["M"], badge: null, image: "https://cdn.example/b.jpg" },
    ];
    expect(featuredProducts(products).map((product) => product.id)).toEqual(["2"]);
  });
});
