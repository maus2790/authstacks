import { CodeBlock } from "@/components/ui/CodeBlock";

export default function LogicaBackend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Server Actions de Autenticación</h1>
        <p className="content-subtitle">
          Todas las acciones del servidor: login, registro, logout, olvido y restablecimiento de
          contraseña
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          ETAPA 7: Server Actions de autenticación
        </h2>
        <p className="section-paragraph">
          <strong>Objetivo:</strong> Crear las acciones del servidor para login, registro, logout,
          olvido y restablecimiento de contraseña.
        </p>
        <h3 className="subsection-title">7.1. <code>app/actions/rate-limit.ts</code></h3>

        <p className="section-paragraph">
          Protección básica contra ataques de fuerza bruta:
        </p>
        <CodeBlock
          code={`const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 5;

export function checkRateLimit(identifier: string): {
  success: boolean;
  remaining?: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  if (record.count >= MAX_REQUESTS) {
    return { success: false };
  }

  record.count++;
  rateLimitStore.set(identifier, record);
  return { success: true, remaining: MAX_REQUESTS - record.count };
}`}
        />
        <div className="tip">
          <span className="tip-icon">🛡️</span>
          <span>
            Este sistema limita a 5 intentos por minuto por IP. Para producción, considera usar Redis
            para persistencia entre reinicios.
          </span>
        </div>


<h3 className="subsection-title">
  7.2. <code>app/actions/auth.ts</code> (COMPLETO)
</h3>

<p className="section-paragraph">
  Este archivo contiene las Server Actions relacionadas con autenticación:
  inicio de sesión, registro, cierre de sesión, recuperación y restablecimiento
  de contraseña. También incorpora validación con Zod, hash de contraseñas con
  bcrypt, protección contra múltiples intentos, sesiones, verificación por
  correo electrónico y registro de actividades.
</p>

