import { redirect } from "next/navigation";
import { AdminProductManager, type AdminProduct } from "@/components/admin-product-manager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (claimsData?.claims?.app_metadata?.role !== "admin") redirect("/admin/login");
  const userId = String(claimsData.claims.sub);
  const { data: profile } = await supabase.from("admin_profiles").select("must_change_password").eq("user_id",userId).maybeSingle();
  if (profile?.must_change_password) redirect("/admin/change-password");
  const { data: products, error } = await supabase.from("products").select("id,slug,name,category,team,price,sizes,badge,image_url,active").order("created_at",{ascending:false});
  return <AdminProductManager initialProducts={(products ?? []) as AdminProduct[]} email={String(claimsData.claims.email ?? "administrador")} />;
}
