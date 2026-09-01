import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { supabasePublicEnv } from "@/lib/supabase/env";

export type SizeGuideRow = {
  id: string;
  size: string;
  chest: string;
  length: string;
  height: string;
  sort_order: number;
};

export const REPLICA_SIZE_ROWS: SizeGuideRow[] = [
  { id: "s", size: "S", chest: "50–52", length: "69–71", height: "160–170", sort_order: 1 },
  { id: "m", size: "M", chest: "53–55", length: "71–73", height: "168–176", sort_order: 2 },
  { id: "l", size: "L", chest: "56–58", length: "73–76", height: "174–182", sort_order: 3 },
  { id: "xl", size: "XL", chest: "59–61", length: "76–79", height: "180–188", sort_order: 4 },
  { id: "xxl", size: "XXL", chest: "62–64", length: "79–82", height: "186–194", sort_order: 5 },
];

export const getSizeGuideRows = cache(async (): Promise<SizeGuideRow[]> => {
  if (!supabasePublicEnv()) return REPLICA_SIZE_ROWS;
  const supabase = await createClient();
  const { data, error } = await supabase.from("size_guide_rows").select("id,size,chest,length,height,sort_order").order("sort_order").order("size");
  if (error || !data?.length) return REPLICA_SIZE_ROWS;
  return data as SizeGuideRow[];
});