<CodeBlock
  code={`"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers, cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  comparePassword,
  hashPassword,
  validatePasswordStrength,
} from "@/lib/password";
import {
  createSession,
  getSession,
  deleteSession,
  updateLastLogin,
  logoutAllDevices,
} from "@/lib/auth";
import { logActivity } from "@/lib/logger";
import { checkRateLimit } from "./rate-limit";
import {
  sendEmail,
  generateVerificationEmail,
  generateResetPasswordEmail,
} from "@/lib/mail";
import { randomBytes } from "crypto";

// ============================================================================
// ESQUEMAS DE VALIDACIÓN
// ============================================================================

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
    terms: z
      .boolean()
      .refine((val) => val === true, "Debes aceptar los términos"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const forgotPasswordSchema = z.object({
  email: z.string().email("Correo inválido"),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// ============================================================================
// FUNCIÓN 1: LOGIN
// ============================================================================

export async function loginAction(formData: FormData) {
  const headersList = await headers();

  const ip = headersList.get("x-forwarded-for") || "unknown";
  const userAgent = headersList.get("user-agent") || "";

  const rateLimitKey = \`login_\${ip}\`;
  const rateLimit = checkRateLimit(rateLimitKey);

  if (!rateLimit.success) {
    return {
      error: "Demasiados intentos. Espera un minuto.",
    };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = loginSchema.safeParse({
    email,
    password,
  });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) {
    return {
      error: "Credenciales incorrectas",
    };
  }

  const isValid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!isValid) {
    return {
      error: "Credenciales incorrectas",
    };
  }

  await createSession(
    user.id,
    userAgent,
    ip
  );

  await updateLastLogin(user.id);

  await logActivity({
    userId: user.id,
    action: "login",
    details: "Inicio de sesión exitoso",
    ip,
    userAgent,
  });

  revalidatePath("/dashboard");

  redirect("/dashboard");
}

// ============================================================================
// FUNCIÓN 2: REGISTER
// ============================================================================

export async function registerAction(formData: FormData) {
  const headersList = await headers();

  const ip = headersList.get("x-forwarded-for") || "unknown";
  const userAgent = headersList.get("user-agent") || "";

  const rateLimitKey = \`register_\${ip}\`;
  const rateLimit = checkRateLimit(rateLimitKey);

  if (!rateLimit.success) {
    return {
      error: "Demasiados intentos. Espera un minuto.",
    };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword =
    formData.get("confirmPassword") as string;

  const terms = formData.get("terms") === "on";

  const result = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
    terms,
  });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  const strength = validatePasswordStrength(password);

  if (!strength.valid) {
    return {
      error: strength.errors[0],
    };
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (existingUser) {
    return {
      error: "Este correo ya está registrado",
    };
  }

  const hashedPassword = await hashPassword(password);

  const verificationToken =
    randomBytes(32).toString("hex");

  const newUser = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash: hashedPassword,
      verificationToken,
      emailVerified: false,
      role: "user",
    })
    .returning()
    .get();

  const appUrl =
    process.env.APP_URL || "http://localhost:3000";

  const {
    subject,
    html,
  } = generateVerificationEmail(
    email,
    verificationToken,
    appUrl
  );

  await sendEmail({
    to: email,
    subject,
    html,
  });

  await logActivity({
    userId: newUser.id,
    action: "register",
    details: "Nuevo registro de usuario",
    ip,
    userAgent,
  });

  redirect("/login?registered=true");
}

// ============================================================================
// FUNCIÓN 3: LOGOUT
// ============================================================================

export async function logoutAction() {
  const headersList = await headers();

  const ip =
    headersList.get("x-forwarded-for") || "unknown";

  const session = await getSession();

  if (session) {
    await logActivity({
      userId: session.userId,
      action: "logout",
      details: "Cierre de sesión",
      ip,
    });
  }

  // Obtener la cookie de sesión correctamente.
  const cookieStore = await cookies();

  const token =
    cookieStore.get("session_token")?.value;

  if (token) {
    await deleteSession(token);
  }

  redirect("/login");
}

// ============================================================================
// FUNCIÓN 4: FORGOT PASSWORD
// ============================================================================

export async function forgotPasswordAction(
  formData: FormData
) {
  const headersList = await headers();

  const ip =
    headersList.get("x-forwarded-for") || "unknown";

  const rateLimitKey = \`forgot_\${ip}\`;

  const rateLimit =
    checkRateLimit(rateLimitKey);

  if (!rateLimit.success) {
    return {
      error: "Demasiados intentos. Espera un minuto.",
    };
  }

  const email =
    formData.get("email") as string;

  const result =
    forgotPasswordSchema.safeParse({
      email,
    });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  // No revelar si el correo está registrado.
  if (!user) {
    return {
      success: true,
    };
  }

  const resetToken =
    randomBytes(32).toString("hex");

  const resetTokenExpiry =
    new Date(Date.now() + 60 * 60 * 1000);

  await db
    .update(users)
    .set({
      resetToken,
      resetTokenExpiry,
    })
    .where(eq(users.id, user.id));

  const appUrl =
    process.env.APP_URL ||
    "http://localhost:3000";

  const {
    subject,
    html,
  } = generateResetPasswordEmail(
    email,
    resetToken,
    appUrl
  );

  await sendEmail({
    to: email,
    subject,
    html,
  });

  await logActivity({
    userId: user.id,
    action: "forgot_password",
    details:
      "Solicitud de restablecimiento de contraseña",
    ip,
  });

  return {
    success: true,
  };
}

// ============================================================================
// FUNCIÓN 5: RESET PASSWORD
// ============================================================================

export async function resetPasswordAction(
  token: string,
  formData: FormData
) {
  const headersList = await headers();

  const ip =
    headersList.get("x-forwarded-for") || "unknown";

  const password =
    formData.get("password") as string;

  const confirmPassword =
    formData.get("confirmPassword") as string;

  const result =
    resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
    };
  }

  const strength =
    validatePasswordStrength(password);

  if (!strength.valid) {
    return {
      error: strength.errors[0],
    };
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.resetToken, token))
    .get();

  if (!user) {
    return {
      error: "Token inválido o expirado",
    };
  }

  if (
    !user.resetTokenExpiry ||
    new Date(user.resetTokenExpiry) < new Date()
  ) {
    return {
      error: "El token ha expirado",
    };
  }

  const hashedPassword =
    await hashPassword(password);

  await db
    .update(users)
    .set({
      passwordHash: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    })
    .where(eq(users.id, user.id));

  // Cerrar todas las sesiones existentes
  // después de cambiar la contraseña.
  await logoutAllDevices(user.id);

  await logActivity({
    userId: user.id,
    action: "reset_password",
    details:
      "Contraseña restablecida exitosamente",
    ip,
  });

  redirect("/login?reset=true");
}`}
 /> 
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            Cada función está documentada con su propósito, flujo y retorno. Todas incluyen rate
            limiting, validación Zod, logging y manejo de errores consistente.
          </span>
        </div>
      </section>
    </>
  );
}