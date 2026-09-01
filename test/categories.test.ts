import { describe, expect, it } from "vitest";
import { slugifyCategory, storeNavLinks } from "@/lib/category";
import { parseSizes } from "@/lib/types";

describe("slugifyCategory", () => {
  it("turns names into URL slugs", () => {
    expect(slugifyCategory("Premier League")).toBe("premier-league");
    expect(slugifyCategory("Niños")).toBe("ninos");
  });
});

describe("storeNavLinks", () => {
  it("keeps shop pages around the catalog categories", () => {
    expect(storeNavLinks([{ name: "Niños", slug: "ninos" }]).map((link) => link.href)).toEqual(["/", "/camisetas", "/ninos", "/contacto"]);
  });
});

describe("parseSizes", () => {
  it("keeps comma-separated sizes until save", () => {
    expect(parseSizes("S, M, L, XL")).toEqual(["S", "M", "L", "XL"]);
    expect(parseSizes(["M", " L "])).toEqual(["M", "L"]);
    expect(parseSizes("S,")).toEqual(["S"]);
  });
});
