import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function RecuperacionPassword() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Recuperación de Contraseña con Resend</h1>
        <p className="content-subtitle">
          Envía el enlace de restablecimiento por email con Resend
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📧</span>
          1. Crear cuenta en Resend y obtener la API Key
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">resend.com</a> y crea una cuenta (plan Free).</li>
          <li>Ve a <strong>API Keys</strong> → crea una key → cópiala (empieza con <code>re_</code>).</li>
          <li>
            Para probar en local sin dominio, Resend te permite enviar desde{" "}
            <code>onboarding@resend.dev</code> (solo a tu propio email verificado).
            Para producción necesitas verificar un dominio en{" "}
            <strong>Domains</strong>.
          </li>
        </ol>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            El plan Free de Resend permite ~100 emails/día — suficiente para
            desarrollo y pruebas.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          2. Variables de entorno
        </h2>
        <p className="section-paragraph">
          Añade a tu <code>.env.local</code>:
        </p>
        <CodeBlock
          code={`# Resend (envío de correos para recuperación de contraseña)
RESEND_API_KEY="re_XXXXXXXXXXXX"
# Remitente: en el plan Free SIN dominio propio, Resend SOLO permite onboarding@resend.dev
# (y el correo solo llega al email verificado de tu cuenta Resend).
# Para tu propio remitente (ej: "Acme <no-reply@tudominio.com>"), verifica un dominio
# en Resend -> Domains.
EMAIL_FROM="Acme <onboarding@resend.dev>"`}
        />
        <p className="section-paragraph">
          Reinicia el servidor de desarrollo tras añadirlas (las variables de entorno
          se cargan al arrancar).
        </p>
        <div className="tip">
          <span className="tip-icon">🚨</span>
          <span>
            <strong>Error típico — "Invalid `from` field" (HTTP 422):</strong> el{" "}
            <code>EMAIL_FROM</code> está mal formado. Debe ser exactamente{" "}
            <code>Nombre &lt;email@dominio.com&gt;</code> (sin comillas extra, sin{" "}
            <code>&gt;</code> suelto al final). Ejemplo inválido que da ese error:{" "}
            <code>"Acme &lt;onboarding@resend.dev&gt;"</code> con un <code>&gt;</code>{" "}
            de más. Recuerda además: con <code>onboarding@resend.dev</code> el correo
            <strong>solo llega al email verificado de tu cuenta Resend</strong> — si
            usas otro destinatario, no lo verás aunque el envío devuelva 200.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          3. Instalar Resend
        </h2>
        <CommandBlock command="npm install resend" />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">✨</span>
          4. Configurar <code>sendResetPassword</code> en <code>lib/auth/index.ts</code>
        </h2>
        <p className="section-paragraph">
          Better Auth genera el enlace de restablecimiento y llama a{" "}
          <code>sendResetPassword</code>; tú defines cómo enviarlo. Reemplaza el
          contenido de <code>lib/auth/index.ts</code> por este:
        </p>
        <CodeBlock
          code={`import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Restablece tu contraseña",
        html: \`
          <h2>Hola, \${user.name}!</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>
            <a href="\${url}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block">
              Restablecer contraseña
            </a>
          </p>
          <p>Si no solicitaste esto, ignora este correo. El enlace expira en 1 hora.</p>
        \`,
      });
    },
  },
  plugins: [nextCookies()],
});`}
        />
        <div className="tip">
          <span className="tip-icon">🔑</span>
          <span>
            <code>url</code> es el enlace generado por Better Auth con el token
            (apunta a tu <code>redirectTo</code>). El token expira en 1 hora por
            defecto (configurable con <code>resetPasswordTokenExpiresIn</code>).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          5. Server Actions de recuperación (<code>actions/auth.ts</code>)
        </h2>
        <p className="section-paragraph">
          Reemplaza <strong>todo</strong> el contenido de <code>actions/auth.ts</code>{" "}
          por este archivo completo (incluye las acciones del paso 3 más las dos de
          recuperación):
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
}

