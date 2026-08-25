import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Drizzle y Void</h1>
        <p className="content-subtitle">
          Esquema de base de datos y cliente Drizzle
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🗄️</span>
          ETAPA 1: Esquema de base de datos (<code>db/schema.ts</code>)
        </h2>
        <p className="section-paragraph">
          Better Auth necesita tablas específicas para gestionar usuarios, sesiones, cuentas y verificaciones.
          Define las tablas con Drizzle:
        </p>
        <CodeBlock
          code={`import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).default(false),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow(),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  issuer: text("issuer"),   // <-- OBLIGATORIO
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow(),
});

export const verifications = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow(),
});`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Void usará este esquema como <strong>fuente de verdad</strong> para generar los tipos y las migraciones.
            La tabla <code>accounts</code> almacena tanto credenciales de email/password como tokens de OAuth.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔌</span>
          ETAPA 2: Cliente de base de datos (<code>db/index.ts</code>)
        </h2>
        <p className="section-paragraph">
          Void te proporciona el entorno con la conexión a D1. Solo necesitas crear la función que recibe
          ese entorno y devuelve el cliente de Drizzle.
        </p>
        <CodeBlock
          code={`import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function createDb(env: { DB: D1Database }) {
  return drizzle(env.DB, { schema });
}`}
        />
        <div className="tip">
          <span className="tip-icon">⚡</span>
          <span>
            Void <strong>escanea tu código</strong> y detecta la importación de <code>db</code>.
            Automáticamente aprovisiona una base de datos D1 en Cloudflare y ejecuta las migraciones
            cuando despliegas con <code>void deploy</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">⚙️</span>
          ETAPA 3: Configuración de Drizzle (<code>drizzle.config.ts</code>)
        </h2>
        <p className="section-paragraph">
          Void usa D1, que es SQLite. Configura Drizzle para que sepa que trabajas con SQLite.
        </p>
        <CodeBlock
          code={`import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: ".void/d1.sqlite",
  },
  out: "./drizzle",
});`}
        />
        <p className="section-paragraph">Genera las migraciones iniciales:</p>
        <CommandBlock command="npx drizzle-kit generate" />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Las migraciones se generan localmente. Cuando ejecutes <code>void deploy</code>, Void
            las aplicará automáticamente en el D1 aprovisionado.
          </span>
        </div>
      </section>
    </>
  );
}