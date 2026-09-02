import { describe, expect, it } from "vitest";
import { contactHref, isWhatsAppContact } from "@/lib/contacts";

describe("contactHref", () => {
  it("builds Instagram, TikTok and WhatsApp links from the name and handle", () => {
    expect(contactHref({ name: "Instagram", value: "@Importandofutbol.lp", href: null })).toBe("https://instagram.com/Importandofutbol.lp");
    expect(contactHref({ name: "TikTok", value: "@tienda", href: null })).toBe("https://www.tiktok.com/@tienda");
    expect(contactHref({ name: "WhatsApp", value: "+54 9 2954 827189", href: null })).toBe("https://wa.me/5492954827189");
  });

  it("keeps an explicit URL", () => {
    expect(contactHref({ name: "TikTok", value: "@x", href: "https://tiktok.com/@custom" })).toBe("https://tiktok.com/@custom");
  });
});

describe("isWhatsAppContact", () => {
  it("detects the WhatsApp channel for the consult button", () => {
    expect(isWhatsAppContact({ name: "WhatsApp" })).toBe(true);
    expect(isWhatsAppContact({ name: "TikTok" })).toBe(false);
  });
});
