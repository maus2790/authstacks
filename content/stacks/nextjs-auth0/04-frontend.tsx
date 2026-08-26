import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Frontend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Páginas de Autenticación</h1>
        <p className="content-subtitle">
          Landing con botones de Registrarse e Iniciar sesión
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          1. Cómo funciona el login y el registro
        </h2>
        <p className="section-paragraph">
          Auth0 muestra sus propias páginas de login y registro ({" "}
          <strong>Universal Login</strong>), hosteadas por ellos. Tú solo necesitas
          dos enlaces:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>
            <code>/auth/login</code> → página de login (con enlace a "Sign up" si el
            registro está habilitado).
          </li>
          <li>
            <code>/auth/login?screen_hint=signup</code> → <strong>directo al formulario
            de registro</strong>.
          </li>
        </ul>
        <div className="tip">
          <span className="tip-icon">🎨</span>
          <span>
            Puedes personalizar la apariencia (logo, colores, idioma) en{" "}
            <strong>Branding → Universal Login</strong> del dashboard de Auth0, sin
            tocar código.
          </span>
        </div>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            Usa etiquetas <code>&lt;a&gt;</code> (no <code>&lt;Link&gt;</code>) para
            estos enlaces: la redirección a Auth0 debe ser un navegador completo,
            no navegación cliente de Next.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          2. Página de inicio (<code>app/page.tsx</code>)
        </h2>
        <p className="section-paragraph">
          Reemplaza el contenido de <code>app/page.tsx</code> por esto. Es un Server
          Component que lee la sesión: si ya estás autenticado te manda al dashboard;
          si no, muestra los botones:
        </p>
        <h3 className="subsection-title">app/page.tsx</h3>
        <CodeBlock
          code={`import { redirect } from "next/navigation";

import { auth0 } from "@/lib/auth0";

export default async function Home() {
  const session = await auth0.getSession();

  // Si ya hay sesión, ir directo al dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-xl backdrop-blur-lg">
        <h1 className="mb-2 text-3xl font-bold text-white">Bienvenido</h1>
        <p className="mb-8 text-white/60">
          Inicia sesión o crea una cuenta. Auth0 se encarga de la autenticación.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="/auth/login?screen_hint=signup"
            className="w-full rounded-lg bg-white px-4 py-3 text-center font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Registrarse
          </a>
          <a
            href="/auth/login"
            className="w-full rounded-lg border border-white/30 px-4 py-3 text-center font-semibold text-white transition hover:bg-white/10"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            <code>auth0.getSession()</code> lee la cookie de sesión en el servidor.
            No expone nada sensible al cliente.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">✂️</span>
          3. Lo que NO necesitas crear
        </h2>
        <p className="section-paragraph">
          En versiones viejas del SDK (v3) o en tutoriales de la competencia verás
          estos archivos. <strong>No los crees</strong>:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li><code>app/login/page.tsx</code> y <code>app/register/page.tsx</code> – el login/registro es de Auth0.</li>
          <li><code>app/logout/page.tsx</code> – el logout es un simple enlace a <code>/auth/logout</code>.</li>
          <li><code>components/ui/Button.tsx</code>, <code>Input.tsx</code> – no hay formularios propios.</li>
          <li><code>components/auth/*</code> – los componentes con <code>useUser</code> son opcionales; para esta app no hacen falta.</li>
        </ul>
      </section>
    </>
  );
}
