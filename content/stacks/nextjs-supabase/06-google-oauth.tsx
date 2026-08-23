import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Configuración de autenticación con Google en Supabase y frontend
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          1. Configuración en Google Cloud Platform
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Accede a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a> y crea un proyecto.</li>
          <li>Ve a <strong>APIs y Servicios → Pantalla de consentimiento de OAuth</strong>.</li>
          <li>Configura el nombre, correo de asistencia y tipo de usuario (Externo).</li>
          <li>En <strong>Información de la marca</strong>, añade el <strong>dominio autorizado</strong> (Project URL de Supabase <strong>sin https://</strong>).</li>
          <li>Crea credenciales: <strong>ID de cliente OAuth</strong> (tipo Aplicación web).</li>
          <li>En <strong>Orígenes autorizados de JavaScript</strong>, añade el Project URL completo (con https://).</li>
          <li>En <strong>URIs de redireccionamiento autorizados</strong>, añade el Callback URL de Supabase (obtenido en Authentication → Providers → Google).</li>
          <li>Copia el <strong>ID de cliente</strong> y <strong>Secreto de cliente</strong>.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">📋</span>
          <span>Callback URL de Supabase ejemplo: <code>https://smsdrwkqwrchqbobbyxi.supabase.co/auth/v1/callback</code></span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          2. Configuración en Supabase
        </h2>
        <p className="section-paragraph">Ve a <strong>Authentication → Sign In / Providers → Google</strong>:</p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>Activa el proveedor Google.</li>
          <li>Pega el <strong>ID de cliente</strong> y <strong>Secreto de cliente</strong>.</li>
          <li>Haz clic en <strong>Save</strong>.</li>
        </ul>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          3. Botón de Google en el frontend
        </h2>
        <p className="section-paragraph">
          Añade el botón en <code>components/auth/SignInForm.tsx</code> o en la página de login:
        </p>
        <CodeBlock
          code={`const googleSignIn = async () => {
  setLoading(true);
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: \`\${window.location.origin}/api/auth/callback\`,
      },
    });
    if (error) throw new Error(error.message);
  } catch (error: any) {
    toast.error(error.message);
    setLoading(false);
  }
};

// En el render:
<Button variant="outline" type="button" onClick={googleSignIn} disabled={isLoading} className="w-full">
  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
  Google
</Button>`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>El flujo completo: usuario hace clic → redirige a Google → autoriza → redirige a <code>/api/auth/callback</code> → Supabase intercambia código por sesión → redirige al dashboard.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📧</span>
          4. Plantillas de correo personalizadas
        </h2>
        <p className="section-paragraph">
          Puedes personalizar los correos de confirmación y recuperación con HTML y estilos modernos.
          Las plantillas se configuran en <strong>Authentication → Email</strong>. Usa variables como{' '}
          <code>{`{{ .SiteURL }}`}</code> y <code>{`{{ .TokenHash }}`}</code>.
        </p>
        <p className="section-paragraph">
          Ejemplo de plantilla para confirmación de email:
        </p>
        <CodeBlock
          code={`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirma tu Email</title>
  <style>
    /* Estilos... */
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">MiApp</div>
      <div class="subtitle">Bienvenido</div>
    </div>
    <div class="content">
      <h2>Confirma tu correo electrónico</h2>
      <p>¡Bienvenido! Por favor confirma tu dirección de correo electrónico.</p>
      <a href="{{ .SiteURL }}/api/auth/callback?token_hash={{ .TokenHash }}&type=email" class="button">
        Confirmar cuenta
      </a>
    </div>
  </div>
</body>
</html>`}
        />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>Las plantillas completas están disponibles en el código del proyecto.</span>
        </div>
      </section>
    </>
  );
}