import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Frontend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Componentes UI y Páginas</h1>
        <p className="content-subtitle">
          Formularios de autenticación y componentes reutilizables
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          1. Componentes UI (shadcn/ui)
        </h2>
        <p className="section-paragraph">
          Asegúrate de tener los componentes básicos de shadcn/ui: <code>Button.tsx</code>, <code>Input.tsx</code>, <code>Card.tsx</code>, etc.
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          2. Páginas de autenticación
        </h2>

        <h3 className="subsection-title">Layout de autenticación (<code>app/(auth)/layout.tsx</code>)</h3>
        <CodeBlock
          code={`export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
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
import { loginAction } from "@/actions/auth/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Contraseña debe tener al menos 6 caracteres"),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
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
    <div className="glass p-8 rounded-2xl w-full max-w-md">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Iniciar sesión</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />
        {errors.root && <p className="text-red-400 text-sm">{errors.root.message}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Ingresar
        </Button>
      </form>
      <div className="mt-6 text-center">
        <Link href="/forgot-password" className="text-white/60 hover:text-white">¿Olvidaste tu contraseña?</Link>
        <p className="text-white/60 mt-2">
          ¿No tienes cuenta? <Link href="/register" className="text-cyan-300 hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}`}
        />
      </section>
    </>
  );
}