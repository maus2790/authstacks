import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Configuración de autenticación con Google en Better Auth
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          ETAPA 1: Configuración en Google Cloud
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a>.</li>
          <li>Crea un proyecto o selecciona uno existente.</li>
          <li>Ve a <strong>APIs y Servicios → Credenciales</strong>.</li>
          <li>Crea un <strong>ID de cliente OAuth</strong> de tipo "Aplicación web".</li>
          <li>
            En <strong>Orígenes autorizados de JavaScript</strong>, añade tu URL de desarrollo:
            <CodeBlock code="http://localhost:5173" />
          </li>
          <li>
            En <strong>URIs de redireccionamiento autorizados</strong>, añade:
            <CodeBlock code="http://localhost:5173/api/auth/callback/google" />
          </li>
          <li>Copia el <strong>ID de cliente</strong> y el <strong>Secreto de cliente</strong>.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">📋</span>
          <span>
            Para producción, reemplaza <code>http://localhost:5173</code> con tu dominio de Void
            (<code>https://&lt;slug&gt;.void.app</code>).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          ETAPA 2: Configurar variables de entorno
        </h2>
        <p className="section-paragraph">Añade al archivo <code>.env</code>:</p>
        <CodeBlock
          code={`AUTH_GOOGLE_CLIENT_ID="<tu-client-id>.apps.googleusercontent.com"
AUTH_GOOGLE_CLIENT_SECRET="<tu-client-secret>"`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">⚙️</span>
          ETAPA 3: Configurar Better Auth con Google
        </h2>
        <p className="section-paragraph">
          Modifica <code>server/src/auth.ts</code> para incluir el proveedor social:
        </p>
        <CodeBlock
          code={`import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb } from "../../db";
import * as schema from "../../db/schema";

export function createAuth(env: { DB: D1Database }) {
  const db = createDb(env);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
    },
  });
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          ETAPA 4: Botón de Google en el frontend
        </h2>
        <p className="section-paragraph">
          Añade un botón en el componente de Login usando el cliente centralizado:
        </p>
        <CodeBlock
          code={`import { authClient } from "@/lib/auth-client";

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full mt-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition flex items-center justify-center gap-2"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continuar con Google
    </button>
  );
}`}
        />
        <p className="section-paragraph">
          Luego, importa este botón en tu página de login y colócalo debajo del formulario.
        </p>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Better Auth maneja automáticamente el flujo de OAuth: redirige a Google, recibe el callback,
            crea la cuenta y la sesión, y redirige al <code>callbackURL</code> configurado.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">✅</span>
          Conclusión
        </h2>
        <p className="section-paragraph">
          Has implementado autenticación completa con <strong>Void + Drizzle + Better Auth</strong>,
          incluyendo:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>Registro e inicio de sesión con email/contraseña.</li>
          <li>Login con Google OAuth.</li>
          <li>Protección de rutas y gestión de sesión.</li>
          <li>Infraestructura aprovisionada automáticamente por Void.</li>
          <li>Diseño moderno Glassmorphism y Dark Cyber.</li>
        </ul>
        <div className="tip">
          <span className="tip-icon">🚀</span>
          <span>
            <strong>Lo mejor de todo:</strong> Todo esto sin haber escrito una línea de YAML ni haber
            tocado un panel de Cloudflare. <code>void deploy</code> y listo.
          </span>
        </div>
      </section>
    </>
  );
}