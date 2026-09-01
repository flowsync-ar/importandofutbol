import { redirect } from "next/navigation";
import { AdminProductManager, type AdminProduct } from "@/components/admin-product-manager";
import type { Category } from "@/lib/category";
import type { Customer } from "@/lib/customer";
import { createClient } from "@/lib/supabase/server";
import { supabasePublicEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!supabasePublicEnv()) redirect("/admin/login");
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (claimsData?.claims?.app_metadata?.role !== "admin") redirect("/admin/login");
  const userId = String(claimsData.claims.sub);
  const { data: profile } = await supabase.from("admin_profiles").select("must_change_password").eq("user_id",userId).maybeSingle();
  if (profile?.must_change_password) redirect("/admin/change-password");
  const [productsResult, categoriesResult, customersResult] = await Promise.all([
    supabase.from("products").select("id,slug,name,category,team,price,sizes,badge,image_url,image_urls,active").order("created_at",{ascending:false}),
    supabase.from("categories").select("id,name,slug,sort_order").order("sort_order").order("name"),
    supabase.from("customers").select("id,name,phone,email,notes").order("created_at",{ascending:false}),
  ]);
  return <AdminProductManager initialProducts={(productsResult.data ?? []) as AdminProduct[]} initialCategories={(categoriesResult.data ?? []) as Category[]} initialCustomers={(customersResult.data ?? []) as Customer[]} email={String(claimsData.claims.email ?? "administrador")} />;
}
