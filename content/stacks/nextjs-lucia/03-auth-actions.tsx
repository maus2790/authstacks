import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Server Actions de Autenticación</h1>
        <p className="content-subtitle">
          Login, registro, recuperación y gestión de perfil con Lucia
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          1. Acciones principales de autenticación
        </h2>
        <p className="section-paragraph">
          Crea <code>actions/auth/auth.ts</code> con las siguientes funciones:
        </p>

        <h3 className="subsection-title">1.1. Registro</h3>
        <CodeBlock
          code={`"use server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { generateId } from "lucia";
import { redirect } from "next/navigation";
import { db, users } from "@/lib/db";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, "Debes aceptar los términos"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const terms = formData.get("terms") === "on";

  const result = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
    terms,
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (existingUser) {
    return { error: "Este correo ya está registrado" };
  }

  const userId = generateId(15);
  const hashedPassword = await hash(password, 10);

  await db.insert(users).values({
    id: userId,
    name,
    email,
    hashedPassword,
    emailVerified: false,
  });

  // Crear sesión inmediatamente
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/dashboard");
}`}
        />

        <h3 className="subsection-title">1.2. Login</h3>
        <CodeBlock
          code={`import { compare } from "bcryptjs";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
});

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) {
    return { error: "Credenciales incorrectas" };
  }

  if (!user.hashedPassword) {
    return { error: "Esta cuenta usa OAuth. Inicia sesión con Google." };
  }

  const isValid = await compare(password, user.hashedPassword);
  if (!isValid) {
    return { error: "Credenciales incorrectas" };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/dashboard");
}`}
        />

        <h3 className="subsection-title">1.3. Cerrar sesión</h3>
        <CodeBlock
          code={`export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;

  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }

  const sessionCookie = lucia.createBlankSessionCookie();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/login");
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          2. Obtener usuario y actualizar perfil
        </h2>

        <h3 className="subsection-title">2.1. Obtener usuario (<code>actions/auth/get-user.ts</code>)</h3>
        <CodeBlock
          code={`"use server";
import { db, users } from "@/lib/db";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export async function getUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;

  if (!sessionId) return null;

  const { user } = await lucia.validateSession(sessionId);
  if (!user) return null;

  const userData = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .get();

  return userData;
}`}
        />

        <h3 className="subsection-title">2.2. Actualizar perfil (<code>actions/auth/update-profile.ts</code>)</h3>
        <CodeBlock
          code={`"use server";
import { z } from "zod";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getUser } from "./get-user";

const profileSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
});

export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const result = profileSchema.safeParse({ name });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const user = await getUser();
  if (!user) return { error: "No autenticado" };

  await db
    .update(users)
    .set({ name, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return { success: true };
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📧</span>
          3. Recuperación de contraseña
        </h2>
        <CodeBlock
          code={`import { generateId } from "lucia";
import { verificationTokens } from "@/lib/db/schema";

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  // Validar email...

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) {
    return { success: true }; // No revelar si existe o no
  }

  const token = generateId(32);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await db.insert(verificationTokens).values({
    id: generateId(15),
    userId: user.id,
    token,
    expiresAt: expiresAt,
    type: "password_reset",
  });

  // Enviar email con enlace: /reset-password?token=xxx
  // ...

  return { success: true };
}

export async function resetPasswordAction(token: string, formData: FormData) {
  const password = formData.get("password") as string;
  // Validar...

  const verification = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token))
    .get();

  if (!verification || verification.expiresAt < new Date()) {
    return { error: "Token inválido o expirado" };
  }

  const hashedPassword = await hash(password, 10);
  await db
    .update(users)
    .set({ hashedPassword, updatedAt: new Date() })
    .where(eq(users.id, verification.userId));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.id, verification.id));

  redirect("/login?reset=true");
}`}
        />
      </section>
    </>
  );
}