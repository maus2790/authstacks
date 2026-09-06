import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Clerk</h1>
        <p className="content-subtitle">
          Variables de entorno, ClerkProvider y proxy
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          1. Variables de entorno (<code>.env.local</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          <code>clerk init</code> crea y rellena tu <code>.env.local</code>
          automáticamente. Este es el formato que deja (con tus claves reales):
        </p>
        <CodeBlock
          code={`# Clerk (las genera clerk init con los valores de tu aplicación)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxx"

# URLs de las páginas de auth (componentes SignIn/SignUp)
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# A dónde redirigir tras autenticarse (fallback)
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            <code>CLERK_SECRET_KEY</code> es <strong>secreta</strong>: nunca la
            expongas en código de cliente ni la imprimas. La{" "}
            <code>NEXT_PUBLIC_</code> sí puede estar en el frontend.
          </span>
        </div>
        <div className="tip">
          <span className="tip-icon">🚨</span>
          <span>
            Las variables se cargan al arrancar: <strong>reinicia</strong>{" "}
            <code>npm run dev</code> si las cambias a mano.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔌</span>
          2. Proveedor Clerk (<code>app/layout.tsx</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          <code>clerk init</code> envuelve la app con <code>ClerkProvider</code>.
          Si lo haces a mano, reemplaza <code>app/layout.tsx</code> por este
          contenido completo:
        </p>
        <CodeBlock
          code={`import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mi App con Clerk",
  description: "Autenticación con Clerk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={\`\${geistSans.variable} \${geistMono.variable}\`}>
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <strong><code>ClerkProvider</code> va dentro de <code>&lt;body&gt;</code></strong>
            , nunca envolviendo <code>&lt;html&gt;</code>. Sin el proveedor, los
            componentes de Clerk (SignIn, UserButton…) fallan.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          3. Proxy de Clerk (<code>proxy.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          En <strong>Next.js 16</strong>, <code>middleware.ts</code> fue renombrado a{" "}
          <code>proxy.ts</code>. <code>clerk init</code> crea este archivo; si lo
          haces a mano, usa este contenido completo:
        </p>
        <CodeBlock
          code={`import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Ignorar archivos estáticos y assets (imágenes, css, etc.)
    "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Siempre ejecutar para rutas API/trpc
    "/(api|trpc)(.*)",
    // Ruta interna de Clerk (sesión en el navegador) — obligatoria en Next 16
    "/__clerk/:path*",
  ],
};`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <strong>No te saltes <code>"/__clerk/:path*"</code></strong>: en
            Next.js 16 el proxy se ejecuta antes que las rutas, y Clerk usa esa
            ruta interna para las solicitudes de sesión del navegador. Debe ir
            <strong> después</strong> de <code>"/(api|trpc)(.*)"</code>.
          </span>
        </div>
        <div className="tip">
          <span className="tip-icon">🔓</span>
          <span>
            Por defecto <code>clerkMiddleware()</code> protege todas las rutas. Para
            hacer públicas algunas (ej. la home), pásale un objeto con{" "}
            <code>publicRoutes</code>:{" "}
            <code>{`clerkMiddleware({ publicRoutes: ["/", "/about"] })`}</code>.
          </span>
        </div>
      </section>
    </>
  );
}
