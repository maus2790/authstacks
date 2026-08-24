"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";
import { X, ChevronDown, ChevronUp, Info } from "lucide-react";

export default function GoogleLogin() {
  // Estado para el acordeón del PASO 3 (credenciales) - expandido por defecto
  const [isStep3Open, setIsStep3Open] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Añade autenticación con Google a tu sistema existente de sesiones con cookies,
          manteniendo tu lógica de email/contraseña intacta.
        </p>
      </header>

      {/* ==================== PASO 1 ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          PASO 1: Instalar dependencias
        </h2>
        <p className="section-paragraph">Ejecuta en PowerShell:</p>
        <CommandBlock command="npm install @react-oauth/google" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong> <br />
            • <code>@react-oauth/google</code>: Cliente React para el flujo de OAuth con Google.
            <br />
            • No necesitamos <code>google-auth-library</code> en el servidor porque usamos el
            enfoque de obtener la información del usuario desde la API de Google y enviarla al
            servidor.
          </span>
        </div>
      </section>

      {/* ==================== PASO 2: COMANDOS CON TABS ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛠️</span>
          PASO 2: Crear archivos y carpetas
        </h2>

        <p className="section-paragraph">
          Crea los archivos y carpetas necesarios para la implementación del login con Google.
          Selecciona tu sistema operativo:
        </p>

        <OsCommandTabs
          windowsCode={`# Crear carpetas necesarias
New-Item -ItemType Directory -Path "app/api/auth/google" -Force

# Crear archivos
New-Item -ItemType File -Path "app/api/auth/google/route.ts" -Force
New-Item -ItemType File -Path "app/components/auth/GoogleLoginButton.tsx" -Force

Write-Host "✅ Archivos creados exitosamente!" -ForegroundColor Green`}
          linuxCode={`# Crear carpetas necesarias
mkdir -p app/api/auth/google

# Crear archivos
touch app/api/auth/google/route.ts
touch app/components/auth/GoogleLoginButton.tsx

echo "✅ Archivos creados exitosamente!"`}
        />

        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Estos comandos asumen que estás en la raíz de tu proyecto. Ajusta las rutas según
            la estructura de tu aplicación.
          </span>
        </div>
      </section>

      {/* ==================== PASO 3 (CREDENCIALES - COLAPSABLE) ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          PASO 3: Obtener credenciales de Google
          <button
            onClick={() => setIsStep3Open(!isStep3Open)}
            className="ml-3 text-blue-400 hover:text-blue-300 transition-colors"
            aria-label={isStep3Open ? "Ocultar guía" : "Mostrar guía"}
          >
            {isStep3Open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </h2>

        <p className="section-paragraph">
          Para obtener el <strong>Client ID</strong> y el <strong>Client Secret</strong>, necesitas
          crear un proyecto en Google Cloud Console y habilitar la API de OAuth 2.0.{' '}
          <span
            className="underline cursor-pointer text-blue-400 hover:text-blue-300 transition-colors"
            onClick={() => setIsStep3Open(!isStep3Open)}
          >
            {isStep3Open ? "Ocultar pasos" : "Sigue los pasos a continuación"}
          </span>
        </p>

        {isStep3Open && (
          <div className="space-y-6">
            <ol className="list-decimal pl-6 text-gray-300 space-y-6">
              <li>
                <p><strong>Paso 1: Crear proyecto en Google Cloud Platform</strong></p>
                <p>
                  Accede a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a> y crea un nuevo proyecto.
                </p>
                <img
                  src="/images/google/img9.png"
                  alt="Crear proyecto en Google Cloud"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
              </li>
              <li>
                <p><strong>Paso 2: Acceder a APIs y Servicios</strong></p>
                <p>
                  En el menú lateral, selecciona <strong>"APIs y Servicios"</strong> y luego <strong>"Pantalla de consentimiento de OAuth"</strong>.
                </p>
                <img
                  src="/images/google/img10.png"
                  alt="APIs y Servicios en Google Cloud"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
              </li>
              <li>
                <p><strong>Paso 3: Configurar la pantalla de consentimiento</strong></p>
                <p>Completa los siguientes campos:</p>
                <ul className="list-disc pl-6 text-gray-300 space-y-1">
                  <li>
                    <strong>Nombre de la aplicación:</strong> Ingresa el nombre de tu aplicación (ej. "TasksApp").
                  </li>
                  <li>
                    <strong>Correo electrónico de asistencia:</strong> Ingresa tu correo electrónico para que los usuarios puedan contactarte.
                  </li>
                  <li>
                    <strong>Usuarios externos:</strong> Selecciona <strong>"Externo"</strong> (para permitir que cualquier usuario con cuenta de Google pueda iniciar sesión).
                  </li>
                  <li>
                    <strong>Correo electrónico de contacto:</strong> Ingresa tu correo para recibir novedades sobre tu proyecto.
                  </li>
                </ul>
                <p>Haz clic en <strong>"Guardar y continuar"</strong> y avanza hasta completar la configuración.</p>
                <img
                  src="/images/google/img11.png"
                  alt="Pantalla de consentimiento OAuth"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
                <div className="tip" style={{ borderLeftColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', marginTop: '1rem' }}>
                  <span className="tip-icon">✅</span>
                  <span>Después de completar estos pasos, haz clic en <strong>"Guardar y continuar"</strong> hasta finalizar la configuración.</span>
                </div>
              </li>
              <li>
                <p><strong>Paso 4: Crear credenciales de OAuth</strong></p>
                <p>
                  Ve a <strong>"Credenciales"</strong> y haz clic en <strong>"Crear credenciales"</strong> → <strong>"ID de cliente OAuth"</strong>.
                  Selecciona <strong>"Aplicación web"</strong> como tipo.
                </p>

                {/* 🌐 Configuración de orígenes y URIs */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5 my-4">
                  <h5 className="font-semibold text-blue-300 mb-3">
                    🌐 Configuración de orígenes y URIs de redireccionamiento
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-foreground font-medium">Para desarrollo local:</p>
                      <ul className="list-disc pl-6 text-muted-foreground mt-1">
                        <li>
                          <strong>Orígenes autorizados de JavaScript:</strong>{' '}
                          <code>http://localhost:3000</code>
                        </li>
                        <li>
                          <strong>URIs de redireccionamiento autorizados:</strong>{' '}
                          <code>http://localhost:3000/api/auth/callback/google</code>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Para producción (Vercel):</p>
                      <ul className="list-disc pl-6 text-muted-foreground mt-1">
                        <li>
                          <strong>Orígenes autorizados de JavaScript:</strong>{' '}
                          <code>https://&lt;tu-proyecto&gt;.vercel.app</code>
                        </li>
                        <li>
                          <strong>URIs de redireccionamiento autorizados:</strong>{' '}
                          <code>https://&lt;tu-proyecto&gt;.vercel.app/api/auth/callback/google</code>
                        </li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ejemplo: <code>https://next-drizzle-turso.vercel.app</code> y su correspondiente callback.
                      </p>
                    </div>
                    <div className="tip" style={{ borderLeftColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                      <span className="tip-icon">⚠️</span>
                      <span>
                        Si despliegas en <strong>Vercel</strong>, el dominio gratuito será similar a{' '}
                        <code>https://&lt;tu-proyecto&gt;.vercel.app</code>. Asegúrate de usar
                        <strong>https</strong> (no http) en producción.
                      </span>
                    </div>
                  </div>
                </div>

                <p>
                  Copia el <strong>ID de cliente</strong> y el <strong>Secreto de cliente</strong>.
                  Los usarás en el siguiente paso.
                </p>
                <img
                  src="/images/google/img12.png"
                  alt="Orígenes autorizados y URIs de redireccionamiento"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
              </li>
            </ol>

            <div className="tip">
              <span className="tip-icon">💡</span>
              <span>
                La URI de redireccionamiento es necesaria para que Google sepa a dónde enviar al usuario
                después de autenticarse. Asegúrate de que coincida con la ruta de tu aplicación.
              </span>
            </div>

            {/* ⭐ Enlace al modal al final del PASO 3 */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <span
                className="text-blue-400 underline cursor-pointer hover:text-blue-300 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                <Info size={16} className="inline mr-1" />
                Más información de la plataforma
              </span>
              <span className="text-gray-500 text-sm">(cuotas, precios y limitaciones)</span>
            </div>
          </div>
        )}
      </section>

      {/* ==================== PASO 4 ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          PASO 4: Variables de entorno (<code>.env</code>)
        </h2>
        <p className="section-paragraph">
          Añade al final de tu <code>.env</code> las siguientes variables:
        </p>
        <CodeBlock
          code={`# Google OAuth
GOOGLE_CLIENT_ID="<tu-client-id>.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="<tu-client-secret>"`}
        />

        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            El <strong>Client ID</strong> se expone en el frontend (es público), pero el{' '}
            <strong>Client Secret</strong> solo se usa en el servidor. Nunca lo expongas en el cliente.
            Asegúrate de tener el archivo <code>.env</code> en tu <code>.gitignore</code>.
          </span>
        </div>
      </section>

      {/* ==================== PASO 5 ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          PASO 5: Endpoint API para recibir los datos del usuario de Google
        </h2>
        <p className="section-paragraph">
          Crea el archivo <code>app/api/auth/google/route.ts</code>:
        </p>
        <CodeBlock
          code={`import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, name, picture } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email no proporcionado" },
        { status: 400 }
      );
    }

    // Buscar usuario existente por email
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    // Si no existe, crearlo
    if (!user) {
      // Generamos una contraseña aleatoria (no se usará para login con email)
      const randomPassword = Math.random().toString(36).slice(-16);
      const { hashPassword } = await import("@/lib/password");
      const hashedPassword = await hashPassword(randomPassword);

      const newUser = await db
        .insert(users)
        .values({
          email,
          name: name || email.split("@")[0],
          passwordHash: hashedPassword,
          emailVerified: true, // Google ya verifica el email
          role: "user",
        })
        .returning()
        .get();
      user = newUser;
    }

    // Crear sesión (igual que con login normal)
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const ip = headersList.get("x-forwarded-for") || "unknown";

    await createSession(user.id, userAgent, ip);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en login con Google:", error);
    return NextResponse.json(
      { error: "Error al autenticar con Google" },
      { status: 500 }
    );
  }
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Este endpoint recibe directamente <code>email</code>, <code>name</code> y{' '}
            <code>picture</code> desde el cliente. No verifica el token en el servidor, sino que
            confía en la información obtenida desde la API de Google en el frontend.
            <br />
            <strong>Ventaja:</strong> Más simple y evita la necesidad de <code>google-auth-library</code>.
            <br />
            <strong>Seguridad:</strong> El token de acceso nunca se envía al servidor, solo la
            información del usuario.
          </span>
        </div>
      </section>

      {/* ==================== PASO 6 ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          PASO 6: Componente botón de Google
        </h2>
        <p className="section-paragraph">
          Crea <code>app/components/auth/GoogleLoginButton.tsx</code>:
        </p>
        <CodeBlock
          code={`"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/app/components/ui/Button";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // 1. Obtener la información del usuario con el access_token
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: \`Bearer \${tokenResponse.access_token}\`,
            },
          }
        );
        
        if (!userInfoResponse.ok) {
          throw new Error("No se pudo obtener la información del usuario");
        }
        
        const userInfo = await userInfoResponse.json();
        
        // 2. Enviar los datos al servidor para crear la sesión
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al autenticar");
        }

        toast.success("Inicio de sesión exitoso");
        router.push("/dashboard");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(error instanceof Error ? error.message : "Error al iniciar sesión con Google");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Error al iniciar sesión con Google");
    },
  });

  return (
    <Button
      variant="secondary"
      onClick={() => googleLogin()}
      loading={loading}
      className="w-full flex items-center justify-center gap-2 border border-white/20"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        className="flex-shrink-0"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Iniciar sesión con Google
    </Button>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            <strong>Flujo completo:</strong> <br />
            1. Usas <code>useGoogleLogin</code> para obtener <code>access_token</code>. <br />
            2. Con ese token, obtienes la información del usuario desde{' '}
            <code>https://www.googleapis.com/oauth2/v3/userinfo</code>. <br />
            3. Envías esa información al servidor (<code>/api/auth/google</code>). <br />
            4. El servidor crea o autentica al usuario y crea una sesión. <br />
            5. El cliente recibe éxito y redirige al dashboard.
          </span>
        </div>
      </section>

      {/* ==================== PASO 7 ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          PASO 7: Modificar la página de login
        </h2>
        <p className="section-paragraph">
          Primero, envuelve tu aplicación con <code>GoogleOAuthProvider</code> en{' '}
          <code>app/layout.tsx</code>:
        </p>
        <CodeBlock
          code={`import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
  const googleClientId = process.env.GOOGLE_CLIENT_ID || "";

  return (
    <html lang="es">
      <body>
        <GoogleOAuthProvider clientId={googleClientId}>
          {children}
          <Toaster position="top-right" />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}`}
        />
        <p className="section-paragraph">Luego, modifica <code>app/(auth)/login/page.tsx</code> para incluir el botón:</p>
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
import GoogleLoginButton from "@/app/components/auth/GoogleLoginButton";

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

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/5 text-white/50">O continúa con</span>
          </div>
        </div>
        <div className="mt-4">
          <GoogleLoginButton />
        </div>
      </div>

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
      </section>

      {/* ==================== PASO 8 ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🗄️</span>
          PASO 8: Ajustar el esquema de base de datos (OPCIONAL)
        </h2>
        <p className="section-paragraph">
          Para evitar duplicación de usuarios por email, ya usamos el email como único. No necesitamos
          añadir <code>googleId</code>. Pero si quieres, puedes añadirlo para futuros usos.
        </p>
        <p className="section-paragraph">
          Modifica <code>lib/db/schema.ts</code> añadiendo dentro de la tabla <code>users</code>:
        </p>
        <CodeBlock
          code={`googleId: text("google_id").unique(),`}
        />
        <p className="section-paragraph">Luego ejecuta una migración:</p>
        <CommandBlock command="npm run db:generate" />
        <CommandBlock command="npm run db:push" />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            <strong>Pero esto es opcional.</strong> El código actual no usa <code>googleId</code>, solo
            el email. Si quieres añadirlo, actualiza también el endpoint <code>route.ts</code> para
            guardar el <code>sub</code> de Google.
          </span>
        </div>
      </section>

      {/* ==================== PASO 9 ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          PASO 9: Archivos completos (lista)
        </h2>
        <p className="section-paragraph">
          Aquí tienes la lista de archivos que has creado o modificado:
        </p>
        <h3 className="subsection-title">Nuevos archivos:</h3>
        <ul className="list-disc pl-6 text-gray-300 space-y-1">
          <li><code>app/api/auth/google/route.ts</code></li>
          <li><code>app/components/auth/GoogleLoginButton.tsx</code></li>
        </ul>
        <h3 className="subsection-title">Archivos modificados:</h3>
        <ul className="list-disc pl-6 text-gray-300 space-y-1">
          <li><code>.env</code> (añadir <code>GOOGLE_CLIENT_ID</code> y <code>GOOGLE_CLIENT_SECRET</code>)</li>
          <li><code>app/layout.tsx</code> (envolver con <code>GoogleOAuthProvider</code>)</li>
          <li><code>app/(auth)/login/page.tsx</code> (añadir botón)</li>
          <li><code>package.json</code> (nuevas dependencias ya instaladas)</li>
        </ul>
        <h3 className="subsection-title">Archivos opcionales:</h3>
        <ul className="list-disc pl-6 text-gray-300 space-y-1">
          <li><code>lib/db/schema.ts</code> (si decides añadir <code>googleId</code>)</li>
        </ul>
      </section>

      {/* ==================== PASO 10 ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">✅</span>
          PASO 10: Verificación
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Asegúrate de tener las variables de entorno con el Client ID correcto.</li>
          <li>Ejecuta <code>npm run dev</code>.</li>
          <li>Ve a <code>/login</code>, deberías ver el botón "Iniciar sesión con Google".</li>
          <li>Haz clic en él, selecciona tu cuenta de Google.</li>
          <li>Serás redirigido al dashboard con tu sesión creada.</li>
        </ol>
        <p className="section-paragraph">
          Si el usuario no existe en la base de datos, se crea automáticamente con la información de Google.
        </p>
      </section>

      {/* ==================== SOLUCIÓN DE PROBLEMAS ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🚨</span>
          Solución de problemas comunes
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
                <td className="p-3"><code>"No se pudo obtener la información del usuario"</code></td>
                <td className="p-3">
                  Verifica que el token de acceso sea válido. Asegúrate de que el flujo de OAuth
                  esté configurado correctamente y que el usuario haya otorgado permisos.
                </td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="p-3"><code>"Email no proporcionado"</code></td>
                <td className="p-3">
                  Asegúrate de que la respuesta de la API de Google contenga el campo <code>email</code>.
                  Verifica que el usuario tenga un correo asociado a su cuenta de Google.
                </td>
              </tr>
              <tr>
                <td className="p-3">El usuario ya existe y tiene contraseña</td>
                <td className="p-3">
                  El código actual busca por email y si existe, inicia sesión sin modificar la
                  contraseña. Funciona bien.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================== CONCLUSIÓN ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎯</span>
          Conclusión
        </h2>
        <p className="section-paragraph">
          Has añadido login con Google a tu aplicación sin modificar la autenticación existente.
          Los usuarios pueden iniciar sesión con email/contraseña o con Google. Todo integrado con
          tu sistema de sesiones y cookies.
        </p>
        <div className="tip">
          <span className="tip-icon">✅</span>
          <span>
            <strong>Resumen de la solución:</strong> <br />
            1. Usas <code>useGoogleLogin</code> para obtener <code>access_token</code>. <br />
            2. Con ese token, obtienes la información del usuario desde{' '}
            <code>https://www.googleapis.com/oauth2/v3/userinfo</code>. <br />
            3. Envías esa información al servidor (<code>/api/auth/google</code>). <br />
            4. El servidor crea o autentica al usuario y crea una sesión. <br />
            5. El cliente recibe éxito y redirige al dashboard.
          </span>
        </div>
        <p className="section-paragraph text-xl font-bold text-center text-blue-400 mt-4">
          ¡Ahora tu aplicación es más versátil! 🚀
        </p>
      </section>

      {/* ===================== MODAL DE INFORMACIÓN DE GOOGLE ===================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-card rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl" onClick={(e) => e.stopPropagation()}>

            <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm p-4 border-b border-border flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Info size={24} className="text-blue-400" />
                Información de Google Cloud Platform
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
                aria-label="Cerrar modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-8">

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
                <div className="flex gap-3">
                  <Info className="text-blue-400 shrink-0 mt-0.5" size={22} />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">
                      Google Cloud Platform – OAuth 2.0
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Google Cloud Platform ofrece servicios de autenticación a través de OAuth 2.0.
                      El uso básico de la API de OAuth es gratuito, pero existen límites de cuotas
                      que pueden afectar a aplicaciones con alto volumen de solicitudes.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Cuotas y límites de la API de OAuth 2.0
                </h3>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[600px] text-sm text-left">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 border-b border-border">Recurso</th>
                        <th className="p-3 border-b border-border">Límite gratuito</th>
                        <th className="p-3 border-b border-border">Excedente</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 font-medium text-foreground">Solicitudes de token</td>
                        <td className="p-3">10,000 / día</td>
                        <td className="p-3">$0.05 / 1,000</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 font-medium text-foreground">Llamadas a API (userinfo)</td>
                        <td className="p-3">10,000 / día</td>
                        <td className="p-3">$0.05 / 1,000</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 font-medium text-foreground">Almacenamiento de credenciales</td>
                        <td className="p-3">Ilimitado</td>
                        <td className="p-3">Gratuito</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3 font-medium text-foreground">Usuarios únicos (autenticados)</td>
                        <td className="p-3">Ilimitado</td>
                        <td className="p-3">Gratuito</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Fuente: <a href="https://cloud.google.com/identity-platform/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Identity Platform Pricing</a> (Abril 2026)
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Alternativa: Google Cloud Identity Platform
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Si tu aplicación necesita autenticación avanzada (MFA, SSO, múltiples proveedores),
                  puedes usar Identity Platform. Sus planes son:
                </p>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[600px] text-sm text-left">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 border-b border-border">Plan</th>
                        <th className="p-3 border-b border-border">Precio/mes</th>
                        <th className="p-3 border-b border-border">Usuarios activos</th>
                        <th className="p-3 border-b border-border">Características</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 font-medium text-foreground">Gratuito</td>
                        <td className="p-3">$0</td>
                        <td className="p-3">Hasta 50,000 MAU</td>
                        <td className="p-3">OAuth, email/contraseña, SMS, MFA</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 font-medium text-foreground">Pro</td>
                        <td className="p-3">$0.0055 / MAU</td>
                        <td className="p-3">Ilimitado</td>
                        <td className="p-3">+ SSO, SAML, OIDC, soporte</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3 font-medium text-foreground">Enterprise</td>
                        <td className="p-3">Personalizado</td>
                        <td className="p-3">Ilimitado</td>
                        <td className="p-3">+ SLA, cumplimiento, soporte premium</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  MAU = Monthly Active Users (usuarios activos mensuales). El plan gratuito de OAuth 2.0 es suficiente para la mayoría de las aplicaciones en etapas iniciales.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Buenas prácticas para evitar superar las cuotas
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Almacenar en caché la información del usuario (ej. en sesión) para no llamar a la API de Google en cada solicitud.</li>
                  <li>• Usar tokens de acceso con expiración y renovación automática.</li>
                  <li>• Monitorizar el uso desde la consola de Google Cloud.</li>
                  <li>• Configurar alertas de consumo en la consola.</li>
                </ul>
              </div>

              <div className="border-t border-border pt-5">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    <strong className="text-foreground">Importante:</strong> Los precios y límites pueden cambiar. Consulta la documentación oficial de Google Cloud Platform para obtener la información más actualizada.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}