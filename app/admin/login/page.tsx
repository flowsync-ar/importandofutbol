"use client";

import Image from "next/image";
import { LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "@/components/password-input";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError || !data.user) {
        setError("El correo o la contraseña no son correctos.");
        setLoading(false);
        return;
      }
      if (data.user.app_metadata.role !== "admin") {
        await supabase.auth.signOut();
        setError("Esta cuenta no tiene permisos de administrador.");
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase.from("admin_profiles").select("must_change_password").eq("user_id",data.user.id).maybeSingle();
      if (profile?.must_change_password) {
        router.replace("/admin/change-password");
        router.refresh();
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("El correo o la contraseña no son correctos.");
      setLoading(false);
    }
  }

  return <section className="admin-login"><form onSubmit={login}>
    <Image src="/logo.png" width={76} height={76} alt="Importando Fútbol LP"/>
    <span className="eyebrow dark">ACCESO PRIVADO</span>
    <h1>Panel administrador</h1>
    <p>Ingresá con la cuenta autorizada para gestionar el catálogo.</p>
    <label htmlFor="admin-email"><Mail/> Correo</label>
    <input id="admin-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); if (error) setError(""); }} required autoComplete="email" aria-invalid={Boolean(error)} className={error ? "invalid" : undefined}/>
    <label htmlFor="admin-password"><LockKeyhole/> Contraseña</label>
    <PasswordInput id="admin-password" value={password} onChange={(value) => { setPassword(value); if (error) setError(""); }} autoComplete="current-password" invalid={Boolean(error)}/>
    {error && <div className="form-error" role="alert">{error}</div>}
    <button className="button gold full" disabled={loading}>{loading ? "Ingresando…" : "Ingresar"}</button>
  </form></section>;
}
