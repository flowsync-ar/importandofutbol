import { describe, expect, it } from "vitest";
import { blankToNull, consultLeadPayload, consultMessage, normalizePhone, STORE_WHATSAPP, storeWhatsAppHref, whatsappHref } from "@/lib/customer";

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

describe("normalizePhone", () => {
  it("keeps only digits for the customer record", () => {
    expect(normalizePhone("299 123-4567")).toBe("2991234567");
    expect(normalizePhone("12")).toBeNull();
  });
});

describe("consultLeadPayload", () => {
  it("stores a consult as a customer lead", () => {
    expect(consultLeadPayload(" Ana ", "299 123-4567", "Hola, Ajax")).toEqual({
      name: "Ana",
      phone: "2991234567",
      notes: "Hola, Ajax",
    });
  });
});

describe("consultMessage", () => {
  it("names the customer in the WhatsApp text", () => {
    expect(consultMessage("Ana", "Hola, quiero consultar por Ajax")).toBe("Hola, soy Ana.\nHola, quiero consultar por Ajax");
  });
});
