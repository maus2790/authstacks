import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Drizzle y Turso</h1>
        <p className="content-subtitle">
          Cliente de base de datos y definición de tablas
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🗄️</span>
          ETAPA 4: Esquema de base de datos y cliente
        </h2>
        <p className="section-paragraph">
          <strong>Objetivo:</strong> Definir las tablas de usuarios, sesiones y logs de actividad, y
          crear el cliente de base de datos.
        </p>
        <h3 className="subsection-title">4.1. <code>lib/db/index.ts</code></h3>
        <CodeBlock
          code={`import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);`}
        />
        <h3 className="subsection-title">4.2. <code>lib/db/schema.ts</code></h3>
        <p className="section-paragraph">
          Define las tablas <code>users</code>, <code>sessions</code> y <code>activityLogs</code>:
        </p>
        <CodeBlock
          code={`import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  role: text("role").default("user").notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  verificationToken: text("verification_token"),
  resetToken: text("reset_token"),
  resetTokenExpiry: integer("reset_token_expiry", { mode: "timestamp" }),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql\`CURRENT_TIMESTAMP\`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql\`CURRENT_TIMESTAMP\`)
    .$onUpdate(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql\`CURRENT_TIMESTAMP\`),
});

export const activityLogs = sqliteTable("activity_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  details: text("details"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql\`CURRENT_TIMESTAMP\`),
});`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            La tabla <code>sessions</code> usa <code>onDelete: &quot;cascade&quot;</code> para eliminar
            automáticamente las sesiones cuando se elimina un usuario.
          </span>
        </div>
        <h3 className="subsection-title">4.3. Generar y aplicar migración</h3>
        <p className="section-paragraph">Ejecuta los siguientes comandos para crear las tablas en Turso:</p>
        <CommandBlock command="npm run db:generate" />
        <CommandBlock command="npm run db:push" />
        <p className="section-paragraph">
          Si no hay cambios, verás <code>No schema changes, nothing to migrate</code>. Esto es normal
          si ya habías creado las tablas previamente.
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔒</span>
          ETAPA 5: Lógica de autenticación y contraseñas
        </h2>
        <p className="section-paragraph">
          <strong>Objetivo:</strong> Crear funciones para hashear/verificar contraseñas y manejar
          sesiones con cookies.
        </p>
        <h3 className="subsection-title">5.1. <code>lib/password.ts</code></h3>
        <CodeBlock
          code={`import bcrypt from "bcryptjs";
import { z } from "zod";

const SALT_ROUNDS = 12;

export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
  .regex(/[a-z]/, "Debe contener al menos una minúscula")
  .regex(/[0-9]/, "Debe contener al menos un número")
  .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial");

export async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}

export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const result = passwordSchema.safeParse(password);
  if (result.success) return { valid: true, errors: [] };
  return { valid: false, errors: result.error.errors.map((e) => e.message) };
}`}
        />
        <h3 className="subsection-title">5.2. <code>lib/auth.ts</code></h3>
        <p className="section-paragraph">
          Funciones para crear, obtener y eliminar sesiones con cookies HTTP-only:
        </p>
        <CodeBlock
          code={`import { db } from "@/lib/db";
import { users, sessions, activityLogs } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

const SESSION_EXPIRY_DAYS = 30;
const SESSION_COOKIE_NAME = "session_token";
const CSRF_COOKIE_NAME = "csrf_token";

export async function createSession(
  userId: number,
  userAgent?: string,
  ip?: string
): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const csrfToken = randomBytes(16).toString("hex");

  await db.insert(sessions).values({
    id: token,
    userId,
    expiresAt,
  });

  await db.insert(activityLogs).values({
    userId,
    action: "login",
    details: "Inicio de sesión exitoso",
    ip,
    userAgent,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  cookieStore.set(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

export async function getSession(): Promise<{ userId: number } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, token), gt(sessions.expiresAt, new Date())))
    .get();

  if (!session) {
    await deleteSession(token);
    return null;
  }

  return { userId: session.userId };
}

export async function deleteSession(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, token));
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(CSRF_COOKIE_NAME);
}

export async function logoutAllDevices(userId: number): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(CSRF_COOKIE_NAME);
}

export async function getUserById(userId: number) {
  return await db.select().from(users).where(eq(users.id, userId)).get();
}

export async function updateLastLogin(userId: number) {
  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, userId));
}`}
        />
        <div className="tip">
          <span className="tip-icon">🔐</span>
          <span>
            Las cookies son <code>httpOnly</code> y <code>secure</code> en producción. Nunca expones
            los tokens de sesión al cliente.
          </span>
        </div>
      </section>
    </>
  );
}