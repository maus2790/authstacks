import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Cliente Auth0 y Proxy</h1>
        <p className="content-subtitle">
          Los dos únicos archivos de infraestructura que necesitas
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎣</span>
          1. El cliente Auth0 (<code>lib/auth0.ts</code>)
        </h2>
        <p className="section-paragraph">
          En el SDK v4 se crea una instancia de <code>Auth0Client</code> que se
          importa desde el servidor. Crea <code>lib/auth0.ts</code>:
        </p>
        <h3 className="subsection-title">lib/auth0.ts</h3>
        <CodeBlock
          code={`import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  // Después de iniciar sesión o registrarse, ir al dashboard
  signInReturnToPath: "/dashboard",
});`}
        />
        <p className="section-paragraph">
          Este mismo objeto se usa en cualquier parte del servidor: Server
          Components, Server Actions y Route Handlers.
        </p>
        <div className="tip">
          <span className="tip-icon">🧠</span>
          <span>
            <code>signInReturnToPath</code> define a dónde va el usuario tras
            autenticarse (por defecto es <code>/</code>). Puedes quitarlo si
            prefieres que vuelva a la página de inicio.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          2. El proxy (<code>proxy.ts</code>) — monta las rutas de Auth0
        </h2>
        <p className="section-paragraph">
          En <strong>Next.js 16</strong>, <code>middleware.ts</code> fue renombrado a{" "}
          <code>proxy.ts</code>. El SDK lo usa para montar automáticamente todas las
          rutas de autenticación. Crea <code>proxy.ts</code> en la raíz del proyecto:
        </p>
        <h3 className="subsection-title">proxy.ts</h3>
        <CodeBlock
          code={`import type { NextRequest } from "next/server";

import { auth0 } from "./lib/auth0";

export async function proxy(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    // Ejecutar en todas las rutas excepto archivos estáticos
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Con esto, el SDK expone automáticamente estas rutas:
            <br />• <code>/auth/login</code> – iniciar sesión
            <br />• <code>/auth/login?screen_hint=signup</code> – ir directo al registro
            <br />• <code>/auth/callback</code> – recibe el retorno de Auth0
            <br />• <code>/auth/logout</code> – cerrar sesión
            <br />• <code>/auth/profile</code> – sesión actual en JSON
          </span>
        </div>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <strong>Migración desde el SDK v3 (si viste tutoriales viejos):</strong>
            <br />• Ya <strong>no</strong> se crea <code>app/api/auth/[auth0]/route.ts</code>{" "}
            con <code>handleAuth()</code> — las rutas ahora van por el proxy.
            <br />• Ya <strong>no</strong> se usa <code>withMiddlewareAuthRequired</code>{" "}
            desde <code>@auth0/nextjs-auth0/edge</code> — el proxy del SDK maneja todo.
            <br />• Ya <strong>no</strong> existen <code>AUTH0_BASE_URL</code> ni{" "}
            <code>AUTH0_ISSUER_BASE_URL</code> — ahora son <code>APP_BASE_URL</code> y{" "}
            <code>AUTH0_DOMAIN</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔄</span>
          3. Flujo completo que ya funciona
        </h2>
        <p className="section-paragraph">
          Con <code>lib/auth0.ts</code> y <code>proxy.ts</code> creados, reinicia el
          servidor y el flujo ya está activo:
        </p>
        <CommandBlock command="npm run dev" />
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>El usuario entra a la app → ve los botones de login/registro.</li>
          <li>Hace clic → es redirigido al <strong>Universal Login</strong> de Auth0 (hosteado por ellos).</li>
          <li>Se autentica o se registra → Auth0 llama a <code>/auth/callback</code>.</li>
          <li>El SDK crea la sesión (cookie cifrada) y redirige a <code>/dashboard</code>.</li>
          <li>Al cerrar sesión → <code>/auth/logout</code> borra la sesión local y la de Auth0.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">🎯</span>
          <span>
            No escribiste ni una sola línea de lógica de autenticación: ni
            contraseñas, ni tokens, ni cookies. Eso es el punto de Auth0.
          </span>
        </div>
      </section>
    </>
  );
}
