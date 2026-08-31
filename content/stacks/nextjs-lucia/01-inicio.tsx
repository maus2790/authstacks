
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + Lucia Auth</h1>
        <p className="content-subtitle">
          Una biblioteca de autenticación minimalista con control total
        </p>
        <p className="text-gray-400 mt-4">
          Lucia te da control total sobre tu base de datos y tus sesiones: tú creas
          las tablas, tú escribes las Server Actions y Lucia se encarga de las
          sesiones, las cookies y el hash de contraseñas. Esta guía te lleva desde{" "}
          <strong>cero</strong> hasta un login + registro + dashboard protegido con
          Lucia v3, Drizzle y Turso, con código listo para copiar y pegar.
        </p>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <strong>Importante:</strong> Lucia fue <strong>descontinuada</strong> por
            su autor (anuncio oficial en marzo 2025) y recomienda migrar a Better
            Auth. El paquete sigue funcionando en su versión v3 y es una excelente
            herramienta educativa para entender la autenticación por dentro, pero
            <strong> no recibirá más actualizaciones</strong>. Tenlo en cuenta antes
            de usarla en producción.
          </span>
        </div>
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
            Una base de datos <strong>Turso</strong> (SQLite) o una SQLite local –
            <a href="https://turso.tech" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline"> Crear cuenta</a>
          </li>
        </ul>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          1. Crear el proyecto Next.js
        </h2>
        <p className="section-paragraph">Crea un proyecto Next.js con App Router y Tailwind:</p>
        <CommandBlock command="npx create-next-app@latest mi-app --typescript --tailwind --app --no-src-dir" />
        <CommandBlock command="cd mi-app" />
        <CommandBlock command="npm run dev" />
        <p className="section-paragraph">Abre el navegador en:</p>
        <CodeBlock code="http://localhost:3000" />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>Selecciona las opciones por defecto durante la instalación.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🦋</span>
          2. Instalar Lucia y dependencias
        </h2>
        <p className="section-paragraph">Instala Lucia, el adaptador de Drizzle y el cliente de base de datos:</p>
        <CommandBlock command="npm install lucia @lucia-auth/adapter-drizzle drizzle-orm @libsql/client" />
        <p className="section-paragraph">Dependencias de desarrollo (CLI de Drizzle) y dotenv para el CLI:</p>
        <CommandBlock command="npm install -D drizzle-kit" />
        <CommandBlock command="npm install dotenv" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong><br />
            • <code>lucia</code>: la biblioteca principal de autenticación (v3).<br />
            • <code>@lucia-auth/adapter-drizzle</code>: adaptador para Drizzle ORM.<br />
            • <code>drizzle-orm</code> y <code>drizzle-kit</code>: ORM y CLI de migraciones.<br />
            • <code>@libsql/client</code>: cliente para Turso/SQLite.<br />
            • <code>dotenv</code>: para que drizzle-kit lea tu <code>.env.local</code>.<br />
            <br />
            <strong>Nota:</strong> <strong>no necesitas</strong> bcryptjs — Lucia v3
            incluye <code>Scrypt</code> para hashear contraseñas. Tampoco react-hook-form
            ni zod: usamos formularios nativos + Server Actions.
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
New-Item -ItemType Directory -Path "lib/db" -Force
New-Item -ItemType Directory -Path "lib/auth" -Force
New-Item -ItemType Directory -Path "actions" -Force
New-Item -ItemType Directory -Path "app/login" -Force
New-Item -ItemType Directory -Path "app/register" -Force
New-Item -ItemType Directory -Path "app/dashboard" -Force
New-Item -ItemType Directory -Path "app/api/auth/google" -Force
New-Item -ItemType Directory -Path "app/api/auth/google/callback" -Force
New-Item -ItemType Directory -Path "components/auth" -Force

# Crear archivos vacíos (los llenas en los próximos pasos)
New-Item -ItemType File -Path "lib/db/schema.ts" -Force
New-Item -ItemType File -Path "lib/db/index.ts" -Force
New-Item -ItemType File -Path "lib/lucia.ts" -Force
New-Item -ItemType File -Path "lib/session.ts" -Force
New-Item -ItemType File -Path "lib/auth/password.ts" -Force
New-Item -ItemType File -Path "lib/auth/google.ts" -Force
New-Item -ItemType File -Path "actions/auth.ts" -Force
New-Item -ItemType File -Path "app/login/page.tsx" -Force
New-Item -ItemType File -Path "app/register/page.tsx" -Force
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path "app/api/auth/google/route.ts" -Force
New-Item -ItemType File -Path "app/api/auth/google/callback/route.ts" -Force
New-Item -ItemType File -Path "components/auth/GoogleLoginButton.tsx" -Force
New-Item -ItemType File -Path "proxy.ts" -Force
New-Item -ItemType File -Path "drizzle.config.ts" -Force
New-Item -ItemType File -Path ".env.local" -Force

Write-Host "✅ Estructura creada!" -ForegroundColor Green`}
          linuxCode={`# Crear carpetas
mkdir -p lib/db lib/auth actions app/login app/register app/dashboard "app/api/auth/google/callback" components/auth

# Crear archivos vacíos (los llenas en los próximos pasos)
touch lib/db/schema.ts lib/db/index.ts lib/lucia.ts lib/session.ts lib/auth/password.ts lib/auth/google.ts
touch actions/auth.ts app/login/page.tsx app/register/page.tsx app/dashboard/page.tsx
touch "app/api/auth/google/route.ts" "app/api/auth/google/callback/route.ts"
touch components/auth/GoogleLoginButton.tsx
touch proxy.ts drizzle.config.ts .env.local

echo "✅ Estructura creada!"`}
        />
        <p className="section-paragraph">La estructura final del proyecto queda así:</p>
        <CodeBlock
          code={`mi-app/
├── app/
│   ├── api/auth/google/route.ts     ← Inicia el flujo OAuth de Google (paso 6)
│   │   └── callback/route.ts        ← Recibe el retorno de Google (paso 6)
│   ├── login/page.tsx              ← Formulario de inicio de sesión
│   ├── register/page.tsx           ← Formulario de registro
│   ├── dashboard/page.tsx          ← Página protegida
│   └── page.tsx                    ← (template, se adapta en el paso 5)
├── actions/
│   └── auth.ts                     ← Server Actions (login, registro, logout)
├── components/
│   └── auth/GoogleLoginButton.tsx  ← Botón de Google (paso 6)
├── lib/
│   ├── db/schema.ts                ← Tablas (users, sessions, accounts…)
│   ├── db/index.ts                 ← Cliente de la base de datos
│   ├── lucia.ts                    ← Configuración de Lucia
│   ├── session.ts                  ← Utilidad getSessionUser
│   └── auth/password.ts            ← Hash de contraseñas (Scrypt)
│       └── google.ts               ← Proveedor OAuth de Google (paso 6)
├── proxy.ts                        ← Protección de rutas (Next 16)
├── drizzle.config.ts               ← Config de Drizzle CLI
└── .env.local                      ← Credenciales`}
        />
      </section>
    </>
  );
}
