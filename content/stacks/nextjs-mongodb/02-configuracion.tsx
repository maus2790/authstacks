import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de MongoDB</h1>
        <p className="content-subtitle">
          Conexión a la base de datos, modelos y configuración de JWT
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          1. Variables de entorno (<code>.env.local</code>)
        </h2>
        <p className="section-paragraph">Crea el archivo <code>.env.local</code> con las siguientes variables:</p>
        <CodeBlock
          code={`# MongoDB
MONGODB_URI="mongodb+srv://usuario:password@cluster.mongodb.net/mi-app?retryWrites=true&w=majority"

# JWT
JWT_SECRET="tu-secreto-super-seguro-generado-con-openssl"
JWT_EXPIRES_IN="7d"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            <strong>JWT_SECRET</strong> debe ser una cadena larga y aleatoria. Puedes generarla con:{' '}
            <CommandBlock command="openssl rand -base64 32" />
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          2. Conexión a MongoDB (<code>lib/db/index.ts</code>)
        </h2>
        <p className="section-paragraph">
          Configura la conexión a MongoDB con Mongoose, usando un patrón singleton para evitar múltiples conexiones:
        </p>
        <CodeBlock
          code={`import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          3. Modelos de MongoDB (<code>lib/db/models.ts</code>)
        </h2>
        <p className="section-paragraph">
          Define los modelos <code>User</code> y <code>Session</code> para la autenticación:
        </p>
        <CodeBlock
          code={`import mongoose, { Schema, model, models } from "mongoose";

// ==================== USER MODEL ====================
export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: "user" | "admin";
  emailVerified: boolean;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", userSchema);

// ==================== SESSION MODEL (opcional, si usas JWT no es necesario, pero lo añadimos para logs) ====================
export interface ISession {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  userAgent?: string;
  ip?: string;
  createdAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    userAgent: { type: String },
    ip: { type: String },
  },
  { timestamps: true }
);

export const Session = models.Session || model<ISession>("Session", sessionSchema);

// ==================== ACTIVITY LOG (opcional) ====================
export interface IActivityLog {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  action: string;
  details?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    details: { type: String },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export const ActivityLog = models.ActivityLog || model<IActivityLog>("ActivityLog", activityLogSchema);`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          4. Configuración de autenticación con JWT (<code>lib/auth.ts</code>)
        </h2>
        <p className="section-paragraph">
          Crea funciones para manejar JWT, cookies y sesiones:
        </p>
        <CodeBlock
          code={`import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/db/models";
import { IUser } from "@/lib/db/models";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = "auth-token";

// ==================== TOKEN UTILITIES ====================
export function signToken(payload: { userId: string; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

// ==================== SESSION MANAGEMENT ====================
export async function createSession(user: IUser, userAgent?: string, ip?: string) {
  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  // Establecer cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  });

  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  // Verificar que el usuario existe en la BD
  await connectToDatabase();
  const user = await User.findById(decoded.userId).lean();
  if (!user) return null;

  return { user, token };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ==================== MIDDLEWARE HELPER ====================
export async function getUserFromSession() {
  const session = await getSession();
  return session?.user || null;
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>Usamos JWT para las sesiones, almacenado en cookies HTTP-only. Esto es seguro y escalable.</span>
        </div>
      </section>
    </>
  );
}