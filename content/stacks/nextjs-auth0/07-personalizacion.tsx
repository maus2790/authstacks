import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Personalizacion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Personalizar Apariencia y Campos</h1>
        <p className="content-subtitle">
          Logo, colores, temas y campos extra en el formulario de Auth0
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎨</span>
          1. Qué se puede personalizar y qué no
        </h2>
        <p className="section-paragraph">
          El formulario (login y registro) lo muestra <strong>Auth0</strong>, pero
          eso no significa que no puedas darle tu identidad visual. Hay 3 niveles:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>
            <strong>Nivel 1 – Visual sin código</strong> (recomendado): logo, colores,
            tema claro/oscuro y fuentes desde el dashboard. Aplica a todo sin tocar tu app.
          </li>
          <li>
            <strong>Nivel 2 – Añadir campos</strong>: campos extra en el formulario de
            registro (ej: nombre de usuario, empresa, teléfono) con el editor visual.
          </li>
          <li>
            <strong>Nivel 3 – Plantilla HTML completa</strong>: control total del HTML del
            formulario (requiere la "Classic" Login Experience).
          </li>
        </ul>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            Construir el formulario de <strong>email + contraseña dentro de tu app
            React</strong> no está soportado de forma segura por el SDK para Regular Web
            Apps: Auth0 centraliza el login por seguridad. La personalización se hace
            en su página hosteada (niveles 1–3).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎨</span>
          2. Nivel 1: Logo, colores y tema (sin código)
        </h2>
        <p className="section-paragraph">
          En el dashboard de Auth0: <strong>Branding → Universal Login</strong>.
          Si tu tenant usa la <strong>New Universal Login Experience</strong>, verás
          un editor visual con:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>
            <strong>Logo</strong>: sube tu logo (aparece arriba del formulario).
          </li>
          <li>
            <strong>Tema claro/oscuro</strong>: el formulario se adapta a la preferencia
            del navegador o fuerzas uno.
          </li>
          <li>
            <strong>Color primario</strong> y <strong>fuente</strong>: el color de los
            botones y la tipografía de todo el formulario.
          </li>
          <li>
            <strong>CSS personalizado</strong>: si necesitas retoques finos, puedes pegar
            un bloque CSS sin escribir HTML.
          </li>
        </ul>
        <p className="section-paragraph">
          Ejemplo de CSS personalizado para redondear más los botones y ajustar el logo:
        </p>
        <CodeBlock
          code={`/* Branding -> Universal Login -> Custom CSS */
.auth0-lock-input-wrap {
  border-radius: 12px;
}
.auth0-lock-header-logo {
  border-radius: 8px;
}
button[type="submit"] {
  border-radius: 9999px;
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Los cambios se ven al instante: recarga el formulario de Auth0 y ya
            aplican. No tienes que reiniciar tu app ni cambiar el proxy.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📝</span>
          3. Nivel 2: Añadir campos al formulario de registro
        </h2>
        <p className="section-paragraph">
          En la <strong>New Universal Login Experience</strong>, dentro de{" "}
          <strong>Branding → Universal Login</strong>, hay un editor del formulario de
          <strong> Sign Up</strong> donde puedes añadir campos personalizados:
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Entra en <strong>Branding → Universal Login</strong>.</li>
          <li>En el editor visual del formulario, selecciona la vista <strong>Sign Up</strong>.</li>
          <li>Añade un campo nuevo: <strong>nombre de usuario</strong>, <strong>empresa</strong>, <strong>teléfono</strong>, etc.</li>
          <li>Define si es obligatorio y su etiqueta visible.</li>
          <li>Guarda — el campo aparecerá en el registro y se guardará en el perfil del usuario (<code>user_metadata</code>).</li>
        </ol>
        <p className="section-paragraph">
          En la vista de <strong>Log In</strong> también puedes ocultar o reordenar los
          proveedores sociales (Google, GitHub…) y el enlace de registro.
        </p>
        <div className="tip">
          <span className="tip-icon">🔍</span>
          <span>
            Si tu tenant usa la <strong>Classic Login Experience</strong>, el camino es
            distinto: <strong>User Management → Database → tu conexión → Signup &
            Login</strong> (añadir campos a "Profile") o editar el HTML directamente
            (nivel 3).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          4. Nivel 3: Plantilla HTML completa (Classic)
        </h2>
        <p className="section-paragraph">
          Para control total del formulario (estructura, campos, estilos), activa la{" "}
          <strong>Classic Login Experience</strong> y edita la página hosteada:
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>En <strong>Branding → Universal Login</strong>, elige <strong>Classic Login Experience</strong>.</li>
          <li>En <strong>Advanced Settings → Login Page</strong>, activa <strong>Customize Login Page</strong>.</li>
          <li>Verás el HTML/JS de la página: edítalo a tu gusto (estructura, campos, estilos).</li>
          <li>Guarda y recarga el formulario.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            La plantilla ya trae el flujo completo (login, registro, recuperación,
            social). Edítala con cuidado: cualquier error de JS rompe el acceso a
            tu app. Mantén los <code>data-*</code> y las llamadas a la SDK que ya vienen.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🚪</span>
          5. ¿Y si quiero mi propio formulario en React?
        </h2>
        <p className="section-paragraph">
          Para <strong>email + contraseña</strong> dentro de tu app, Auth0 no lo
          recomienda con Regular Web Applications (el formulario hosteado es más
          seguro: MFA, breach protection, CAPTCHA, etc. sin que tú los implementes).
        </p>
        <p className="section-paragraph">
          La alternativa soportada por el SDK v4 si de verdad necesitas un formulario
          propio es el flujo <strong>passwordless</strong> (OTP por email/SMS o magic
          link), con rutas propias del SDK:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li><code>/auth/passwordless/start</code> – envía el código/link.</li>
          <li><code>/auth/passwordless/verify</code> – valida el código y crea la sesión.</li>
        </ul>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Para la mayoría de los casos, el <strong>nivel 1 o 2</strong> son la opción
            correcta: consigues el login/registro con tu marca y campos extra, sin
            mantener lógica de autenticación ni reimplementar seguridad.
          </span>
        </div>
      </section>
    </>
  );
}
