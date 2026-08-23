import { CodeBlock } from "@/components/ui/CodeBlock";

export default function Frontend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Componentes UI, Layouts y Páginas</h1>
        <p className="content-subtitle">
          Componentes reutilizables, layouts de autenticación y páginas de login/registro/recuperación
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          ETAPA 8: Middleware y archivos raíz
        </h2>
        <p className="section-paragraph">
          <strong>Objetivo:</strong> Proteger rutas del dashboard, redirigir a login si no hay sesión.
        </p>
        <h3 className="subsection-title">8.1. <code>middleware.ts</code></h3>
        <CodeBlock
          code={`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
const protectedPaths = ["/dashboard", "/profile"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublic = publicPaths.some((p) => path.startsWith(p));
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  const session = await getSession();

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
          <span className="tip-icon">⚠️</span>
          <span>
            El middleware está obsoleto en Next.js 16.3. Para migrar a proxy, ejecuta:{' '}
            <code>npx @next/codemod@canary middleware-to-proxy .</code>
          </span>
        </div>
        <h3 className="subsection-title">8.2. <code>app/layout.tsx</code></h3>
        <CodeBlock
          code={`import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi App Premium",
  description: "Sistema de autenticación completo con Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}`}
        />
        <h3 className="subsection-title">8.3. <code>app/page.tsx</code></h3>
        <CodeBlock
          code={`import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}`}
        />
        <h3 className="subsection-title">8.4. <code>app/globals.css</code></h3>
        <CodeBlock
          code={`@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply antialiased;
  }
}

@layer components {
  .glass {
    @apply bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl;
  }
  .input-glass {
    @apply w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition;
  }
  .btn-gradient {
    @apply w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50;
  }
}`}
        />
        <h3 className="subsection-title">8.5. <code>.gitignore</code></h3>
        <CodeBlock
          code={`# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# drizzle
/drizzle`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          ETAPA 9: Layouts y páginas principales de autenticación
        </h2>
        <h3 className="subsection-title">9.1. <code>app/(auth)/layout.tsx</code></h3>
        <CodeBlock
          code={`export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10"></div>
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      {children}
    </div>
  );
}`}
        />
        <h3 className="subsection-title">9.2. <code>app/(auth)/login/page.tsx</code></h3>
        <CodeBlock
          code={`"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Mail, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await loginAction(formData);
    if (result?.error) {
      setError("root", { message: result.error });
      toast.error(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-2xl w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Bienvenido</h1>
        <p className="text-white/60 mt-2">Inicia sesión para continuar</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          icon={<Mail size={18} />}
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          {...register("password")}
          error={errors.password?.message}
        />

        {errors.root && (
          <p className="text-sm text-red-400">{errors.root.message}</p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Iniciar sesión
        </Button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <Link
          href="/forgot-password"
          className="text-sm text-white/60 hover:text-white transition"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <p className="text-white/60 text-sm">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-cyan-300 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}`}
        />
        <h3 className="subsection-title">9.3. <code>app/(auth)/register/page.tsx</code></h3>
        <CodeBlock
          code={`"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Mail, Lock, User } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, "Debes aceptar los términos"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("terms", data.terms ? "on" : "off");

    const result = await registerAction(formData);
    if (result?.error) {
      setError("root", { message: result.error });
      toast.error(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-2xl w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Crear cuenta</h1>
        <p className="text-white/60 mt-2">Regístrate para comenzar</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre completo"
          type="text"
          placeholder="Tu nombre"
          icon={<User size={18} />}
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          icon={<Mail size={18} />}
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          {...register("password")}
          error={errors.password?.message}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            {...register("terms")}
            className="rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-500"
          />
          <label htmlFor="terms" className="text-sm text-white/80">
            Acepto los{" "}
            <Link href="/terms" className="text-cyan-300 hover:underline">
              términos y condiciones
            </Link>
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-400">{errors.terms.message}</p>
        )}

        {errors.root && (
          <p className="text-sm text-red-400">{errors.root.message}</p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Registrarse
        </Button>
      </form>

      <p className="text-center text-white/60 text-sm mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-cyan-300 hover:underline">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}`}
        />
        <h3 className="subsection-title">9.4. <code>app/(auth)/forgot-password/page.tsx</code></h3>
        <CodeBlock
          code={`"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { forgotPasswordAction } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Mail } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("Correo inválido"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);

    const result = await forgotPasswordAction(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      setSent(true);
      toast.success("Te enviamos un enlace para restablecer tu contraseña");
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="glass p-8 rounded-2xl w-full max-w-md relative z-10 text-center">
        <div className="text-green-400 text-5xl mb-4">📧</div>
        <h2 className="text-2xl font-bold text-white mb-2">Revisa tu correo</h2>
        <p className="text-white/60">
          Te hemos enviado un enlace para restablecer tu contraseña.
        </p>
        <Link
          href="/login"
          className="text-cyan-300 hover:underline mt-4 inline-block"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="glass p-8 rounded-2xl w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Recuperar contraseña</h1>
        <p className="text-white/60 mt-2">
          Ingresa tu correo y te enviaremos un enlace
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          icon={<Mail size={18} />}
          {...register("email")}
          error={errors.email?.message}
        />

        <Button type="submit" loading={loading} className="w-full">
          Enviar enlace
        </Button>
      </form>

      <p className="text-center text-white/60 text-sm mt-6">
        <Link href="/login" className="text-cyan-300 hover:underline">
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}`}
        />
        <h3 className="subsection-title">9.5. <code>app/(auth)/reset-password/[token]/page.tsx</code></h3>
        <CodeBlock
          code={`"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { resetPasswordAction } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Lock } from "lucide-react";

const resetSchema = z
  .object({
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token as string;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    const result = await resetPasswordAction(token, formData);
    if (result?.error) {
      setError("root", { message: result.error });
      toast.error(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-2xl w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Nueva contraseña</h1>
        <p className="text-white/60 mt-2">Ingresa tu nueva contraseña</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Nueva contraseña"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          {...register("password")}
          error={errors.password?.message}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {errors.root && (
          <p className="text-sm text-red-400">{errors.root.message}</p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          Restablecer contraseña
        </Button>
      </form>

      <p className="text-center text-white/60 text-sm mt-6">
        <Link href="/login" className="text-cyan-300 hover:underline">
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}`}
        />
      </section>
    </>
  );
}