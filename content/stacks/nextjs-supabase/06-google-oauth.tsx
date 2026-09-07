import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Activa Google en Supabase y añade el botón
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">💡</span>
          1. Cómo funciona con Supabase
        </h2>
        <p className="section-paragraph">
          Supabase Auth soporta Google nativamente: activas el proveedor en el
          dashboard (Supabase te da las URIs de callback) y el login es una llamada
          a <code>signInWithOAuth</code>. El resto —crear el usuario, la sesión en
          cookies— lo maneja Supabase.
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          2. Activar Google en Supabase Dashboard
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Supabase Dashboard → <strong>Authentication → Providers → Google</strong>.</li>
          <li>
            Supabase te muestra la <strong>Callback URL</strong> (ej:{" "}
            <code>https://tu-proyecto.supabase.co/auth/v1/callback</code>) — la
            necesitas en el paso 3.
          </li>
          <li>Activa el proveedor.</li>
        </ol>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          3. Configurar Google Cloud (credenciales OAuth)
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a>.</li>
          <li>Ve a <strong>APIs y Servicios → Credenciales</strong> → crea un <strong>ID de cliente OAuth</strong> tipo "Aplicación web".</li>
          <li>
            En <strong>Orígenes autorizados de JavaScript</strong>, añade:{" "}
            <code>https://tu-proyecto.supabase.co</code> y{" "}
            <code>http://localhost:3000</code>.
          </li>
          <li>
            En <strong>URIs de redireccionamiento autorizados</strong>, pega la
            Callback URL de Supabase del paso 2.
          </li>
          <li>Copia el <strong>Client ID</strong> y <strong>Secret</strong> → pégalos en Supabase (paso 2) y guarda.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            Supabase puede usar credenciales propias de Google si no quieres crear
            las tuyas — al activar el proveedor puedes elegir "Use Supabase
            credentials" para desarrollo rápido.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          4. Botón de Google (<code>components/auth/GoogleLoginButton.tsx</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`"use client";

import { createClient } from "@/lib/supabase/client";

export function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Supabase redirige aquí con el code -> se intercambia por sesión
        redirectTo: \`\${window.location.origin}/auth/callback\`,
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-semibold transition hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continuar con Google
    </button>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔗</span>
          5. Integrar el botón en el login
        </h2>
        <p className="section-paragraph">
          En tu <code>app/login/page.tsx</code>, importa el botón y añádelo después
          del <code>&lt;/form&gt;</code>:
        </p>
        <CodeBlock
          code={`import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

// Dentro del componente LoginPage, después del </form>:
<GoogleLoginButton />`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            El flujo: el botón redirige a Google → Google autoriza → Supabase llama a
            tu <code>/auth/callback</code> con el <code>code</code> →{" "}
            <code>exchangeCodeForSession</code> crea la sesión → dashboard.
          </span>
        </div>
      </section>
    </>
  );
}
