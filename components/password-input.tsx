"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  invalid = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  invalid?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={invalid ? "password-field invalid" : "password-field"}>
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        autoComplete={autoComplete}
        aria-invalid={invalid}
      />
      <button
        type="button"
        className="password-toggle"
        aria-pressed={visible}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOff /> : <Eye />}
      </button>
    </div>
  );
}
