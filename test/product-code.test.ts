import { describe, expect, it } from "vitest";
import { cartConsultMessage, formatProductCode, productCode, productConsultLine, productConsultMessage, productPicksConsultMessage, withConsultMedia } from "@/lib/product-code";

describe("formatProductCode", () => {
  it("pads sequential store codes", () => {
    expect(formatProductCode(1)).toBe("IF-0001");
    expect(formatProductCode(42)).toBe("IF-0042");
  });
});

describe("productCode", () => {
  it("prefers the saved code", () => {
    expect(productCode({ id: "abc", code: "if-0007" })).toBe("IF-0007");
  });

  it("falls back to a short id until SQL runs", () => {
    expect(productCode({ id: "11111111-2222-3333-4444-55555555abcd" })).toBe("IF-ABCD");
  });
});

describe("productConsultMessage", () => {
  it("puts the code in the WhatsApp text", () => {
    const product = { id: "1", name: "Selección de Brasil", code: "IF-0007" };
    expect(productConsultLine(product, "M")).toBe("Selección de Brasil (código IF-0007), talle M");
    expect(productConsultMessage(product, "L")).toBe("Hola, quiero consultar por Selección de Brasil (código IF-0007), talle L.");
    expect(productConsultMessage(product, "L", 3)).toBe("Hola, quiero consultar por Selección de Brasil (código IF-0007), talle L, cantidad 3.");
  });

  it("lists several sizes of the same jersey", () => {
    const product = { id: "1", name: "Selección de Brasil", code: "IF-0007" };
    expect(productPicksConsultMessage(product, [
      { size: "S", quantity: 1 },
      { size: "M", quantity: 1 },
      { size: "L", quantity: 2 },
    ])).toBe("Hola, quiero consultar por Selección de Brasil (código IF-0007):\n• talle S\n• talle M\n• talle L, cantidad 2");
  });
});

describe("cartConsultMessage", () => {
  it("lists each item with its code", () => {
    expect(cartConsultMessage([
      { id: "1", name: "Brasil", size: "M", code: "IF-0007" },
      { id: "2", name: "Inter", size: "L", quantity: 2, code: "IF-0003" },
    ])).toBe("Hola, quiero consultar por:\n• Brasil (código IF-0007), talle M\n• Inter (código IF-0003), talle L, cantidad 2");
  });
});

describe("withConsultMedia", () => {
  it("appends the photo and product page so WhatsApp can show them", () => {
    expect(withConsultMedia("Hola, quiero consultar por Brasil (código IF-0007).", { slug: "brasil", image: "/products/brasil.jpg" }, "https://tienda.test"))
      .toBe("Hola, quiero consultar por Brasil (código IF-0007).\nhttps://tienda.test/products/brasil.jpg\nhttps://tienda.test/camisetas/brasil");
  });
});
