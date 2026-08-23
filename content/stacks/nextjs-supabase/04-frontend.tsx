import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Frontend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Componentes UI y Páginas</h1>
        <p className="content-subtitle">
          Componentes reutilizables, layouts y formularios de autenticación
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          1. Componentes UI (shadcn/ui)
        </h2>
        <p className="section-paragraph">
          Asegúrate de tener los siguientes componentes en <code>components/ui/</code>:
          <code>button.tsx</code>, <code>input.tsx</code>, <code>form.tsx</code>, <code>label.tsx</code>,
          <code>avatar.tsx</code>, <code>badge.tsx</code>, <code>card.tsx</code>, <code>dialog.tsx</code>,
          <code>skeleton.tsx</code>.
        </p>
        <p className="section-paragraph">
          Modifica <code>components/ui/input.tsx</code> para soportar visibilidad de contraseña:
        </p>
        <CodeBlock
          code={`import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputType = type === "password" && showPassword ? "text" : type

    return (
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            "flex h-10 bg-background w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-purple-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            type === "password" ? "pr-10" : "",
            className
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"
export { Input }`}
        />
        <p className="section-paragraph">
          También necesitas crear <code>components/ui/form.tsx</code> (proporcionado por shadcn/ui) y
          asegurarte de que los componentes estén importados correctamente.
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          2. Páginas de autenticación
        </h2>

        <h3 className="subsection-title">Layout de autenticación (<code>app/(auth)/layout.tsx</code>)</h3>
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

        <h3 className="subsection-title">Página de Login (<code>app/(auth)/login/page.tsx</code>)</h3>
        <CodeBlock
          code={`"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { login } from "@/actions/auth/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    const result = await login(data);
    if (result.success) {
      window.location.reload();
    } else {
      let errorMessage = result.message;
      if (errorMessage?.includes("Invalid login credentials")) {
        errorMessage = "Credenciales incorrectas. Verifica tu correo y contraseña.";
      } else if (errorMessage?.includes("Email not confirmed")) {
        errorMessage = "Debes confirmar tu correo electrónico. Revisa tu bandeja.";
      }
      setError("root", { message: errorMessage });
      toast.error(errorMessage);
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
        <div>
          <Label className="text-white/80">Correo electrónico</Label>
          <Input
            type="email"
            placeholder="tu@email.com"
            icon={<Mail size={18} />}
            {...register("email")}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
          />
          {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <Label className="text-white/80">Contraseña</Label>
          <Input
            type="password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            {...register("password")}
            className="bg-white/10 border-white/20 text-white placeholder-white/50"
          />
          {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
        </div>

        {errors.root && <p className="text-sm text-red-400">{errors.root.message}</p>}

        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600">
          {loading ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <Link href="/forgot-password" className="text-sm text-white/60 hover:text-white transition">
          ¿Olvidaste tu contraseña?
        </Link>
        <p className="text-white/60 text-sm">
          ¿No tienes cuenta? <Link href="/register" className="text-cyan-300 hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}`}
        />

        <p className="section-paragraph">
          Las páginas de registro, recuperación y restablecimiento de contraseña son similares y se
          pueden ver en el código completo del proyecto.
        </p>
      </section>
    </>
  );
}