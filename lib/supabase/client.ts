import { createBrowserClient } from "@supabase/ssr";
import { supabasePublicEnv } from "@/lib/supabase/env";

export function createClient() {
  const env = supabasePublicEnv();
  if (!env) throw new Error("Supabase is not configured");
  return createBrowserClient(env.url, env.key);
}
