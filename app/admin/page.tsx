import { redirect } from "next/navigation";
import { AdminProductManager, type AdminProduct } from "@/components/admin-product-manager";
import type { Category } from "@/lib/category";
import type { ContactChannel } from "@/lib/contacts";
import type { Customer } from "@/lib/customer";
import { createClient } from "@/lib/supabase/server";
import { supabasePublicEnv } from "@/lib/supabase/env";
import type { SizeGuideRow } from "@/lib/size-guide";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!supabasePublicEnv()) redirect("/admin/login");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (claimsData?.claims?.app_metadata?.role !== "admin") redirect("/admin/login");
  const userId = String(claimsData.claims.sub);
  const { data: profile } = await supabase.from("admin_profiles").select("must_change_password").eq("user_id",userId).maybeSingle();
  if (profile?.must_change_password) redirect("/admin/change-password");
  const featuredQuery = await supabase.from("products").select("id,slug,name,category,team,price,sizes,badge,image_url,image_urls,active,featured,featured_title").order("created_at",{ascending:false});
  const productsResult = featuredQuery.error
    ? await supabase.from("products").select("id,slug,name,category,team,price,sizes,badge,image_url,image_urls,active").order("created_at",{ascending:false})
    : featuredQuery;
  const [categoriesResult, customersResult, sizeGuideResult, contactsResult] = await Promise.all([
    supabase.from("categories").select("id,name,slug,sort_order").order("sort_order").order("name"),
    supabase.from("customers").select("id,name,phone,email,notes").order("created_at",{ascending:false}),
    supabase.from("size_guide_rows").select("id,size,chest,length,height,sort_order").order("sort_order").order("size"),
    supabase.from("contact_channels").select("id,name,value,button_label,href,sort_order").order("sort_order").order("name"),
  ]);
  return <AdminProductManager initialProducts={(productsResult.data ?? []) as AdminProduct[]} initialCategories={(categoriesResult.data ?? []) as Category[]} initialCustomers={(customersResult.data ?? []) as Customer[]} initialSizeGuide={(sizeGuideResult.data ?? []) as SizeGuideRow[]} initialContacts={(contactsResult.data ?? []) as ContactChannel[]} email={String(claimsData.claims.email ?? "administrador")} />;
}
