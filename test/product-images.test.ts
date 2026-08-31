import { describe, expect, it } from "vitest";
import { productImageList, validateProductImage } from "@/lib/product-images";

describe("validateProductImage", () => {
  it("accepts a jpeg under the size limit", () => {
    expect(validateProductImage(new File(["ok"], "camiseta.jpg", { type: "image/jpeg" }))).toBeNull();
  });

  it("rejects unsupported types", () => {
    expect(validateProductImage(new File(["ok"], "camiseta.gif", { type: "image/gif" }))).toMatch(/JPG, PNG, WEBP o AVIF/);
  });

  it("prefers the image list over a single cover url", () => {
    expect(productImageList({ image_url: "a.jpg", image_urls: ["b.jpg", "c.jpg"] })).toEqual(["b.jpg", "c.jpg"]);
    expect(productImageList({ image_url: "a.jpg", image_urls: [] })).toEqual(["a.jpg"]);
  });
});
