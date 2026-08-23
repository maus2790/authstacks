import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Configuración de autenticación con Google en Better Auth
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          1. Variables de entorno para Google
        </h2>
        <p className="section-paragraph">
          Añade las siguientes variables a tu <code>.env.local</code>:
        </p>
        <CodeBlock
          code={`# Google OAuth
GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret"`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          2. Configuración en Google Cloud
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a>.</li>
          <li>Crea un proyecto o selecciona uno existente.</li>
          <li>Ve a <strong>APIs y Servicios → Credenciales</strong>.</li>
          <li>Crea un <strong>ID de cliente OAuth</strong> de tipo "Aplicación web".</li>
          <li>
            En <strong>Orígenes autorizados de JavaScript</strong>, añade tu URL de desarrollo y producción:
            <CodeBlock code={`http://localhost:3000\nhttps://tu-dominio.com`} />
          </li>
          <li>
            En <strong>URIs de redireccionamiento autorizados</strong>, añade la URL de callback de Better Auth:
            <CodeBlock code={`http://localhost:3000/api/auth/callback/google\nhttps://tu-dominio.com/api/auth/callback/google`} />
          </li>
          <li>Copia el <strong>ID de cliente</strong> y <strong>Secreto de cliente</strong>.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            La URL de callback de Better Auth para Google es <code>/api/auth/callback/google</code>.
            Asegúrate de que coincida con la configuración en <code>lib/auth/index.ts</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          3. API Route de Callback
        </h2>
        <p className="section-paragraph">
          Crea <code>app/api/auth/callback/google/route.ts</code> para manejar el callback de Google:
        </p>
        <CodeBlock
          code={`import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      return new Response("Missing code or state", { status: 400 });
    }

    const session = await auth.api.callbackSocial({
      body: {
        provider: "google",
        code,
        state,
        redirectUri: \`\${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google\`,
      },
    });

    // Mejor usar una redirección a través de una cookie
    return new Response(null, {
      status: 302,
      headers: {
        Location: \`\${process.env.NEXT_PUBLIC_APP_URL}/dashboard\`,
        "Set-Cookie": \`better-auth-session=\${session.token}; HttpOnly; Path=/; Max-Age=604800\`,
      },
    });
  } catch (error) {
    console.error("Error en callback de Google:", error);
    return new Response("Error de autenticación", { status: 500 });
  }
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          4. Botón de Google en el frontend
        </h2>
        <p className="section-paragraph">
          Añade un botón en tu página de login que redirija al endpoint de autenticación de Google:
        </p>
        <CodeBlock
          code={`"use client";
import { Button } from "@/components/ui/Button";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
    window.location.href = \`\${baseUrl}/api/auth/google\`;
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-2"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continuar con Google
    </Button>
  );
}`}
        />
        <p className="section-paragraph">
          También necesitas crear <code>app/api/auth/google/route.ts</code> que redirija al endpoint de Better Auth:
        </p>
        <CodeBlock
          code={`import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const redirectUri = \`\${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google\`;

  const authUrl = await auth.api.authorizeSocial({
    body: {
      provider: "google",
      redirectUri,
      state: url.searchParams.get("state") || undefined,
    },
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.url,
    },
  });
}`}
        />
      </section>
    </>
  );
}