import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthServer() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Servidor de Autenticación con Better Auth</h1>
        <p className="content-subtitle">
          Configuración del servidor auth y endpoint API
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          ETAPA 1: Configuración de Better Auth (<code>server/src/auth.ts</code>)
        </h2>
        <p className="section-paragraph">
          Aquí está la magia de la integración. Void te da el <code>env</code> con la conexión a D1.
          Usamos el adaptador de Drizzle para Better Auth.
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
      // google: {
      //   clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      //   clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
      // },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 días
    },
  });
}`}
        />
        <div className="tip">
          <span className="tip-icon">⚡</span>
          <span>
            Void <strong>escanea</strong> este archivo y detecta la importación de <code>betterAuth</code>.
            Automáticamente configura las rutas de autenticación y el manejo de sesiones.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          ETAPA 2: Endpoint de la API (<code>server/api/auth/[...all].ts</code>)
        </h2>
        <p className="section-paragraph">
          Void usa el sistema de rutas de Vite. Este archivo capturará todas las peticiones a
          <code>/api/auth/*</code> (login, signup, logout, sesión).
        </p>
        <CodeBlock
          code={`import { createAuth } from "../../src/auth";

export const onRequest = (context: { env: { DB: D1Database } }) => {
  const auth = createAuth(context.env);
  return auth.handler;
};`}
        />
        <p className="section-paragraph">
          <strong>Nota:</strong> La sintaxis exacta puede variar según la versión de Void. Si tu versión
          es diferente, consulta la documentación oficial para el manejo de rutas en el servidor.
        </p>
        <div className="tip">
          <span className="tip-icon">📡</span>
          <span>
            El endpoint <code>/api/auth/*</code> maneja automáticamente:
            <br />
            • <code>POST /api/auth/sign-in/email</code> – Login con email/contraseña
            <br />
            • <code>POST /api/auth/sign-up/email</code> – Registro
            <br />
            • <code>POST /api/auth/logout</code> – Cierre de sesión
            <br />
            • <code>GET /api/auth/session</code> – Obtener sesión actual
          </span>
        </div>
      </section>
    </>
  );
}