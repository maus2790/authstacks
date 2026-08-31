import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Lucia</h1>
        <p className="content-subtitle">
          Variables de entorno, esquema de base de datos y cliente de Lucia
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          1. Variables de entorno (<code>.env.local</code>)
        </h2>
        <p className="section-paragraph">Crea <code>.env.local</code>. Para desarrollo sin credenciales, usa una SQLite local en archivo; para producción, tu Turso remoto:</p>
        <CodeBlock
          code={`# Base de datos.
# Desarrollo local (sin credenciales): SQLite en archivo
TURSO_DATABASE_URL="file:./local.db"
# Producción (Turso remoto), usa tu URL y token:
# TURSO_DATABASE_URL="libsql://<nombre>.turso.io"
# TURSO_AUTH_TOKEN="<token>"

# URL de tu app
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth (paso 6)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Con <code>file:./local.db</code> no necesitas cuenta de Turso para seguir
            la guía: la base se crea sola en el proyecto. Para producción cambia la
            URL y añade el token.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          2. Esquema de base de datos (<code>lib/db/schema.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Lucia solo exige la tabla <code>users</code> con <code>id</code> y la tabla{" "}
          <code>sessions</code> con <code>id</code>, <code>user_id</code> y{" "}
          <code>expires_at</code> como <strong>timestamp numérico</strong> (sin{" "}
          <code>mode: "timestamp"</code> — el adaptador lo espera así). Crea{" "}
          <code>lib/db/schema.ts</code> con este contenido completo:
        </p>
        <CodeBlock
          code={`import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Tabla de usuarios (Lucia solo necesita "id"; el resto son datos tuyos)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  hashedPassword: text("hashed_password"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Tabla de sesiones (campos exactos que exige el adaptador de Lucia)
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // El adaptador de Lucia espera un timestamp numérico (sin mode: "timestamp")
  expiresAt: integer("expires_at").notNull(),
});

// Tabla de cuentas OAuth (para Google/GitHub, paso 6)
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerId: text("provider_id").notNull(), // "google", "github", etc.
  providerUserId: text("provider_user_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Tabla de tokens de verificación (recuperación de contraseña)
export const verificationTokens = sqliteTable("verification_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").unique().notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  type: text("type").notNull(), // "email_verification", "password_reset"
});`}
        />
        <div className="tip">
          <span className="tip-icon">🚨</span>
          <span>
            <strong>Ojo con <code>expires_at</code>:</strong> si usas{" "}
            <code>mode: "timestamp"</code>, el adaptador de Lucia falla con un error
            de tipos. Debe ser un <code>integer</code> numérico (timestamp en
            segundos). El resto de tablas (<code>accounts</code>,{" "}
            <code>verification_tokens</code>) solo se usan en los pasos 6 y 3 de
            Google/recuperación — puedes crearlas ya.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔌</span>
          3. Cliente de base de datos (<code>lib/db/index.ts</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);

export * from "./schema";`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">⚙️</span>
          4. Configuración de Drizzle (<code>drizzle.config.ts</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  out: "./drizzle",
});`}
        />
        <p className="section-paragraph">Crea las tablas en la base de datos:</p>
        <CommandBlock command="npx drizzle-kit push" />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            El <code>{`config({ path: ".env.local" })`}</code> hace que drizzle-kit lea
            tus variables — sin esto falla con "url: undefined". También puedes
            añadir <code>"db:push": "drizzle-kit push"</code> al package.json.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🦋</span>
          5. Configuración de Lucia (<code>lib/lucia.ts</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db, sessions, users } from "@/lib/db";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // "lax" es lo que recomienda Lucia; expires: false mantiene la sesión activa
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      name: attributes.name,
    };
  },
});

// Declaración de tipos para Lucia (atributos del usuario en la sesión)
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      name: string;
    };
  }
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          6. Hash de contraseñas (<code>lib/auth/password.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Lucia v3 incluye <code>Scrypt</code> — no necesitas bcryptjs:
        </p>
        <CodeBlock
          code={`import { Scrypt } from "lucia";

// Hash y verificación de contraseñas con el Scrypt de Lucia (incluido, sin bcryptjs)
export async function hashPassword(password: string): Promise<string> {
  return await new Scrypt().hash(password);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await new Scrypt().verify(hashedPassword, password);
}`}
        />
      </section>
    </>
  );
}
