import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function DashboardPerfil() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Dashboard Protegido</h1>
        <p className="content-subtitle">
          Ruta privada con datos del usuario y cierre de sesión
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          1. Dashboard con datos del usuario
        </h2>
        <p className="section-paragraph">
          Crea <code>app/dashboard/page.tsx</code> como Server Component: lee la
          sesión, redirige a login si no hay usuario y muestra sus datos. El botón
          <strong> Cerrar sesión</strong> es un simple enlace a <code>/auth/logout</code>:
        </p>
        <h3 className="subsection-title">app/dashboard/page.tsx</h3>
        <CodeBlock
          code={`import Image from "next/image";
import { redirect } from "next/navigation";

import { auth0 } from "@/lib/auth0";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  const user = session?.user;

  // Si no hay sesión, redirigir al login de Auth0
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-white/10 dark:bg-white/5">
        <Image
          src={user.picture ?? ""}
          alt={user.name ?? "Usuario"}
          width={80}
          height={80}
          unoptimized
          className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-blue-500"
        />
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Hola, <span className="font-medium">{user.name ?? "Usuario"}</span>
          <br />
          <span className="text-sm">{user.email}</span>
        </p>

        <a
          href="/auth/logout"
          className="mt-8 block w-full rounded-lg bg-red-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-red-700"
        >
          Cerrar sesión
        </a>
      </div>
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">👤</span>
          <span>
            <code>session.user</code> incluye (según los scopes configurados):{" "}
            <code>sub</code> (ID único), <code>name</code>, <code>email</code>,{" "}
            <code>email_verified</code> y <code>picture</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          2. Cómo se protege la ruta
        </h2>
        <p className="section-paragraph">
          La protección es <strong>doble</strong>:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>
            <strong>En el servidor (la que importa):</strong> el <code>redirect</code>{" "}
            dentro del Server Component. Si no hay sesión, nunca se renderiza el
            dashboard.
          </li>
          <li>
            <strong>Con el proxy:</strong> el SDK de Auth0 también puede proteger
            rutas desde <code>proxy.ts</code> (útil para páginas estáticas o para
            centralizar redirecciones).
          </li>
        </ul>
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            La regla de oro: la verificación en el Server Component es obligatoria.
            El proxy es una capa extra de UX (redirige antes de renderizar), nunca
            la única defensa.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🚪</span>
          3. Cierre de sesión (logout)
        </h2>
        <p className="section-paragraph">
          No necesitas una página de logout: el enlace a <code>/auth/logout</code>{" "}
          hace todo:
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Borra la cookie de sesión de tu app.</li>
          <li>Redirige al logout de Auth0 (cierra también la sesión del proveedor).</li>
          <li>Vuelve a la URL configurada en <strong>Allowed Logout URLs</strong> (en local, <code>http://localhost:3000</code>).</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Para volver a una página distinta tras el logout, usa{" "}
            <code>/auth/logout?returnTo=/ruta</code> (la URL debe estar en Allowed
            Logout URLs).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧪</span>
          4. Probar el flujo completo
        </h2>
        <CommandBlock command="npm run dev" />
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Abre <code>http://localhost:3000</code> → botones Registrarse / Iniciar sesión.</li>
          <li>Haz clic en <strong>Registrarse</strong> → formulario de Auth0.</li>
          <li>Regístrate → te redirige a <code>/dashboard</code> con tu nombre y email.</li>
          <li>Recarga la página → sigues autenticado (la cookie persiste).</li>
          <li>Haz clic en <strong>Cerrar sesión</strong> → vuelves a la página de inicio.</li>
        </ol>
      </section>
    </>
  );
}
