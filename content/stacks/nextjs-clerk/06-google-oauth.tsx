import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Activa Google en el dashboard — sin código OAuth
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">💡</span>
          1. Cómo funciona con Clerk
        </h2>
        <p className="section-paragraph">
          Con Clerk no escribes nada de OAuth (sin arctic, sin callbacks, sin
          tokens). Activas Google en el dashboard y el botón aparece
          automáticamente en los componentes <code>SignIn</code> y{" "}
          <code>SignUp</code>. Clerk crea y gestiona la cuenta del usuario por ti.
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          2. Activar Google en Clerk Dashboard
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Clerk Dashboard</a> → selecciona tu aplicación.</li>
          <li>Navega a <strong>User &amp; Authentication → Social Connections</strong>.</li>
          <li>
            Haz clic en <strong>Add connection</strong> → <strong>Google</strong>.
          </li>
          <li>Habilítala (Clerk puede usar sus propias credenciales de Google o las tuyas).</li>
          <li>Guarda.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">📋</span>
          <span>
            Clerk <strong>maneja las URIs de redirección por ti</strong>: no
            necesitas configurar nada en Google Cloud. Si quieres usar tus propias
            credenciales, Clerk te muestra la URI de callback exacta que debes
            registrar en Google.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          3. Usar tus propias credenciales de Google (opcional)
        </h2>
        <p className="section-paragraph">
          Si prefieres usar tu propio proyecto de Google Cloud:
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a>.</li>
          <li>Crea un <strong>ID de cliente OAuth</strong> de tipo "Aplicación web".</li>
          <li>En <strong>URIs de redireccionamiento autorizados</strong>, pega la URI que Clerk te muestra en la conexión de Google (termina en <code>/v1/oauth/callback</code>).</li>
          <li>Copia el <strong>Client ID</strong> y <strong>Client Secret</strong> de vuelta a Clerk.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            La URI exacta de callback aparece en el dashboard de Clerk dentro de la
            conexión de Google — siempre es del dominio <code>accounts.&lt;tu-app&gt;.clerk.accounts.dev</code>{" "}
            o tu dominio personalizado.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          4. El botón aparece solo
        </h2>
        <p className="section-paragraph">
          Una vez activada la conexión, el botón <strong>Continue with Google</strong>{" "}
          aparece dentro de los componentes <code>SignIn</code> y <code>SignUp</code>{" "}
          del paso 4 — sin tocar nada:
        </p>
        <CodeBlock
          code={`// app/sign-in/[[...sign-in]]/page.tsx (sin cambios)
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            Si el botón no aparece, verifica en el dashboard que la conexión esté
            activada <strong>y</strong> que la sesión del navegador no tenga una
            caché vieja (recarga con Ctrl+Shift+R). En desarrollo, reinicia
            también el servidor.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔄</span>
          5. Otros proveedores y personalización
        </h2>
        <p className="section-paragraph">
          El mismo flujo aplica para GitHub, Apple, Microsoft, X, etc. — añade la
          conexión en <strong>Social Connections</strong> y el botón aparece. Puedes
          reordenar u ocultar proveedores desde el dashboard o con la prop{" "}
          <code>appearance</code> de los componentes.
        </p>
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            Cuando un usuario inicia sesión con Google por primera vez, Clerk crea
            su cuenta automáticamente. Si luego inicia sesión con email y
            contraseña usando el mismo correo, Clerk los vincula. Explora también{" "}
            <a href="https://clerk.com/docs/guides/organizations/overview" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Organizations</a>{" "}
            para gestión de equipos y permisos.
          </span>
        </div>
      </section>
    </>
  );
}
