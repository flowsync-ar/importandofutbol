import { describe, expect, it } from "vitest";
import { blankToNull, whatsappHref } from "@/lib/customer";

describe("whatsappHref", () => {
  it("keeps only digits for the chat link", () => {
    expect(whatsappHref("+54 9 2954 123456")).toBe("https://wa.me/5492954123456");
  });

  it("returns null without a number", () => {
    expect(whatsappHref("  ")).toBeNull();
  });
});

describe("blankToNull", () => {
  it("stores empty extras as null", () => {
    expect(blankToNull("  ")).toBeNull();
    expect(blankToNull(" Ana ")).toBe("Ana");
  });
});
