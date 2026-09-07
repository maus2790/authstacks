import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function DashboardPerfil() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Dashboard Protegido y Proxy</h1>
        <p className="content-subtitle">
          Página privada y protección/refresco de sesión con el proxy
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          1. Dashboard como Server Component (<code>app/dashboard/page.tsx</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Lee el usuario con <code>getSessionUser</code> y redirige al login si no
          hay sesión. Crea <code>app/dashboard/page.tsx</code>:
        </p>
        <CodeBlock
          code={`import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/session";
import { logoutAction } from "@/actions/auth";

export default async function DashboardPage() {
  const user = await getSessionUser();

  // Si no hay sesión, redirigir al login
  if (!user) {
    redirect("/login");
  }

  // user.user_metadata.name se guardó en el registro (options.data.name)
  const name =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Usuario";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-white/10 dark:bg-white/5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Hola, <span className="font-medium">{name}</span>
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
            El nombre se guardó en <code>user_metadata</code> durante el registro
            (<code>options.data: {"{ name }"}</code>). Si no existe, caemos al email.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          2. Proxy de sesión (<code>proxy.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          En <strong>Next.js 16</strong>, <code>middleware.ts</code> fue renombrado a{" "}
          <code>proxy.ts</code>. El proxy de Supabase <strong>refresca la sesión</strong>{" "}
          (renueva las cookies si el token expiró) y redirige según el estado de
          auth. Crea <code>proxy.ts</code>:
        </p>
        <CodeBlock
          code={`import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const publicPaths = ["/login", "/register", "/auth"];

// Proxy de Next 16: refresca la sesión de Supabase en cada request
// (renueva las cookies si el token expiró) y redirige según auth.
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: no ejecutes código entre createServerClient y getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic = publicPaths.some((p) => path.startsWith(p));

  // Sin sesión y ruta privada -> login
  if (!user && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // Con sesión y ruta pública de auth -> dashboard
  if (user && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            El <code>setAll</code> del proxy escribe las cookies <strong>refrescadas</strong>{" "}
            en la respuesta. Es lo que mantiene la sesión viva cuando el access
            token expira (Supabase los renueva automáticamente).
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
import { getSessionUser } from "@/lib/supabase/session";

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
          <li>Crea una cuenta en <code>/register</code> → (según config) te redirige o pide confirmar email.</li>
          <li>El usuario queda en <strong>Supabase Dashboard → Authentication → Users</strong>.</li>
          <li>Visita <code>/dashboard</code> sin sesión → el proxy te manda a <code>/login</code>.</li>
          <li>Haz clic en <strong>Cerrar sesión</strong> → vuelves a <code>/login</code>.</li>
        </ol>
      </section>
    </>
  );
}
