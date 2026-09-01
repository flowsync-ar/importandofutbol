import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithPassword = vi.fn();
const signOut = vi.fn();
const maybeSingle = vi.fn();

vi.mock("next/image", () => ({ default: (props: { alt: string }) => <img alt={props.alt} /> }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }));
vi.mock("@/lib/supabase/env", () => ({
  supabasePublicEnv: () => ({ url: "https://example.supabase.co", key: "test-key" }),
}));
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { signInWithPassword, signOut },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle }) }) }),
  }),
}));

import AdminLoginPage from "@/app/admin/login/page";

describe("Admin login errors", () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
    signOut.mockReset();
    maybeSingle.mockReset();
  });

  it("shows an error when the email or password is wrong", async () => {
    signInWithPassword.mockResolvedValue({ data: { user: null }, error: { message: "Invalid login credentials" } });
    render(<AdminLoginPage />);
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "nadie@mail.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "incorrecta" } });
    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }).closest("form")!);
    expect(await screen.findByRole("alert")).toHaveTextContent("El correo o la contraseña no son correctos.");
  });

  it("shows an error when the account is not an administrator", async () => {
    signInWithPassword.mockResolvedValue({
      data: { user: { id: "1", app_metadata: { role: "user" } } },
      error: null,
    });
    render(<AdminLoginPage />);
    fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "user@mail.com" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "secreto123" } });
    fireEvent.submit(screen.getByRole("button", { name: /ingresar/i }).closest("form")!);
    await waitFor(() => expect(signOut).toHaveBeenCalled());
    expect(screen.getByRole("alert")).toHaveTextContent("Esta cuenta no tiene permisos de administrador.");
  });

  it("toggles password visibility", () => {
    render(<AdminLoginPage />);
    const field = screen.getByLabelText("Contraseña");
    expect(field).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
    expect(field).toHaveAttribute("type", "text");
    fireEvent.click(screen.getByRole("button", { name: "Ocultar contraseña" }));
    expect(field).toHaveAttribute("type", "password");
  });
});