export async function forgotPasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email.includes("@")) return { error: "Correo inválido" };

  try {
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: \`\${process.env.NEXT_PUBLIC_APP_URL}/reset-password\`,
      },
      headers: await headers(),
    });
    // Por seguridad no reveles si el email existe o no
    return { error: undefined };
  } catch (error) {
    console.error("Error al solicitar reset:", error);
    return { error: "No se pudo enviar el correo. Revisa la configuración de Resend." };
  }
}

export async function resetPasswordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const token = String(formData.get("token") ?? "");

  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres" };
  if (!token) return { error: "Token inválido o expirado" };

  try {
    await auth.api.resetPassword({
      body: { newPassword: password, token },
      headers: await headers(),
    });
  } catch (error) {
    console.error("Error al resetear contraseña:", error);
    return { error: "Token inválido o expirado. Solicita un nuevo enlace." };
  }
  redirect("/login?reset=true");
}`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <code>redirectTo</code> es la ruta a la que apunta el enlace del correo
            (donde el usuario pondrá su nueva contraseña). El token llega como
            query param: <code>/reset-password?token=xxx</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          6. Página de solicitud (<code>app/forgot-password/page.tsx</code>)
        </h2>
        <CodeBlock
          code={`"use client";
import { useActionState } from "react";
import { forgotPasswordAction } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-6 text-3xl font-bold text-center">Recuperar contraseña</h1>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Te enviaremos un enlace a tu correo para restablecerla
        </p>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {state.error}
            </p>
          )}

          {!state?.error && pending === false && state !== undefined && (
            <p className="rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-500">
              Si el correo existe, recibirás un enlace para restablecer tu contraseña.
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <a href="/login" className="text-blue-600 hover:underline">
            ← Volver a iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          7. Página de nueva contraseña (<code>app/reset-password/</code>)
        </h2>
        <p className="section-paragraph">
          La página lee el token de la URL (Server Component) y se lo pasa al
          formulario (Client Component). Crea <code>app/reset-password/page.tsx</code>:
        </p>
        <CodeBlock
          code={`import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-white/10 dark:bg-white/5">
          <h1 className="text-2xl font-bold">Enlace inválido</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            El enlace de recuperación es inválido o ya fue usado.
          </p>
          <a
            href="/forgot-password"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Solicitar uno nuevo
          </a>
        </div>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}`}
        />
        <p className="section-paragraph">
          Y crea el formulario <code>app/reset-password/reset-password-form.tsx</code>:
        </p>
        <CodeBlock
          code={`"use client";
import { useActionState } from "react";
import { resetPasswordAction } from "@/actions/auth";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-6 text-3xl font-bold text-center">Nueva contraseña</h1>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="token" value={token} />

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Nueva contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "Guardando..." : "Restablecer contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          8. Rutas públicas (<code>proxy.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Reemplaza <strong>todo</strong> el contenido de <code>proxy.ts</code> por
          este archivo completo (añade las dos rutas de recuperación a{" "}
          <code>publicPaths</code>):
        </p>
        <CodeBlock
          code={`import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionCookie = getSessionCookie(request);

  // Si no hay sesión y la ruta es privada -> login
  if (!sessionCookie && !publicPaths.some((p) => path.startsWith(p))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay sesión y entra a una ruta pública de auth -> dashboard
  if (sessionCookie && publicPaths.some((p) => path.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔗</span>
          9. Enlace en el login (<code>app/login/page.tsx</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Reemplaza <strong>todo</strong> el contenido de{" "}
          <code>app/login/page.tsx</code> por este archivo completo (añade el enlace
          de recuperación al final):
        </p>
        <CodeBlock
          code={`"use client";
import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-6 text-3xl font-bold text-center">Iniciar sesión</h1>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </a>
          <br />
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </p>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧪</span>
          10. Probar el flujo
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Entra a <code>http://localhost:3000/forgot-password</code>.</li>
          <li>Escribe tu email → Resend envía el correo con el enlace.</li>
          <li>Abre el enlace → aterrizas en <code>/reset-password?token=xxx</code>.</li>
          <li>Pon la nueva contraseña → redirige a <code>/login?reset=true</code>.</li>
          <li>Inicia sesión con la contraseña nueva.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            Si el correo no llega: revisa que <code>RESEND_API_KEY</code> sea válida
            y que el <code>EMAIL_FROM</code> esté verificado en Resend. Con{" "}
            <code>onboarding@resend.dev</code> el correo solo llega a la dirección
            verificada de tu cuenta.
          </span>
        </div>
      </section>
    </>
  );
}
