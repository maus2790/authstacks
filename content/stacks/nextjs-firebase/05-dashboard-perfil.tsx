import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function DashboardPerfil() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Dashboard Protegido y Proxy</h1>
        <p className="content-subtitle">
          Página privada con datos del usuario y protección de rutas
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          1. Dashboard como Server Component (<code>app/dashboard/page.tsx</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Lee la cookie con <code>getSessionUser</code> y obtén los datos completos
          del usuario con <code>adminAuth.getUser</code>. Crea{" "}
          <code>app/dashboard/page.tsx</code>:
        </p>
        <CodeBlock
          code={`import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/firebase/session";
import { logoutAction } from "@/actions/auth";

export default async function DashboardPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/login");
  }

  // Datos completos del usuario (displayName, photoURL)
  const user = await adminAuth.getUser(session.uid);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-white/10 dark:bg-white/5">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName ?? "Usuario"}
            className="mx-auto mb-4 h-20 w-20 rounded-full"
          />
        )}
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Hola, <span className="font-medium">{user.displayName ?? user.email}</span>
          <br />
          <span className="text-sm">{user.email}</span>
        </p>

        <form action={logoutAction} className="mt-8">
          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            El logout usa un <code>{`<form action={logoutAction}>`}</code>: la Server
            Action borra la cookie y revoca los tokens de Firebase en el servidor.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          2. Protección global de rutas (<code>proxy.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          En <strong>Next.js 16</strong>, <code>middleware.ts</code> fue renombrado a{" "}
          <code>proxy.ts</code>. Aquí solo se comprueba la <strong>presencia</strong>{" "}
          de la cookie (rápido); la verificación real (firma/expiración) ocurre en el
          Server Component con el Admin SDK. Crea <code>proxy.ts</code>:
        </p>
        <CodeBlock
          code={`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/register"];

// El proxy solo comprueba si existe la cookie (rápido). La verificación REAL
// de la sesión ocurre en el Server Component con getSessionUser()
// (verifySessionCookie del Admin SDK).
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const hasSessionCookie = request.cookies.has("firebase-session");

  // Si no hay cookie de sesión y la ruta es privada -> login
  if (!hasSessionCookie && !publicPaths.some((p) => path.startsWith(p))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay cookie y entra a /login o /register -> dashboard
  if (hasSessionCookie && publicPaths.some((p) => path.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            No se usa firebase-admin en el proxy: el Admin SDK verifica tokens contra
            Google en cada llamada (lento) y no corre en el runtime del proxy. La
            presencia de la cookie es una capa de UX; la seguridad real está en el
            Server Component y las Server Actions.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔗</span>
          3. Actualizar <code>app/page.tsx</code> (home) — archivo completo
        </h2>
        <CodeBlock
          code={`import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/firebase/session";

export default async function Home() {
  const session = await getSessionUser();

  // Si ya hay sesión, ir directo al dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <h1 className="text-4xl font-bold">Bienvenido</h1>
      <p className="text-gray-500 dark:text-gray-400">
        Crea una cuenta o inicia sesión para continuar
      </p>
      <div className="flex gap-3">
        <a href="/register" className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
          Registrarse
        </a>
        <a href="/login" className="rounded-lg border border-gray-300 px-6 py-3 font-semibold transition hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10">
          Iniciar sesión
        </a>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧪</span>
          4. Probar el flujo completo
        </h2>
        <CommandBlock command="npm run dev" />
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Abre <code>http://localhost:3000</code> → botones Registrarse / Iniciar sesión.</li>
          <li>Crea una cuenta en <code>/register</code> → te redirige a <code>/dashboard</code>.</li>
          <li>El usuario queda visible en <strong>Firebase Console → Authentication → Users</strong>.</li>
          <li>Visita <code>/dashboard</code> sin sesión → el proxy te manda a <code>/login</code>.</li>
          <li>Haz clic en <strong>Cerrar sesión</strong> → vuelves a <code>/login</code>.</li>
        </ol>
      </section>
    </>
  );
}
