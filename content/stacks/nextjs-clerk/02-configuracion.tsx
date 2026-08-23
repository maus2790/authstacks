import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Clerk</h1>
        <p className="content-subtitle">
          Variables de entorno, proveedor y middleware
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          1. Obtener credenciales de Clerk
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Clerk Dashboard</a>.</li>
          <li>Crea una nueva aplicación (elige un nombre y selecciona Next.js).</li>
          <li>En la sección <strong>API Keys</strong>, copia el <strong>Publishable Key</strong> y el <strong>Secret Key</strong>.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>La <strong>Secret Key</strong> es sensible y solo debe usarse en el servidor (variables de entorno).</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          2. Variables de entorno (<code>.env.local</code>)
        </h2>
        <p className="section-paragraph">Crea el archivo <code>.env.local</code> con las siguientes variables:</p>
        <CodeBlock
          code={`# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxx"

# Clerk URLs (para desarrollo y producción)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔌</span>
          3. Proveedor Clerk (<code>app/layout.tsx</code>)
        </h2>
        <p className="section-paragraph">
          Envuelve tu aplicación con <code>ClerkProvider</code> en el layout raíz:
        </p>
        <CodeBlock
          code={`import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi App con Clerk",
  description: "Autenticación con Clerk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span><code>ClerkProvider</code> es el proveedor que da acceso a los hooks y componentes de Clerk en toda la aplicación.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          4. Middleware de Clerk (<code>middleware.ts</code>)
        </h2>
        <p className="section-paragraph">
          Clerk provee un middleware que automáticamente protege rutas y maneja sesiones.
          Crea <code>middleware.ts</code> en la raíz con el siguiente código:
        </p>
        <CodeBlock
          code={`import { clerkMiddleware } from "@clerk/nextjs/server";

// Opcional: si quieres rutas públicas, usa la siguiente configuración:
// export default clerkMiddleware({
//   publicRoutes: ["/", "/about", "/api/public"],
// });

// Por defecto, protege todas las rutas excepto las que coinciden con el matcher.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Saltar archivos estáticos, imágenes, etc.
    "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Siempre ejecutar para rutas API
    "/(api|trpc)(.*)",
  ],
};`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            El middleware de Clerk protege automáticamente todas las rutas. Para desproteger algunas
            (como la página de inicio), usa la opción <code>publicRoutes</code> en el objeto de configuración
            (comentada en el código). Asegúrate de que el <code>matcher</code> excluya los archivos estáticos.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">⚙️</span>
          5. Personalización de páginas (opcional)
        </h2>
        <p className="section-paragraph">
          Clerk genera automáticamente las páginas de login y registro, pero puedes personalizarlas
          creando tus propios componentes y configurando las rutas. Por ejemplo, para usar una página
          personalizada de login, crea <code>app/sign-in/[[...sign-in]]/page.tsx</code>:
        </p>
        <CodeBlock
          code={`import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}`}
        />
        <p className="section-paragraph">
          Clerk automáticamente manejará la redirección después del login según las variables
          de entorno <code>NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL</code>.
        </p>
      </section>
    </>
  );
}