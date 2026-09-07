import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Server Actions de Autenticación</h1>
        <p className="content-subtitle">
          Login, registro y logout contra Supabase Auth
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">💡</span>
          1. Cómo funciona la sesión
        </h2>
        <p className="section-paragraph">
          Supabase Auth gestiona las sesiones por ti: al autenticarte con{" "}
          <code>signInWithPassword</code>, el cliente del servidor guarda la sesión
          en cookies automáticamente (vía el <code>setAll</code> del paso 2). Para
          leer al usuario usamos <code>getUser()</code>, que valida el JWT contra
          Supabase (más seguro que <code>getSession()</code>).
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          2. Server Actions (<code>actions/auth.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Crea <code>actions/auth.ts</code> con este contenido completo:
        </p>
        <CodeBlock
          code={`"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error?: string } | undefined;

// Traduce errores comunes de Supabase a mensajes amigables
function friendlyError(message: string): string {
  if (message.includes("Invalid login credentials")) {
    return "Credenciales incorrectas. Verifica tu correo y contraseña.";
  }
  if (message.includes("Email not confirmed")) {
    return "Debes confirmar tu correo electrónico primero. Revisa tu bandeja.";
  }
  if (message.includes("already registered") || message.includes("already been registered")) {
    return "Este correo ya está registrado.";
  }
  return message;
}

export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email.includes("@")) return { error: "Correo inválido" };
  if (!password) return { error: "La contraseña es obligatoria" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: friendlyError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function registerAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || name.length < 2) return { error: "El nombre es obligatorio (mín. 2 caracteres)" };
  if (!email.includes("@")) return { error: "Correo inválido" };
  if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: \`\${process.env.NEXT_PUBLIC_APP_URL}/auth/callback\`,
    },
  });

  if (error) {
    return { error: friendlyError(error.message) };
  }

  // Si Supabase requiere confirmación de email, no hay sesión todavía
  if (!data.session) {
    return {
      error:
        "Revisa tu correo y haz clic en el enlace de confirmación antes de iniciar sesión.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            <code>options.data: {"{ name }"}</code> guarda el nombre en{" "}
            <code>user_metadata</code> (lo leemos en el dashboard). El{" "}
            <code>emailRedirectTo</code> apunta al callback del paso 4 para el flujo
            de confirmación por email.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          3. Leer el usuario (<code>lib/supabase/session.ts</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`import { createClient } from "@/lib/supabase/server";

// Devuelve los datos del usuario autenticado o null.
// getUser() valida el JWT contra Supabase (más seguro que getSession()).
export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}`}
        />
      </section>
    </>
  );
}
