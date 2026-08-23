import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Configuración de autenticación con Google en Clerk
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          1. Configuración en Clerk Dashboard
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Clerk Dashboard</a>.</li>
          <li>Selecciona tu aplicación.</li>
          <li>Navega a <strong>Authentication → Social Connections</strong>.</li>
          <li>Haz clic en <strong>"Add connection"</strong> y selecciona <strong>Google</strong>.</li>
          <li>Ingresa el <strong>Client ID</strong> y <strong>Client Secret</strong> de Google Cloud (obtenidos en la consola de Google).</li>
          <li>Guarda los cambios.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">📋</span>
          <span>
            Clerk maneja automáticamente las URIs de redireccionamiento, por lo que no necesitas
            configurarlas manualmente en Google Cloud.
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
          <li>En <strong>Orígenes autorizados de JavaScript</strong>, añade la URL de tu aplicación (ej. <code>http://localhost:3000</code>).</li>
          <li>En <strong>URIs de redireccionamiento autorizados</strong>, añade la URL de callback de Clerk. Puedes obtenerla desde el dashboard de Clerk en la sección de Google.</li>
          <li>Copia el <strong>ID de cliente</strong> y <strong>Secreto de cliente</strong>.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Clerk proporciona la URI de redireccionamiento automáticamente. La encontrarás en el
            dashboard cuando configures la conexión social.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          3. Uso del botón de Google en el frontend
        </h2>
        <p className="section-paragraph">
          Con Clerk, el botón de Google ya está incluido en los componentes <code>SignIn</code> y{' '}
          <code>SignUp</code>. Si quieres un botón personalizado, puedes usar el hook{' '}
          <code>useSignIn</code> o <code>useSignUp</code>:
        </p>
        <CodeBlock
          code={`"use client";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

export default function GoogleLoginButton() {
  const { signIn } = useSignIn();

  const handleGoogleLogin = async () => {
    try {
      await signIn?.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
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
      Iniciar sesión con Google
    </Button>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">⚙️</span>
          4. Personalización de la autenticación social
        </h2>
        <p className="section-paragraph">
          Puedes personalizar la apariencia de los botones sociales en los componentes de Clerk
          mediante la prop <code>appearance</code>:
        </p>
        <CodeBlock
          code={`<SignIn
  appearance={{
    elements: {
      socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 border-white/20 text-white",
      socialButtonsBlockButton__google: "bg-red-500/20 hover:bg-red-500/30 text-red-300",
      socialButtonsBlockButton__github: "bg-gray-700/50 hover:bg-gray-600/50",
    },
  }}
/>`}
        />
        <div className="tip">
          <span className="tip-icon">🎨</span>
          <span>
            Clerk permite personalizar cada proveedor social individualmente añadiendo
            <code>__google</code>, <code>__github</code>, etc. al selector CSS.
          </span>
        </div>
      </section>
    </>
  );
}