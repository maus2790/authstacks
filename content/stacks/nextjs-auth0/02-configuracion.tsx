import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Auth0</h1>
        <p className="content-subtitle">
          Credenciales, URIs y variables de entorno
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          1. Crear la aplicación en Auth0 y obtener credenciales
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://manage.auth0.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Auth0 Dashboard</a>.</li>
          <li>En el menú: <strong>Applications → Applications → + Create Application</strong>.</li>
          <li>Ponle un nombre (ej: "Mi App Next.js") y elige el tipo <strong>"Regular Web Application"</strong> → Create.</li>
          <li>En la pestaña <strong>Settings</strong> encontrarás los 3 valores que necesitas:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Domain</strong> → ej: <code>dev-xxxx.us.auth0.com</code></li>
              <li><strong>Client ID</strong></li>
              <li><strong>Client Secret</strong> (clic en "Reveal" para verlo)</li>
            </ul>
          </li>
        </ol>
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            El <strong>Client Secret</strong> es sensible: solo va en variables de
            entorno del servidor (<code>.env.local</code>), nunca en el frontend.
            Además, Auth0 solo te lo muestra una vez al crearlo (puedes
            regenerarlo con el botón "Rotate" si lo pierdes).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          2. Configurar las URIs de redirección (paso crítico)
        </h2>
        <p className="section-paragraph">
          En <strong>Settings → Application URIs</strong> de tu aplicación, configura
          exactamente estos valores:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>
            <strong>Allowed Callback URLs:</strong> <code>http://localhost:3000/auth/callback</code>
          </li>
          <li>
            <strong>Allowed Logout URLs:</strong> <code>http://localhost:3000</code>
          </li>
          <li>
            <strong>Initiate Login URI:</strong> <em>déjalo vacío</em>
          </li>
          <li>
            <strong>Allowed Web Origins:</strong> <em>déjalo vacío</em>
          </li>
        </ul>
        <p className="section-paragraph">
          Para producción, reemplaza <code>http://localhost:3000</code> por tu dominio real
          (ej: <code>https://miapp.com</code>).
        </p>
        <div className="tip">
          <span className="tip-icon">🚨</span>
          <span>
            <strong>Errores frecuentes:</strong>
            <br />• La ruta de callback es <code>/auth/callback</code>,{" "}
            <strong>no</strong> <code>/api/auth/callback</code> (eso era del SDK v3).
            <br />• <code>Initiate Login URI</code> y <code>Allowed Web Origins</code>{" "}
            <strong>solo aceptan https</strong>. En local, déjalos vacíos o Auth0 te
            rechazará el valor con un error de validación.
            <br />• Si ves "Callback URL mismatch", es que este campo no está bien.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          3. Variables de entorno (<code>.env.local</code>)
        </h2>
        <p className="section-paragraph">
          Rellena <code>.env.local</code> con los valores de tu aplicación (los nombres
          son los que usa el SDK v4, exactamente los que muestra el Quickstart de Auth0):
        </p>
        <h3 className="subsection-title">.env.local</h3>
        <CodeBlock
          code={`# URL base de tu app (local)
APP_BASE_URL=http://localhost:3000

# De tu aplicación Auth0 (Settings)
AUTH0_DOMAIN=dev-xxxx.us.auth0.com
AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret

# Clave para cifrar cookies de sesión (genera una con el comando de abajo)
AUTH0_SECRET=tu-secreto-generado`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            <strong>AUTH0_SECRET</strong> debe ser una cadena aleatoria de 64
            caracteres hex. Genérala con:{' '}
            <CommandBlock command={`openssl rand -hex 32`} />
            <br />
            (Si estás en Windows sin openssl, usa:{' '}
            <CommandBlock command={`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`} />
            )
          </span>
        </div>
        <div className="tip">
          <span className="tip-icon">✅</span>
          <span>
            El Quickstart de Auth0 te genera estos 5 nombres de variable con tus
            valores ya rellenados en "Setup sample project". Solo copia el bloque
            completo a tu <code>.env.local</code>. Esos nombres (<code>AUTH0_DOMAIN</code>,
            <code>AUTH0_CLIENT_ID</code>, <code>AUTH0_CLIENT_SECRET</code>,{" "}
            <code>AUTH0_SECRET</code>, <code>APP_BASE_URL</code>) son los que el SDK
            espera — no son <code>AUTH0_BASE_URL</code> ni <code>AUTH0_ISSUER_BASE_URL</code>{" "}
            (eso también era del SDK v3).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔍</span>
          4. Verificar la conexión con Auth0
        </h2>
        <p className="section-paragraph">
          Con el servidor corriendo (<code>npm run dev</code>), visita en el navegador:
        </p>
        <CodeBlock code="http://localhost:3000/auth/login" />
        <p className="section-paragraph">
          Si la configuración es correcta, serás redirigido a la página de login
          de tu tenant (<code>dev-xxxx.us.auth0.com</code>). Si aparece un error de
          "Callback URL mismatch", revisa el paso 2.
        </p>
      </section>
    </>
  );
}
