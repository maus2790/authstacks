import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Server Actions de Autenticación</h1>
        <p className="content-subtitle">
          Login, registro, recuperación y gestión de perfil con Better Auth
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          1. Acciones principales de autenticación
        </h2>
        <p className="section-paragraph">
          Crea <code>actions/auth/auth.ts</code> con las siguientes funciones usando la API de Better Auth:
        </p>

        <h3 className="subsection-title">1.1. Registro</h3>
        <CodeBlock
          code={`"use server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

  const headersList = await headers();

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: headersList,
    });
    redirect("/dashboard");
  } catch (error: any) {
    return { error: error.message || "Error al registrar usuario" };
  }
}`}
        />

        <h3 className="subsection-title">1.2. Login</h3>
        <CodeBlock
          code={`const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
});

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const headersList = await headers();

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: headersList,
    });
    redirect("/dashboard");
  } catch (error: any) {
    return { error: error.message || "Credenciales incorrectas" };
  }
}`}
        />

        <h3 className="subsection-title">1.3. Cerrar sesión</h3>
        <CodeBlock
          code={`export async function logoutAction() {
  const headersList = await headers();
  try {
    await auth.api.signOut({
      headers: headersList,
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
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
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUser() {
  const headersList = await headers();

  try {
    const session = await auth.api.getSession({
      headers: headersList,
    });
    return session?.user || null;
  } catch (error) {
    return null;
  }
}`}
        />

        <h3 className="subsection-title">2.2. Actualizar perfil (<code>actions/auth/update-profile.ts</code>)</h3>
        <CodeBlock
          code={`"use server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUser } from "./get-user";

const profileSchema = z.object({
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
});

export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const result = profileSchema.safeParse({ name });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const user = await getUser();
  if (!user) return { error: "No autenticado" };

  const headersList = await headers();

  try {
    await auth.api.updateUser({
      body: {
        id: user.id,
        name,
      },
      headers: headersList,
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al actualizar perfil" };
  }
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

  const headersList = await headers();

  try {
    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: \`\${process.env.NEXT_PUBLIC_APP_URL}/reset-password\`,
      },
      headers: headersList,
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Error al enviar correo de recuperación" };
  }
}

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const token = formData.get("token") as string;

  const headersList = await headers();

  try {
    await auth.api.resetPassword({
      body: {
        password,
        token,
      },
      headers: headersList,
    });
    redirect("/login?reset=true");
  } catch (error: any) {
    return { error: error.message || "Error al restablecer contraseña" };
  }
}`}
        />
      </section>
    </>
  );
}