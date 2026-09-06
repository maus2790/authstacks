import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Sesión JWT y Server Actions</h1>
        <p className="content-subtitle">
          Cookie httpOnly, registro, login y logout
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🍪</span>
          1. JWT y cookie de sesión (<code>lib/auth.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Al autenticar, firmamos un JWT con el <code>userId</code> y lo guardamos en
          una cookie <strong>httpOnly</strong>: el navegador no puede leerla, solo el
          servidor. Crea <code>lib/auth.ts</code>:
        </p>
        <CodeBlock
          code={`import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "auth-token";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

type TokenPayload = { userId: string; email: string };

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// Crea la sesión: firma el JWT y lo guarda en cookie httpOnly
export async function createSession(payload: TokenPayload) {
  const token = signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

// Lee y verifica la cookie -> devuelve el payload o null
export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            <code>sameSite: "lax"</code> + <code>httpOnly</code> protege contra CSRF
            y robo de cookie. En producción <code>secure: true</code> obliga HTTPS.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          2. Server Actions (<code>actions/auth.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Registro, login y logout. Usan la firma de <code>useActionState</code>{" "}
          <code>(prevState, formData)</code>. Crea <code>actions/auth.ts</code> con
          este contenido completo:
        </p>
        <CodeBlock
          code={`"use server";

import { redirect } from "next/navigation";
import { hash, compare } from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/db/models";
import { createSession, deleteSession } from "@/lib/auth";

export type ActionState = { error?: string } | undefined;

export async function registerAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || name.length < 2) return { error: "El nombre es obligatorio (mín. 2 caracteres)" };
  if (!email.includes("@")) return { error: "Correo inválido" };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres" };

  await connectToDatabase();

  const existingUser = await User.findOne({ email });
  if (existingUser) return { error: "Este correo ya está registrado" };

  const passwordHash = await hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  // Crear sesión y redirigir al dashboard
  await createSession({ userId: user._id.toString(), email: user.email });
  redirect("/dashboard");
}

export async function loginAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email.includes("@")) return { error: "Correo inválido" };
  if (!password) return { error: "La contraseña es obligatoria" };

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user) return { error: "Credenciales incorrectas" };

  const valid = await compare(password, user.passwordHash);
  if (!valid) return { error: "Credenciales incorrectas" };

  await createSession({ userId: user._id.toString(), email: user.email });
  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            Nunca devuelvas el <code>passwordHash</code> ni lo envíes al cliente.
            El hash con bcrypt (factor 10) ocurre siempre en el servidor.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          3. Leer el usuario autenticado (<code>lib/session.ts</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/db/models";
import { getSession } from "@/lib/auth";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

// Devuelve los datos del usuario autenticado (nunca el hash) o null.
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession();
  if (!session) return null;

  await connectToDatabase();
  const user = await User.findById(session.userId).select("email name").lean();
  if (!user) return null;

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
}`}
        />
      </section>
    </>
  );
}
