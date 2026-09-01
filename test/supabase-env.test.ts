import { afterEach, describe, expect, it } from "vitest";
import { supabasePublicEnv } from "@/lib/supabase/env";

const URL_KEY = "NEXT_PUBLIC_SUPABASE_URL";
const PUBLISHABLE_KEY = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

describe("supabasePublicEnv", () => {
  const previous = { url: process.env[URL_KEY], key: process.env[PUBLISHABLE_KEY] };

  afterEach(() => {
    if (previous.url === undefined) delete process.env[URL_KEY];
    else process.env[URL_KEY] = previous.url;
    if (previous.key === undefined) delete process.env[PUBLISHABLE_KEY];
    else process.env[PUBLISHABLE_KEY] = previous.key;
  });

  it("returns null when url or key is missing", () => {
    delete process.env[URL_KEY];
    delete process.env[PUBLISHABLE_KEY];
    expect(supabasePublicEnv()).toBeNull();
  });

  it("returns the pair when both are set", () => {
    process.env[URL_KEY] = "https://example.supabase.co";
    process.env[PUBLISHABLE_KEY] = "pub-key";
    expect(supabasePublicEnv()).toEqual({ url: "https://example.supabase.co", key: "pub-key" });
  });

  it("ignores the example placeholders", () => {
    process.env[URL_KEY] = "https://your-project.supabase.co";
    process.env[PUBLISHABLE_KEY] = "your-publishable-key";
    expect(supabasePublicEnv()).toBeNull();
  });
});
