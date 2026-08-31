import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Server Actions de Autenticación</h1>
        <p className="content-subtitle">
          Registro, login, logout y lectura de sesión con Lucia
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          1. Todas las acciones en un archivo (<code>actions/auth.ts</code>)
        </h2>
        <p className="section-paragraph">
          Las Server Actions validan, crean el usuario, generan la sesión con Lucia y
          setean la cookie. Usan la firma de <code>useActionState</code>{" "}
          <code>(prevState, formData)</code>. Crea <code>actions/auth.ts</code> con
          este contenido completo:
        </p>
        <CodeBlock
          code={`"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { db, users } from "@/lib/db";
import { lucia } from "@/lib/lucia";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export type ActionState = { error?: string } | undefined;

export async function registerAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || name.length < 2) return { error: "El nombre es obligatorio (mín. 2 caracteres)" };
  if (!email.includes("@")) return { error: "Correo inválido" };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres" };

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();
  if (existingUser) return { error: "Este correo ya está registrado" };

  const userId = generateId(15);
  const hashedPassword = await hashPassword(password);

  await db.insert(users).values({
    id: userId,
    name,
    email,
    hashedPassword,
  });

  // Crear sesión y setear la cookie
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  redirect("/dashboard");
}

export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email.includes("@")) return { error: "Correo inválido" };
  if (!password) return { error: "La contraseña es obligatoria" };

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user || !user.hashedPassword) return { error: "Credenciales incorrectas" };

  const valid = await verifyPassword(password, user.hashedPassword);
  if (!valid) return { error: "Credenciales incorrectas" };

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;

  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }

  const blankCookie = lucia.createBlankSessionCookie();
  cookieStore.set(blankCookie.name, blankCookie.value, blankCookie.attributes);

  redirect("/login");
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            <code>lucia.createSession(userId, {})</code> crea la sesión en la tabla{" "}
            <code>sessions</code>, y <code>createSessionCookie</code> devuelve la
            cookie lista para setear con <code>cookies()</code>. En el logout,{" "}
            <code>createBlankSessionCookie</code> borra la cookie.
          </span>
        </div>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <strong>Ojo con la firma:</strong> las actions que muestran errores deben
            recibir <code>prevState</code> como primer argumento (firma de{" "}
            <code>useActionState</code>). Si las usas directamente en{" "}
            <code>&lt;form action&gt;</code>, TypeScript falla porque la prop{" "}
            <code>action</code> de React 19 espera <code>(formData) =&gt; void</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          2. Leer la sesión (<code>lib/session.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Para no repetir la lectura de cookie + validación en cada Server Component,
          crea una utilidad reutilizable. Crea <code>lib/session.ts</code> con este
          contenido completo:
        </p>
        <CodeBlock
          code={`import { cookies } from "next/headers";
import { lucia } from "@/lib/lucia";

// Devuelve el usuario autenticado o null si no hay sesión.
// Uso: const user = await getSessionUser();
export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;

  if (!sessionId) return null;

  const { user } = await lucia.validateSession(sessionId);
  return user;
}`}
        />
        <p className="section-paragraph">
          <code>lucia.validateSession(sessionId)</code> devuelve{" "}
          <code>{"{ user, session }"}</code> o <code>{"{ user: null, session: null }"}</code>{" "}
          si la sesión no es válida o expiró. Con el tipado del paso 2,{" "}
          <code>user</code> incluye <code>id</code>, <code>email</code> y{" "}
          <code>name</code>.
        </p>
      </section>
    </>
  );
}
