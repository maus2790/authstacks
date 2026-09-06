
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + Firebase Auth</h1>
        <p className="content-subtitle">
          Login y registro con Firebase Authentication
        </p>
        <p className="text-gray-400 mt-4">
          Firebase Authentication se encarga de los usuarios y las contraseñas por
          ti: hash seguro, verificación de email, bloqueo de cuentas, etc. Tú solo
          integras <strong>dos SDKs</strong>: el SDK <strong>web</strong> (formularios
          en el navegador) y el <strong>Admin SDK</strong> (sesiones en el servidor
          con tu cuenta de servicio). Esta guía te lleva desde <strong>cero</strong>{" "}
          hasta login + registro + dashboard protegido, con código listo para copiar
          y pegar.
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📌</span>
          Requisitos previos
        </h2>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>
            <strong>Node.js 20 o superior</strong> –{' '}
            <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Descargar</a>
          </li>
          <li>
            Un proyecto en <strong>Firebase</strong> (plan Spark gratis) –{' '}
            <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Crear proyecto</a>
          </li>
        </ul>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          1. Crear el proyecto Next.js
        </h2>
        <CommandBlock command="npx create-next-app@latest mi-app --typescript --tailwind --app --no-src-dir" />
        <CommandBlock command="cd mi-app" />
        <CommandBlock command="npm run dev" />
        <p className="section-paragraph">Abre el navegador en:</p>
        <CodeBlock code="http://localhost:3000" />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔥</span>
          2. Instalar los SDKs de Firebase
        </h2>
        <p className="section-paragraph">Instala <strong>solo</strong> estas dos dependencias:</p>
        <CommandBlock command="npm install firebase firebase-admin" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong><br />
            • <code>firebase</code>: SDK <strong>web</strong> — corre en el navegador
            y hace el login/registro contra Firebase Auth.<br />
            • <code>firebase-admin</code>: SDK <strong>de servidor</strong> — crea la
            cookie de sesión (session cookie) que protege tus rutas.<br />
            <br />
            <strong>No necesitas</strong> react-hook-form, zod ni toast: formularios
            nativos + estados de React.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📁</span>
          3. Estructura de archivos
        </h2>
        <p className="section-paragraph">
          Crea la estructura mínima. <code>app/page.tsx</code> y{" "}
          <code>app/layout.tsx</code> ya existen del template:
        </p>

        <h3 className="subsection-title">⚡ Comandos para crear la estructura</h3>
        <OsCommandTabs
          windowsCode={`# Crear carpetas
New-Item -ItemType Directory -Path "lib/firebase" -Force
New-Item -ItemType Directory -Path "actions" -Force
New-Item -ItemType Directory -Path "app/login" -Force
New-Item -ItemType Directory -Path "app/register" -Force
New-Item -ItemType Directory -Path "app/dashboard" -Force
New-Item -ItemType Directory -Path "components/auth" -Force

# Crear archivos vacíos (los llenas en los próximos pasos)
New-Item -ItemType File -Path "lib/firebase/admin.ts" -Force
New-Item -ItemType File -Path "lib/firebase/client.ts" -Force
New-Item -ItemType File -Path "lib/firebase/session.ts" -Force
New-Item -ItemType File -Path "actions/auth.ts" -Force
New-Item -ItemType File -Path "app/login/page.tsx" -Force
New-Item -ItemType File -Path "app/register/page.tsx" -Force
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path "components/auth/GoogleLoginButton.tsx" -Force
New-Item -ItemType File -Path "proxy.ts" -Force
New-Item -ItemType File -Path ".env.local" -Force

Write-Host "✅ Estructura creada!" -ForegroundColor Green`}
          linuxCode={`# Crear carpetas
mkdir -p lib/firebase actions app/login app/register app/dashboard components/auth

# Crear archivos vacíos (los llenas en los próximos pasos)
touch lib/firebase/admin.ts lib/firebase/client.ts lib/firebase/session.ts
touch actions/auth.ts app/login/page.tsx app/register/page.tsx app/dashboard/page.tsx
touch components/auth/GoogleLoginButton.tsx
touch proxy.ts .env.local

echo "✅ Estructura creada!"`}
        />
        <p className="section-paragraph">La estructura final queda así:</p>
        <CodeBlock
          code={`mi-app/
├── app/
│   ├── login/page.tsx              ← Login (SDK web en el navegador)
│   ├── register/page.tsx           ← Registro (SDK web en el navegador)
│   ├── dashboard/page.tsx          ← Página protegida (Admin SDK en el servidor)
│   └── page.tsx                    ← (template, se adapta en el paso 5)
├── actions/
│   └── auth.ts                     ← Server Actions (crear sesión, logout)
├── lib/firebase/
│   ├── client.ts                   ← SDK web (config pública)
│   ├── admin.ts                    ← Admin SDK (cuenta de servicio)
│   └── session.ts                  ← Lee la cookie de sesión
├── proxy.ts                        ← Protección de rutas (Next 16)
└── .env.local                      ← Credenciales`}
        />
      </section>
    </>
  );
}
