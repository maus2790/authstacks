import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Server Actions de Autenticación</h1>
        <p className="content-subtitle">
          Registro, login, logout, perfil y lectura de sesión
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          1. Todas las acciones en un archivo (<code>actions/auth.ts</code>)
        </h2>
        <p className="section-paragraph">
          Las Server Actions se ejecutan en el servidor: validan los datos, llaman
          a la API de Better Auth (que crea la sesión y setea la cookie) y redirigen.
          Usan la firma de <code>useActionState</code>{" "}
          <code>(prevState, formData)</code> para poder mostrar errores en el
          formulario. Crea <code>actions/auth.ts</code> con este contenido completo:
        </p>
        <CodeBlock
          code={`"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type ActionState = { error?: string } | undefined;

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Ocurrió un error inesperado";
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
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres" };

  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
      headers: await headers(),
    });
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
  redirect("/dashboard");
}

export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email.includes("@")) return { error: "Correo inválido" };
  if (!password) return { error: "La contraseña es obligatoria" };

  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
  } catch (error) {
    return { error: "Credenciales incorrectas" };
  }
  redirect("/dashboard");
}

export async function logoutAction() {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
  redirect("/login");
}

export async function updateProfileAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "No autenticado" };

  if (!name || name.length < 2) return { error: "El nombre es obligatorio" };

  try {
    await auth.api.updateUser({
      body: { name },
      headers: await headers(),
    });
    return { error: undefined };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Pasar <code>headers: await headers()</code> es clave: Better Auth lee la
            cookie de sesión de esos headers y, al firmar, la devuelve en la respuesta
            para que la sesión quede establecida.
          </span>
        </div>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <strong>Ojo con la firma:</strong> las actions que muestran errores deben
            recibir <code>prevState</code> como primer argumento (firma de{" "}
            <code>useActionState</code>). Si las usas directamente en{" "}
            <code>&lt;form action&gt;</code> sin <code>prevState</code>, TypeScript
            falla porque la prop <code>action</code> de React 19 espera{" "}
            <code>(formData) =&gt; void</code>. Las páginas del paso 4 las consumen
            con <code>useActionState</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          2. Leer la sesión (<code>lib/session.ts</code>)
        </h2>
        <p className="section-paragraph">
          Para no repetir la llamada a <code>auth.api.getSession</code> en cada
          Server Component, crea una utilidad reutilizable. Crea{" "}
          <code>lib/session.ts</code> con este contenido completo:
        </p>
        <CodeBlock
          code={`import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Devuelve el usuario autenticado o null si no hay sesión.
// Uso: const user = await getSessionUser();
export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}`}
        />
        <p className="section-paragraph">
          Luego, en cualquier Server Component (dashboard, home, layouts):
        </p>
        <CodeBlock
          code={`import { getSessionUser } from "@/lib/session";

const user = await getSessionUser();

if (!user) {
  // No autenticado: redirigir o mostrar contenido público
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            <code>session.user</code> incluye (según los scopes configurados):{" "}
            <code>id</code>, <code>name</code>, <code>email</code>,{" "}
            <code>emailVerified</code> e <code>image</code>.
          </span>
        </div>
      </section>
    </>
  );
}
