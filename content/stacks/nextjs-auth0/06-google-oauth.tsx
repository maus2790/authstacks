import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Configuración de autenticación con Google en Auth0
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          1. Configuración en Auth0 Dashboard
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://manage.auth0.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Auth0 Dashboard</a>.</li>
          <li>Navega a <strong>Authentication → Social → Google</strong>.</li>
          <li>Habilita el proveedor Google.</li>
          <li>Ingresa el <strong>Client ID</strong> y <strong>Client Secret</strong> de Google Cloud.</li>
          <li>Guarda los cambios.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">📋</span>
          <span>
            Auth0 maneja automáticamente la configuración de redireccionamiento, solo necesitas
            las credenciales de Google.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          2. Configuración en Google Cloud
        </h2>
        <p className="section-paragraph">
          Si no tienes las credenciales de Google, sigue estos pasos:
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a>.</li>
          <li>Crea un proyecto o selecciona uno existente.</li>
          <li>Ve a <strong>APIs y Servicios → Credenciales</strong>.</li>
          <li>Crea un <strong>ID de cliente OAuth</strong> de tipo "Aplicación web".</li>
          <li>
            En <strong>Orígenes autorizados de JavaScript</strong>, añade la URL de tu aplicación Auth0:
            <br />
            <CodeBlock code="https://tu-dominio.auth0.com" />
          </li>
          <li>
            En <strong>URIs de redireccionamiento autorizados</strong>, añade la URL de callback de Auth0:
            <br />
            <CodeBlock code="https://tu-dominio.auth0.com/login/callback" />
          </li>
          <li>Copia el <strong>ID de cliente</strong> y <strong>Secreto de cliente</strong>.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            La URI de redireccionamiento de Auth0 para Google siempre es{' '}
            <code>https://tu-dominio.auth0.com/login/callback</code>.
            <br />
            <strong>Nota:</strong> Reemplaza <code>tu-dominio.auth0.com</code> con tu dominio real de Auth0.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          3. Uso del botón de Google en el frontend
        </h2>
        <p className="section-paragraph">
          Con Auth0, el botón de Google ya está incluido en Universal Login. Si quieres un botón personalizado
          en tu propia UI, puedes redirigir directamente a Auth0 con el parámetro <code>connection</code>:
        </p>
        <CodeBlock
          code={`"use client";
import { Button } from "@/components/ui/Button";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Redirigir a Auth0 con el connection de Google
    window.location.href =
      "/api/auth/login?connection=google-oauth2";
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
          El parámetro <code>connection</code> le dice a Auth0 qué proveedor social usar.
          También puedes usar <code>connection=github</code>, <code>connection=facebook</code>, etc.
        </p>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Puedes listar todos los proveedores sociales configurados en Auth0 desde el dashboard.
            Cada uno tiene un nombre de conexión que puedes usar en el parámetro <code>connection</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">⚙️</span>
          4. Múltiples proveedores sociales
        </h2>
        <p className="section-paragraph">
          Auth0 soporta múltiples proveedores sociales. Puedes redirigir a cualquiera de ellos:
        </p>
        <CodeBlock
          code={`"use client";
import { Button } from "@/components/ui/Button";

export default function SocialLoginButtons() {
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        onClick={() => (window.location.href = "/api/auth/login?connection=google-oauth2")}
        className="w-full flex items-center justify-center gap-2"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          {/* Google SVG */}
        </svg>
        Google
      </Button>
      <Button
        variant="outline"
        onClick={() => (window.location.href = "/api/auth/login?connection=github")}
        className="w-full flex items-center justify-center gap-2"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        GitHub
      </Button>
    </div>
  );
}`}
        />
      </section>
    </>
  );
}