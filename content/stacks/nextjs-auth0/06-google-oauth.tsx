import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Activa el botón de Google en Auth0 (sin código extra)
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          1. Configuración en Auth0 Dashboard
        </h2>
        <p className="section-paragraph">
          El botón de Google aparece <strong>automáticamente</strong> en el Universal
          Login una vez activas la conexión. No hay que crear componentes ni código:
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://manage.auth0.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Auth0 Dashboard</a>.</li>
          <li>Navega a <strong>Authentication → Social → Google</strong>.</li>
          <li>Activa el interruptor para habilitar el proveedor.</li>
          <li>Ingresa el <strong>Client ID</strong> y <strong>Client Secret</strong> de Google Cloud (paso 2).</li>
          <li>Guarda los cambios.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">📋</span>
          <span>
            Auth0 maneja automáticamente la redirección de Google: no necesitas
            tocar tu <code>proxy.ts</code> ni las URIs de tu app para que funcione.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          2. Configuración en Google Cloud
        </h2>
        <p className="section-paragraph">
          Si no tienes las credenciales de Google, créalas así:
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a>.</li>
          <li>Crea un proyecto o selecciona uno existente.</li>
          <li>Ve a <strong>APIs y Servicios → Credenciales</strong>.</li>
          <li>Crea un <strong>ID de cliente OAuth</strong> de tipo "Aplicación web".</li>
          <li>
            En <strong>Orígenes autorizados de JavaScript</strong>, añade la URL de tu tenant:
            <br />
            <CodeBlock code="https://tu-dominio.auth0.com" />
          </li>
          <li>
            En <strong>URIs de redireccionamiento autorizados</strong>, añade:
            <br />
            <CodeBlock code="https://tu-dominio.auth0.com/login/callback" />
          </li>
          <li>Copia el <strong>ID de cliente</strong> y <strong>Secreto de cliente</strong> y pégalos en el paso 1.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Reemplaza <code>tu-dominio.auth0.com</code> por tu dominio real de Auth0
            (el valor de <code>AUTH0_DOMAIN</code> en tu <code>.env.local</code>).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          3. Botón de Google en tu propia UI (opcional)
        </h2>
        <p className="section-paragraph">
          Con Auth0, el botón de Google ya está incluido en Universal Login. Si
          quieres un botón directo en tu landing (saltarte la pantalla intermedia),
          apunta un enlace a <code>/auth/login?connection=google-oauth2</code>:
        </p>
        <CodeBlock
          code={`{/* En app/page.tsx, junto a los otros botones */}
<a
  href="/auth/login?connection=google-oauth2"
  className="mt-3 block w-full rounded-lg bg-white px-4 py-3 text-center font-semibold text-gray-800 transition hover:bg-gray-100"
>
  Continuar con Google
</a>`}
        />
        <p className="section-paragraph">
          El parámetro <code>connection</code> le dice a Auth0 qué proveedor social
          usar directamente. También funciona con <code>connection=github</code>,{" "}
          <code>connection=facebook</code>, etc. (según las conexiones que actives).
        </p>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            Ojo con la ruta: en el SDK v4 es <code>/auth/login?connection=...</code>,
            <strong> no</strong> <code>/api/auth/login?connection=...</code> (eso era
            del SDK v3).
          </span>
        </div>
      </section>
    </>
  );
}
