import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Frontend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Componentes UI y Páginas</h1>
        <p className="content-subtitle">
          Formularios de autenticación, layouts y componentes reutilizables
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          1. Componentes UI (shadcn/ui)
        </h2>
        <p className="section-paragraph">
          Asegúrate de tener los componentes básicos de shadcn/ui: <code>button.tsx</code>,{' '}
          <code>input.tsx</code>, <code>form.tsx</code>, <code>label.tsx</code>, <code>card.tsx</code>, etc.
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
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      // 1. Iniciar sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Intercambiar token por cookie de sesión
      const response = await fetch("/api/auth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear sesión");
      }

      toast.success("Inicio de sesión exitoso");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      let errorMessage = error.message;
      if (errorMessage.includes("user-not-found") || errorMessage.includes("wrong-password")) {
        errorMessage = "Credenciales incorrectas. Verifica tu correo y contraseña.";
      } else if (errorMessage.includes("too-many-requests")) {
        errorMessage = "Demasiados intentos. Intenta más tarde.";
      }
      setError("root", { message: errorMessage });
      toast.error(errorMessage);
    } finally {
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

        <h3 className="subsection-title">Página de Registro (<code>app/(auth)/register/page.tsx</code>)</h3>
        <CodeBlock
          code={`"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.name });

      // 2. Obtener token y crear sesión
      const idToken = await userCredential.user.getIdToken();
      const response = await fetch("/api/auth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear sesión");
      }

      toast.success("¡Registro exitoso! Bienvenido.");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      let errorMessage = error.message;
      if (errorMessage.includes("email-already-in-use")) {
        errorMessage = "Este correo ya está registrado.";
      } else if (errorMessage.includes("weak-password")) {
        errorMessage = "La contraseña debe tener al menos 6 caracteres.";
      }
      setError("root", { message: errorMessage });
      toast.error(errorMessage);
    } finally {
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
        <div>
          <Label className="text-white/80">Nombre completo</Label>
          <Input type="text" placeholder="Tu nombre" {...register("name")} className="bg-white/10 border-white/20 text-white placeholder-white/50" />
          {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <Label className="text-white/80">Correo electrónico</Label>
          <Input type="email" placeholder="tu@email.com" {...register("email")} className="bg-white/10 border-white/20 text-white placeholder-white/50" />
          {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <Label className="text-white/80">Contraseña</Label>
          <Input type="password" placeholder="••••••••" {...register("password")} className="bg-white/10 border-white/20 text-white placeholder-white/50" />
          {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
        </div>
        <div>
          <Label className="text-white/80">Confirmar contraseña</Label>
          <Input type="password" placeholder="••••••••" {...register("confirmPassword")} className="bg-white/10 border-white/20 text-white placeholder-white/50" />
          {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>}
        </div>
        {errors.root && <p className="text-sm text-red-400">{errors.root.message}</p>}
        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600">
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </form>

      <p className="text-center text-white/60 text-sm mt-6">
        ¿Ya tienes cuenta? <Link href="/login" className="text-cyan-300 hover:underline">Inicia sesión aquí</Link>
      </p>
    </div>
  );
}`}
        />
      </section>
    </>
  );
}