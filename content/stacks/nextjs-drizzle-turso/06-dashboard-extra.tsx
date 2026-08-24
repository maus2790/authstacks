import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function DashboardExtra() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Dashboard, Perfil, API Routes y Seed</h1>
        <p className="content-subtitle">
          Área protegida, perfil de usuario, rutas API para verificación y restablecimiento, y script
          de seed para usuarios de prueba
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          ETAPA 10: Componentes UI reutilizables
        </h2>
        <p className="section-paragraph">
          <strong>Objetivo:</strong> Crear componentes visuales reutilizables (Button, Input, Card,
          Spinner).
        </p>
        <h3 className="subsection-title">10.1. <code>app/components/ui/Button.tsx</code></h3>
        <CodeBlock
          code={`"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 focus:ring-blue-500",
        secondary:
          "bg-white/10 text-white border border-white/20 hover:bg-white/20",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "text-white/80 hover:text-white hover:bg-white/10",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";`}
        />
<h3 className="subsection-title">
  10.2. <code>app/components/ui/Input.tsx</code>
</h3>

<CodeBlock
  code={`"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-white/80">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div
              className={cn(
                "absolute left-3 top-1/2 z-10 -translate-y-1/2",
                "text-white/50 pointer-events-none"
              )}
            >
              {icon}
            </div>
          )}

          <input
            type={
              isPassword
                ? showPassword
                  ? "text"
                  : "password"
                : type
            }
            className={cn(
              "w-full rounded-lg border border-white/20",
              "bg-white/10 px-4 py-2",
              "text-white placeholder-white/50",
              "focus:outline-none focus:ring-2 focus:ring-white/50",
              "transition",

              // Espacio para el icono izquierdo
              icon && "pl-10",

              // Espacio para el botón de contraseña
              isPassword && "pr-12",

              // Estado de error
              error &&
                "border-red-500 focus:ring-red-500",

              // Autofill del navegador
              "[&:-webkit-autofill]:[-webkit-text-fill-color:white]",
              "[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]",

              className
            )}
            ref={ref}
            {...props}
          />

{isPassword && (
  <button
    type="button"
    aria-label={
      showPassword
        ? "Ocultar contraseña"
        : "Mostrar contraseña"
    }
    className="absolute right-3 top-1/2 z-20 -translate-y-1/2
               border-0 bg-transparent p-0
               text-white/60
               hover:bg-transparent hover:text-white
               focus:bg-transparent focus:outline-none
               focus:ring-0"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? (
      <EyeOff size={18} />
    ) : (
      <Eye size={18} />
    )}
  </button>
)}
        </div>

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";`}
 />
        <h3 className="subsection-title">10.3. <code>app/components/ui/Card.tsx</code></h3>
        <CodeBlock
          code={`"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          glass
            ? "bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl"
            : "bg-gray-800 shadow-lg",
          "rounded-2xl p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";`}
        />
        <h3 className="subsection-title">10.4. <code>app/components/ui/Spinner.tsx</code></h3>
        <CodeBlock
          code={`"use client";

import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent border-solid border-blue-500",
        sizeMap[size],
        className
      )}
      {...props}
    />
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          ETAPA 11: Dashboard, Perfil, API Routes y Seed
        </h2>
        <p className="section-paragraph">
          <strong>Objetivo:</strong> Crear el dashboard protegido, la página de perfil (corregida como
          Server Component), las rutas API para verificación y restablecimiento, y el script de seed.
        </p>
        <h3 className="subsection-title">11.1. <code>app/(dashboard)/layout.tsx</code></h3>
        <CodeBlock
          code={`export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
}`}
        />
        <h3 className="subsection-title">11.2. <code>app/(dashboard)/dashboard/page.tsx</code></h3>
        <CodeBlock
          code={`"use client";

import { useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/Button";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logoutAction();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="danger" onClick={handleLogout} loading={loading}>
          Cerrar sesión
        </Button>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <p className="text-lg">¡Bienvenido a tu panel de control!</p>
        <p className="text-gray-400 mt-2">Esta es una página protegida.</p>
      </div>
    </>
  );
}`}
        />
        <h3 className="subsection-title">11.3. <code>app/(dashboard)/profile/page.tsx</code></h3>
        <p className="section-paragraph">
          <strong>CORREGIDO – Server Component</strong> (sin <code>&apos;use client&apos;</code>)
        </p>
        <CodeBlock
          code={`import { getSession, getUserById } from "@/lib/auth";
import { User } from "@/types";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await getUserById(session.userId) as User;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm">Nombre</label>
          <p className="text-lg">{user?.name || "Sin nombre"}</p>
        </div>
        <div>
          <label className="text-gray-400 text-sm">Correo electrónico</label>
          <p className="text-lg">{user?.email}</p>
        </div>
        <div>
          <label className="text-gray-400 text-sm">Rol</label>
          <p className="text-lg capitalize">{user?.role || "usuario"}</p>
        </div>
        <div>
          <label className="text-gray-400 text-sm">Miembro desde</label>
          <p className="text-lg">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("es-ES")
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}`}
        />
        <h3 className="subsection-title">11.4. <code>app/api/auth/verify-email/route.ts</code></h3>
        <CodeBlock
          code={`import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.verificationToken, token))
    .get();

  if (!user) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }

  await db
    .update(users)
    .set({
      emailVerified: true,
      verificationToken: null,
    })
    .where(eq(users.id, user.id));

  return NextResponse.redirect(new URL("/login?verified=true", request.url));
}`}
        />
        <h3 className="subsection-title">11.5. <code>app/api/auth/reset-password/route.ts</code></h3>
        <CodeBlock
          code={`import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const { token, password } = await request.json();

  const user = await db
    .select()
    .from(users)
    .where(eq(users.resetToken, token))
    .get();

  if (!user) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}`}
        />
        <h3 className="subsection-title">11.6. <code>types/index.ts</code></h3>
        <CodeBlock
          code={`export interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
}

