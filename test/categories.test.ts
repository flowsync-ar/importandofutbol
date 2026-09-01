import { describe, expect, it } from "vitest";
import { slugifyCategory, storeCategoryLinks, storeNavLinks } from "@/lib/category";
import { featuredProducts, parseSizes } from "@/lib/types";

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

describe("featuredProducts", () => {
  it("keeps only highlighted products for the home carousel", () => {
    const products = [
      { id: "1", slug: "a", name: "A", category: "Clubes", team: "A", price: null, sizes: ["M"], badge: null, image: "", featured: true, featured_title: "Mundial" },
      { id: "2", slug: "b", name: "B", category: "Clubes", team: "B", price: null, sizes: ["M"], badge: null, image: "" },
    ];
    expect(featuredProducts(products).map((product) => product.featured_title)).toEqual(["Mundial"]);
  });
});
