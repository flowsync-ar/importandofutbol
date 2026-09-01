import { describe, expect, it } from "vitest";
import { blankToNull, STORE_WHATSAPP, storeWhatsAppHref, whatsappHref } from "@/lib/customer";

describe("whatsappHref", () => {
  it("keeps only digits for the chat link", () => {
    expect(whatsappHref("+54 9 2954 123456")).toBe("https://wa.me/5492954123456");
  });

  it("returns null without a number", () => {
    expect(whatsappHref("  ")).toBeNull();
  });

  it("opens the store WhatsApp chat with the message", () => {
    expect(storeWhatsAppHref("Hola")).toBe(`https://wa.me/5492954827189?text=${encodeURIComponent("Hola")}`);
    expect(STORE_WHATSAPP).toContain("2954");
  });
});

describe("blankToNull", () => {
  it("stores empty extras as null", () => {
    expect(blankToNull("  ")).toBeNull();
    expect(blankToNull(" Ana ")).toBe("Ana");
  });
});
