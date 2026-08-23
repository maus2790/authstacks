import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Auth0</h1>
        <p className="content-subtitle">
          Variables de entorno, proveedor y middleware
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          1. Obtener credenciales de Auth0
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://manage.auth0.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Auth0 Dashboard</a>.</li>
          <li>Crear una nueva aplicación: <strong>Applications → Applications → Create Application</strong>.</li>
          <li>Elige <strong>"Regular Web Application"</strong> y haz clic en Create.</li>
          <li>Copia el <strong>Domain</strong>, <strong>Client ID</strong> y <strong>Client Secret</strong>.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>El <strong>Client Secret</strong> es sensible y solo debe usarse en variables de entorno del servidor.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          2. Configurar URIs de redirección
        </h2>
        <p className="section-paragraph">
          En la configuración de tu aplicación Auth0, ve a la sección <strong>"Application URIs"</strong> y configura:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>
            <strong>Allowed Callback URLs:</strong> <code>http://localhost:3000/api/auth/callback</code>
          </li>
          <li>
            <strong>Allowed Logout URLs:</strong> <code>http://localhost:3000</code>
          </li>
          <li>
            <strong>Allowed Web Origins:</strong> <code>http://localhost:3000</code>
          </li>
        </ul>
        <p className="section-paragraph">Para producción, reemplaza <code>http://localhost:3000</code> con tu URL de producción.</p>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>Auth0 usa estas URIs para redirigir a los usuarios después de la autenticación y cierre de sesión.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          3. Variables de entorno (<code>.env.local</code>)
        </h2>
        <p className="section-paragraph">Crea el archivo <code>.env.local</code> con las siguientes variables:</p>
        <CodeBlock
          code={`# Auth0
AUTH0_SECRET="tu-secreto-auth0"  # Genera con: openssl rand -hex 32
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://tu-dominio.auth0.com"
AUTH0_CLIENT_ID="tu-client-id"
AUTH0_CLIENT_SECRET="tu-client-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            <strong>AUTH0_SECRET</strong> debe ser una cadena larga y aleatoria. Puedes generarla con:{' '}
            <CommandBlock command="openssl rand -hex 32" />
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔌</span>
          4. Configuración de la API Route de Auth0
        </h2>
        <p className="section-paragraph">
          Crea <code>app/api/auth/[auth0]/route.ts</code> para manejar todas las rutas de autenticación de Auth0:
        </p>
        <CodeBlock
          code={`import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";

// Auth0 maneja automáticamente todas las rutas de autenticación:
// - /api/auth/login
// - /api/auth/logout
// - /api/auth/callback
// - /api/auth/me
// - /api/auth/access-token (para obtener tokens)
export const GET = handleAuth({
  async callback(req, res) {
    try {
      // Personalizar el callback (opcional)
      const result = await handleCallback(req, res);
      return result;
    } catch (error) {
      console.error("Error en callback de Auth0:", error);
      return new Response("Error en autenticación", { status: 500 });
    }
  },
});`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Auth0 maneja automáticamente el flujo de autenticación completo: login, logout, callback, etc.
            Solo necesitas este archivo de ruta para que funcione.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          5. Middleware de protección
        </h2>
        <p className="section-paragraph">
          Crea <code>middleware.ts</code> para proteger rutas usando el middleware de Auth0:
        </p>
        <CodeBlock
          code={`import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    // Proteger todas las rutas excepto las públicas
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|forgot-password).*)",
  ],
};

export function middleware(request: NextRequest) {
  // Si la ruta es pública, no requiere autenticación
  const publicPaths = ["/", "/login", "/register", "/forgot-password"];
  if (publicPaths.some((path) => request.nextUrl.pathname === path)) {
    return NextResponse.next();
  }

  // Si la ruta es protegida, usar el middleware de Auth0
  return withMiddlewareAuthRequired()(request);
}`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            Auth0 tiene dos modos de middleware: <code>withMiddlewareAuthRequired</code> para Edge Runtime
            y <code>withApiAuthRequired</code> para Node.js Runtime. Para el edge, usa el primero.
          </span>
        </div>
      </section>
    </>
  );
}