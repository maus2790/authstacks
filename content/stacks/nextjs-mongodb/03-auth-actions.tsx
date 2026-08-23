import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Server Actions de Autenticación</h1>
        <p className="content-subtitle">
          Login, registro, recuperación y gestión de perfil con MongoDB
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          1. Acciones principales de autenticación
        </h2>
        <p className="section-paragraph">
          Crea <code>actions/auth/auth.ts</code> con las siguientes funciones:
        </p>

        <h3 className="subsection-title">1.1. Login</h3>
        <CodeBlock
          code={`"use server";
import { z } from "zod";
import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/db/models";
import { createSession, deleteSession } from "@/lib/auth";
import { logActivity } from "./log-activity";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  await connectToDatabase();
  const user = await User.findOne({ email }).lean();

  if (!user) {
    return { error: "Credenciales incorrectas" };
  }

  const isValid = await compare(password, user.passwordHash);
  if (!isValid) {
    return { error: "Credenciales incorrectas" };
  }

  // Crear sesión
  await createSession(user);

  // Registrar actividad
  await logActivity({
    userId: user._id,
    action: "login",
    details: "Inicio de sesión exitoso",
  });

  redirect("/dashboard");
}`}
        />

        <h3 className="subsection-title">1.2. Registro</h3>
        <CodeBlock
          code={`import { hash } from "bcryptjs";
import { randomBytes } from "crypto";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, "Debes aceptar los términos"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const terms = formData.get("terms") === "on";

  const result = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
    terms,
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  await connectToDatabase();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { error: "Este correo ya está registrado" };
  }

  const hashedPassword = await hash(password, 10);
  const verificationToken = randomBytes(32).toString("hex");

  const newUser = await User.create({
    name,
    email,
    passwordHash: hashedPassword,
    verificationToken,
    emailVerified: false,
    role: "user",
  });

  // Enviar email de verificación (implementar con Resend o similar)
  // ...

  await logActivity({
    userId: newUser._id,
    action: "register",
    details: "Nuevo usuario registrado",
  });

  redirect("/login?registered=true");
}`}
        />

        <h3 className="subsection-title">1.3. Cerrar sesión</h3>
        <CodeBlock
          code={`export async function logoutAction() {
  const session = await getSession();
  if (session?.user) {
    await logActivity({
      userId: session.user._id,
      action: "logout",
      details: "Cierre de sesión",
    });
  }
  await deleteSession();
  redirect("/login");
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          2. Obtener usuario y actualizar perfil
        </h2>

        <h3 className="subsection-title">2.1. Obtener usuario (<code>actions/auth/get-user.ts</code>)</h3>
        <CodeBlock
          code={`"use server";
import { getUserFromSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/db/models";

export async function getUser() {
  const user = await getUserFromSession();
  if (!user) return null;

  await connectToDatabase();
  const fullUser = await User.findById(user._id).lean();
  return fullUser;
}`}
        />

        <h3 className="subsection-title">2.2. Actualizar perfil (<code>actions/auth/update-profile.ts</code>)</h3>
        <CodeBlock
          code={`"use server";
import { z } from "zod";
import { getUserFromSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/lib/db/models";

const profileSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
});

export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const result = profileSchema.safeParse({ name });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const user = await getUserFromSession();
  if (!user) return { error: "No autenticado" };

  await connectToDatabase();
  await User.findByIdAndUpdate(user._id, { name });

  return { success: true };
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📧</span>
          3. Recuperación de contraseña
        </h2>
        <CodeBlock
          code={`export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  // Validar email...

  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user) {
    return { success: true }; // No revelar si existe o no
  }

  const resetToken = randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await User.findByIdAndUpdate(user._id, {
    resetToken,
    resetTokenExpiry,
  });

  // Enviar email con enlace: /reset-password/[token]
  // ...

  return { success: true };
}

export async function resetPasswordAction(token: string, formData: FormData) {
  const password = formData.get("password") as string;
  // Validar...

  await connectToDatabase();
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });
  if (!user) {
    return { error: "Token inválido o expirado" };
  }

  const hashedPassword = await hash(password, 10);
  await User.findByIdAndUpdate(user._id, {
    passwordHash: hashedPassword,
    resetToken: null,
    resetTokenExpiry: null,
  });

  // Eliminar sesiones activas (opcional)
  // ...

  redirect("/login?reset=true");
}`}
        />
      </section>
    </>
  );
}