export interface ActivityLog {
  id: number;
  userId: number | null;
  action: string;
  details: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
}`}
        />
        <h3 className="subsection-title">11.7. <code>scripts/seed.ts</code></h3>
        <CodeBlock
          code={`import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { hashPassword } from "../lib/password";

async function seed() {
  try {
    const hashedPassword = await hashPassword("Password123!");
    await db.insert(users).values({
      email: "admin@example.com",
      passwordHash: hashedPassword,
      name: "Administrador",
      role: "admin",
      emailVerified: true,
    });
    console.log("✅ Usuario administrador creado");

    const hashedPassword2 = await hashPassword("User123!");
    await db.insert(users).values({
      email: "user@example.com",
      passwordHash: hashedPassword2,
      name: "Usuario Normal",
      role: "user",
      emailVerified: true,
    });
    console.log("✅ Usuario normal creado");
  } catch (error) {
    console.error("❌ Error en seed:", error);
  }
  process.exit(0);
}

seed();`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🚀</span>
          ETAPA 12: Ejecución final y verificación
        </h2>
        <p className="section-paragraph">
          <strong>Objetivo:</strong> Ejecutar las migraciones, seed y lanzar el servidor de desarrollo.
        </p>
        <p className="section-paragraph">Comandos PowerShell:</p>
        <CommandBlock command="npm run db:generate" />
        <CommandBlock command="npm run db:push" />
        <CommandBlock command="npm run seed" />
        <CommandBlock command="npm run dev" />
        <p className="section-paragraph">
          Abre <code>http://localhost:3000</code> en tu navegador. Deberías ser redirigido a{' '}
          <code>/login</code>.
        </p>
        <p className="section-paragraph">
          <strong>Prueba las credenciales del seed:</strong>
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>
            <code>admin@example.com</code> / <code>Password123!</code>
          </li>
          <li>
            <code>user@example.com</code> / <code>User123!</code>
          </li>
        </ul>
        <p className="section-paragraph">
          <strong>Prueba el registro:</strong>
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>Crea una cuenta nueva con un email válido.</li>
          <li>
            Recibirás un correo de verificación (si no configuraste Resend, verás los logs en la
            consola).
          </li>
          <li>Haz clic en el enlace de verificación y luego inicia sesión.</li>
        </ul>
        <p className="section-paragraph">
          <strong>Prueba el olvido de contraseña:</strong>
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>Ve a <code>/forgot-password</code> e ingresa tu email.</li>
          <li>Recibirás un correo con el enlace para restablecer.</li>
          <li>Sigue el enlace y cambia la contraseña.</li>
        </ul>
        <div className="tip">
          <span className="tip-icon">✅</span>
          <span>
            Con esto, el sistema de autenticación está completo y listo para producción.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          Resolución de posibles errores
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300 border border-gray-700 rounded-lg">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-3 border-b border-gray-700">Error</th>
                <th className="p-3 border-b border-gray-700">Solución</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="p-3"><code>URL_INVALID</code> en seed</td>
                <td className="p-3">Verifica que <code>.env.local</code> tenga <code>TURSO_DATABASE_URL</code> y <code>TURSO_AUTH_TOKEN</code> correctos.</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-3">Tailwind CSS error</td>
                <td className="p-3">Instala <code>@tailwindcss/postcss</code> y actualiza <code>postcss.config.mjs</code>.</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-3"><code>next/headers</code> no disponible en cliente</td>
                <td className="p-3">Convierte <code>profile/page.tsx</code> a Server Component (sin <code>&apos;use client&apos;</code>).</td>
              </tr>
              <tr>
                <td className="p-3">Middleware deprecated</td>
                <td className="p-3">Ejecuta <code>npx @next/codemod@canary middleware-to-proxy .</code> para migrar a <code>proxy</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎯</span>
          Conclusión
        </h2>
        <p className="section-paragraph">
          Has completado la implementación de un sistema de autenticación <strong>profesional y completo</strong> con:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>Registro e inicio de sesión con validación robusta.</li>
          <li>Verificación de correo electrónico.</li>
          <li>Recuperación de contraseña.</li>
          <li>Protección de rutas con middleware.</li>
          <li>Sesiones seguras con cookies HTTP-only.</li>
          <li>Logs de actividad.</li>
          <li>Rate limiting.</li>
          <li>Envío de correos con Resend y plantillas HTML.</li>
          <li>Diseño moderno con Tailwind CSS y efectos glass.</li>
        </ul>
        <p className="section-paragraph text-xl font-bold text-center text-blue-400 mt-6">
          ¡Ahora tienes una base sólida para construir cualquier aplicación web! 🚀
        </p>
      </section>
    </>
  );
}