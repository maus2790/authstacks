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
        <p className="section-paragraph">Crea el archivo <code>.env.local</code> con las siguientes variables:</p>
        <CodeBlock
          code={`# Base de datos (Turso)
TURSO_DATABASE_URL="libsql://<nombre>.turso.io"
TURSO_AUTH_TOKEN="<token>"

# Lucia (no necesario para desarrollo, pero para OAuth necesitarás credenciales)
GOOGLE_CLIENT_ID="tu-client-id"
GOOGLE_CLIENT_SECRET="tu-client-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          2. Esquema de base de datos con Drizzle
        </h2>
        <p className="section-paragraph">
          Crea <code>lib/db/schema.ts</code> con las tablas necesarias para Lucia:
        </p>
        <CodeBlock
          code={`import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ==================== TABLA DE USUARIOS ====================
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  hashedPassword: text("hashed_password"),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  avatarUrl: text("avatar_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql\`CURRENT_TIMESTAMP\`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql\`CURRENT_TIMESTAMP\`)
    .notNull(),
});

// ==================== TABLA DE SESIONES ====================
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

// ==================== TABLA DE CUENTAS OAuth (para Google, GitHub, etc.) ====================
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  providerId: text("provider_id").notNull(), // "google", "github", etc.
  providerUserId: text("provider_user_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql\`CURRENT_TIMESTAMP\`)
    .notNull(),
});

// ==================== TABLA DE TOKENS DE VERIFICACIÓN ====================
export const verificationTokens = sqliteTable("verification_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").unique().notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  type: text("type").notNull(), // "email_verification", "password_reset"
});`}
        />
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

export const db = drizzle(client);

export * from "./schema";`}
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
        <p className="section-paragraph">Ejecuta la migración:</p>
        <CommandBlock command="npm run db:generate" />
        <CommandBlock command="npm run db:push" />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🦋</span>
          5. Configuración de Lucia (<code>lib/lucia.ts</code>)
        </h2>
        <p className="section-paragraph">
          Crea el archivo <code>lib/lucia.ts</code> que configura Lucia con el adaptador de Drizzle:
        </p>
        <CodeBlock
          code={`import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db, sessions, users } from "@/lib/db";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      name: attributes.name,
      avatarUrl: attributes.avatarUrl,
      emailVerified: attributes.emailVerified,
    };
  },
});

// Tipado para declaración de Lucia (ver paso siguiente)
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      name: string;
      avatarUrl: string | null;
      emailVerified: boolean;
    };
  }
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            El adaptador para Drizzle convierte las operaciones de Lucia en consultas SQL.
            Lucia maneja automáticamente la creación y verificación de sesiones.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          6. Middleware de protección
        </h2>
        <p className="section-paragraph">
          Crea <code>middleware.ts</code> para proteger rutas usando Lucia:
        </p>
        <CodeBlock
          code={`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
const protectedPaths = ["/dashboard", "/profile"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;

  let session = null;
  let user = null;

  if (sessionId) {
    const { session: luciaSession, user: luciaUser } = await lucia.validateSession(
      sessionId
    );
    session = luciaSession;
    user = luciaUser;
  }

  const isPublic = publicPaths.some((p) => path.startsWith(p));
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (user && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!user && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            Lucia maneja las sesiones con cookies seguras. El middleware valida la sesión en cada
            petición y redirige según sea necesario.
          </span>
        </div>
      </section>
    </>
  );
}