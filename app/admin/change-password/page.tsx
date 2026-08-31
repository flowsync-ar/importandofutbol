"use client";

import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "@/components/password-input";
import { createClient } from "@/lib/supabase/client";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 10) { setError("Usá al menos 10 caracteres."); return; }
    if (password !== confirmation) { setError("Las contraseñas no coinciden."); return; }
    setSaving(true); setError("");
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { router.replace("/admin/login"); return; }
    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) { setError(passwordError.message); setSaving(false); return; }
    const { error: profileError } = await supabase.from("admin_profiles").update({ must_change_password:false }).eq("user_id",userData.user.id);
    if (profileError) { setError("La contraseña cambió, pero no pudimos completar el perfil. Volvé a ingresar."); setSaving(false); return; }
    router.replace("/admin"); router.refresh();
  }

  return <section className="admin-login"><form onSubmit={submit}><KeyRound className="password-icon"/><span className="eyebrow dark">PRIMER INGRESO</span><h1>Creá una nueva contraseña</h1><p>Por seguridad, reemplazá la contraseña temporal antes de usar el panel.</p><label htmlFor="new-password">Nueva contraseña</label><PasswordInput id="new-password" value={password} onChange={setPassword} autoComplete="new-password"/><label htmlFor="confirm-password">Repetir contraseña</label><PasswordInput id="confirm-password" value={confirmation} onChange={setConfirmation} autoComplete="new-password"/>{error && <div className="form-error" role="alert">{error}</div>}<button className="button gold full" disabled={saving}>{saving ? "Guardando…" : "Cambiar contraseña"}</button></form></section>;
}
