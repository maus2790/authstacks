import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Better Auth</h1>
        <p className="content-subtitle">
          Variables de entorno, base de datos, esquema y API de autenticación
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          1. Variables de entorno (<code>.env.local</code>)
        </h2>
        <p className="section-paragraph">Rellena <code>.env.local</code>. Los valores de Turso los obtienes en el dashboard de Turso → tu base de datos → <strong>Settings</strong>:</p>
        <CodeBlock
          code={`# Base de datos (Turso)
TURSO_DATABASE_URL="libsql://<nombre>.turso.io"
TURSO_AUTH_TOKEN="<token>"

# Better Auth (secreto para JWT y cookies)
BETTER_AUTH_SECRET="tu-secreto-super-seguro"

# URL de tu app (la usa el cliente de Better Auth)
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
        />
<div className="tip">
  <span className="tip-icon">🔒</span>
  <div>
    <strong>BETTER_AUTH_SECRET</strong> debe ser una cadena larga y aleatoria. Genérala con:
    <br />
    Windows:{' '}
    <CommandBlock command={`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`} />
    <br />
    Linux/macOS:{' '}
    <CommandBlock command="openssl rand -base64 32" />
  </div>
</div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          2. Esquema de base de datos (<code>lib/db/schema.ts</code>)
        </h2>
        <p className="section-paragraph">
          Better Auth v1 necesita <strong>4 tablas con campos exactos</strong>.
          Puedes generarlas automáticamente con el CLI de Better Auth o copiar este
          esquema (ya es el que genera el CLI para Drizzle + SQLite):
        </p>
        <CodeBlock
          code={`import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  issuer: text("issuer").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});`}
        />
        <div className="tip">
          <span className="tip-icon">⚙️</span>
          <span>
            Alternativa automática (opcional): instala el CLI y ejecuta{" "}
            <code>npx @better-auth/cli@latest generate</code> — te crea el archivo{" "}
            <code>auth-schema.ts</code> con las tablas exactas de tu configuración.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔌</span>
          3. Cliente de base de datos (<code>lib/db/index.ts</code>)
        </h2>
        <CodeBlock
          code={`import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">⚙️</span>
          4. Configuración de Drizzle (<code>drizzle.config.ts</code>)
        </h2>
        <CodeBlock
          code={`import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  out: "./drizzle",
});`}
        />
        <p className="section-paragraph">
          Crea las tablas en Turso ejecutando el push (si usas scripts propios,
          añádelos al <code>package.json</code>):
        </p>
        <CommandBlock command="npx drizzle-kit push" />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Opcional: añade a <code>package.json</code> los scripts{" "}
            <code>"db:generate": "drizzle-kit generate"</code> y{" "}
            <code>"db:push": "drizzle-kit push"</code> para no escribir el comando
            completo cada vez.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">✨</span>
          5. Configuración de Better Auth (<code>lib/auth/index.ts</code>)
        </h2>
        <CodeBlock
          code={`import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});`}
        />
        <div className="tip">
          <span className="tip-icon">🔑</span>
          <span>
            <code>BETTER_AUTH_SECRET</code> se lee automáticamente de las variables
            de entorno — no hay que pasarlo en el código. Las contraseñas se hashean
            con scrypt (incluido), sin librerías extra. El <code>baseURL</code> evita
            el warning de Better Auth y es necesario para que los callbacks
            funcionen.
          </span>
        </div>
        <div className="tip">
          <span className="tip-icon">🚨</span>
          <span>
            <strong>No te saltes <code>nextCookies()</code>.</strong> Sin este plugin,
            las Server Actions del paso 3 (<code>auth.api.signInEmail</code> etc.)
            <strong>no guardan la cookie de sesión en el navegador</strong>: el
            registro crea al usuario, pero al terminar el proxy te manda de vuelta a{" "}
            <code>/login</code> porque no ve la sesión. El plugin transfiere el{" "}
            <code>Set-Cookie</code> de la respuesta de Better Auth al{" "}
            <code>cookies()</code> de Next.js. (Por HTTP directo a{" "}
            <code>/api/auth/*</code> sí funciona sin él, pero las Server Actions
            fallan.)
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔌</span>
          6. La API Route que lo conecta todo (<code>app/api/auth/[...all]/route.ts</code>)
        </h2>
        <p className="section-paragraph">
          <strong>Este es el archivo más importante</strong>: expone TODAS las rutas
          de Better Auth (<code>/api/auth/sign-up/email</code>,{" "}
          <code>/api/auth/sign-in/email</code>, <code>/api/auth/sign-out</code>,{" "}
          <code>/api/auth/get-session</code>…) bajo un solo handler:
        </p>
        <CodeBlock
          code={`import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth.handler);`}
        />
        <div className="tip">
          <span className="tip-icon">🚨</span>
          <span>
            Sin este archivo, <strong>nada funciona</strong>: todos los endpoints de
            Better Auth devuelven 404. Es el puente entre tu app y la librería.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🖥️</span>
          7. Cliente para el frontend (<code>lib/auth-client.ts</code>)
        </h2>
        <p className="section-paragraph">
          El cliente se usa en componentes de React (botones de Google, estado de
          sesión). En esta guía solo lo necesitarás para el login social del paso 6:
        </p>
        <CodeBlock
          code={`import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔍</span>
          8. Verificar que la API responde
        </h2>
        <p className="section-paragraph">
          Con el servidor corriendo, visita en el navegador:
        </p>
        <CodeBlock code="http://localhost:3000/api/auth/get-session" />
        <p className="section-paragraph">
          Debe responder <code>{"{}"}</code> (JSON vacío de sesión) o{" "}
          <code>{"{ user: ..., session: ... }"}</code> si hay sesión. Si da 404,
          revisa que la ruta <code>[...all]</code> esté bien creada.
        </p>
      </section>
    </>
  );
}
