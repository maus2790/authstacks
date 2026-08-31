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
          La forma más simple y segura: un Server Component que lee la sesión con la
          utilidad <code>getSessionUser</code> del paso 3 y redirige al login si no
          hay usuario. Crea <code>app/dashboard/page.tsx</code> con este contenido
          completo:
        </p>
        <CodeBlock
          code={`import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { logoutAction } from "@/actions/auth";

export default async function DashboardPage() {
  const user = await getSessionUser();

  // Si no hay sesión, redirigir al login
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-white/10 dark:bg-white/5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Hola, <span className="font-medium">{user.name}</span>
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
            El logout usa un <code>{`<form action={logoutAction}>`}</code> con la
            Server Action (no un link): así la sesión se invalida en el servidor
            antes de redirigir.
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
          <code>proxy.ts</code>. Usa la misma utilidad <code>getSessionUser</code>:
        </p>
        <CodeBlock
          code={`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/session";

const publicPaths = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const user = await getSessionUser();

  // Si no hay sesión y la ruta es privada -> login
  if (!user && !publicPaths.some((p) => path.startsWith(p))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay sesión y entra a /login o /register -> dashboard
  if (user && publicPaths.some((p) => path.startsWith(p))) {
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
            El proxy es una capa de UX; la verificación real está en el Server
            Component (paso anterior) y en tus Server Actions. Como el proxy valida
            contra la base de datos, evita hacerlo en rutas de alto tráfico si te
            preocupa el rendimiento.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔗</span>
          3. Actualizar <code>app/page.tsx</code> (home) — archivo completo
        </h2>
        <p className="section-paragraph">
          Reemplaza el contenido del template por una landing que redirija según la
          sesión:
        </p>
        <CodeBlock
          code={`import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";

export default async function Home() {
  const user = await getSessionUser();

  // Si ya hay sesión, ir directo al dashboard
  if (user) {
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
          <li>Visita <code>/dashboard</code> sin sesión → el proxy y el Server Component te mandan a <code>/login</code>.</li>
          <li>Recarga la página → sigues autenticado (la cookie persiste).</li>
          <li>Haz clic en <strong>Cerrar sesión</strong> → vuelves a <code>/login</code>.</li>
        </ol>
      </section>
    </>
  );
}
