import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Better Auth</h1>
        <p className="content-subtitle">
          Variables de entorno, esquema de base de datos y cliente de autenticación
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

# Better Auth (secreto para JWT y cookies)
BETTER_AUTH_SECRET="tu-secreto-super-seguro"  # Genera con: openssl rand -base64 32

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            <strong>BETTER_AUTH_SECRET</strong> debe ser una cadena larga y aleatoria. Puedes generarla con:{' '}
            <CommandBlock command="openssl rand -base64 32" />
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          2. Esquema de base de datos con Drizzle
        </h2>
        <p className="section-paragraph">
          Crea <code>lib/db/schema.ts</code> con las tablas necesarias para Better Auth:
        </p>
        <CodeBlock
          code={`import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Tabla de usuarios
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  hashedPassword: text("hashed_password"),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  avatarUrl: text("avatar_url"),
  role: text("role").default("user"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql\`CURRENT_TIMESTAMP\`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql\`CURRENT_TIMESTAMP\`)
    .notNull(),
});

// Tabla de sesiones
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").unique().notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql\`CURRENT_TIMESTAMP\`)
    .notNull(),
});

// Tabla de cuentas OAuth
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  providerId: text("provider_id").notNull(),
  providerUserId: text("provider_user_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql\`CURRENT_TIMESTAMP\`)
    .notNull(),
});

// Tabla de tokens de verificación
export const verificationTokens = sqliteTable("verification_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").unique().notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  type: text("type").notNull(),
});`}
        />
        <p className="section-paragraph">Ejecuta las migraciones:</p>
        <CommandBlock command="npm run db:generate" />
        <CommandBlock command="npm run db:push" />
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
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">✨</span>
          5. Configuración de Better Auth (<code>lib/auth/index.ts</code>)
        </h2>
        <p className="section-paragraph">
          Crea el archivo <code>lib/auth/index.ts</code> que configura Better Auth con el adaptador de Drizzle:
        </p>
        <CodeBlock
          code={`import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle";
import { db, users, sessions, accounts, verificationTokens } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { users, sessions, accounts, verificationTokens },
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(url, user) {
      // Enviar correo de restablecimiento
      console.log(\`Enviar correo a \${user.email} con enlace: \${url}\`);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookie: {
      name: "better-auth-session",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 días
  },
  user: {
    defaultRole: "user",
    fields: {
      name: "name",
      email: "email",
      avatar: "avatarUrl",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Better Auth usa un adaptador para Drizzle que maneja automáticamente las operaciones
            de base de datos. La configuración es muy flexible y extensible con plugins.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          6. Middleware de protección
        </h2>
        <p className="section-paragraph">
          Crea <code>lib/auth/middleware.ts</code> para manejar la autenticación en el middleware de Next.js:
        </p>
        <CodeBlock
          code={`import { auth } from "./index";
import { NextRequest } from "next/server";

export async function getSession(request: NextRequest) {
  const headers = new Headers(request.headers);
  const cookie = headers.get("cookie") || "";
  
  // Obtener sesión de la cookie
  const sessionCookie = cookie
    .split("; ")
    .find((c) => c.startsWith("better-auth-session="))
    ?.split("=")[1];

  if (!sessionCookie) return null;

  try {
    // Decodificar y verificar la sesión (Better Auth maneja esto)
    const session = await auth.api.getSession({
      headers: new Headers({
        cookie: \`better-auth-session=\${sessionCookie}\`,
      }),
    });
    return session;
  } catch (error) {
    return null;
  }
}

export async function authMiddleware(request: NextRequest) {
  const session = await getSession(request);
  return session;
}`}
        />
        <p className="section-paragraph">
          Ahora crea <code>middleware.ts</code> en la raíz para proteger rutas:
        </p>
        <CodeBlock
          code={`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authMiddleware } from "@/lib/auth/middleware";

export const runtime = "nodejs";

const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
const protectedPaths = ["/dashboard", "/profile"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic = publicPaths.some((p) => path.startsWith(p));
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  const session = await authMiddleware(request);

  if (session && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!session && isProtected) {
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
            Better Auth maneja las sesiones con cookies seguras. El middleware valida la sesión
            en cada petición y redirige según sea necesario.
          </span>
        </div>
      </section>
    </>
  );
}