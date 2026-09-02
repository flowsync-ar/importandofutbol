import { describe, expect, it } from "vitest";
import { adHref, isVisibleAd, type Ad } from "@/lib/ads";

describe("adHref", () => {
  it("adds https when the admin skips it", () => {
    expect(adHref("https://marca.com")).toBe("https://marca.com");
    expect(adHref("marca.com/promo")).toBe("https://marca.com/promo");
    expect(adHref("/camisetas")).toBe("/camisetas");
    expect(adHref("  ")).toBeNull();
  });
});

describe("isVisibleAd", () => {
  it("hides empty or inactive spots", () => {
    const ad: Ad = { id: "1", slot: "home", title: "Hola", description: "", href: "https://x.com", image_url: "https://cdn/x.jpg", active: true };
    expect(isVisibleAd(ad)).toBe(true);
    expect(isVisibleAd({ ...ad, active: false })).toBe(false);
    expect(isVisibleAd({ ...ad, image_url: null })).toBe(false);
  });
});
