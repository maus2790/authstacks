
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + Better Auth</h1>
        <p className="content-subtitle">
          Una biblioteca de autenticación moderna, extensible y de código abierto
        </p>
        <p className="text-gray-400 mt-4">
          Better Auth es una alternativa ligera y flexible a NextAuth.js. A
          diferencia de Auth0, aquí el login y el registro <strong>sí</strong> los
          construyes tú con formularios propios (email + contraseña en tu propia
          base de datos). Esta guía te lleva desde <strong>cero</strong> hasta un
          login + registro + dashboard protegido con Better Auth v1 y Drizzle,
          con código listo para copiar y pegar.
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
            Una base de datos <strong>Turso</strong> (SQLite) — plan Free –{' '}
            <a href="https://turso.tech" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Crear cuenta</a>
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
          <span className="section-icon">✨</span>
          2. Instalar Better Auth y dependencias
        </h2>
        <p className="section-paragraph">Instala Better Auth, el adaptador de Drizzle y el cliente de Turso:</p>
        <CommandBlock command="npm install better-auth drizzle-orm @libsql/client" />
        <p className="section-paragraph">Dependencia de desarrollo (CLI de Drizzle para migraciones):</p>
        <CommandBlock command="npm install -D drizzle-kit" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong><br />
            • <code>better-auth</code>: la biblioteca principal de autenticación.
            Incluye el adaptador de Drizzle integrado (se importa desde{" "}
            <code>better-auth/adapters/drizzle</code>).<br />
            • <code>drizzle-orm</code> y <code>drizzle-kit</code>: ORM y CLI de migraciones.<br />
            • <code>@libsql/client</code>: cliente para Turso (SQLite).<br />
            <br />
            <strong>Nota:</strong> no instales <code>@better-auth/drizzle</code>{" "}
            (paquete de versiones antiguas, ya no existe) ni <code>bcryptjs</code> —
            Better Auth v1 hashea contraseñas con scrypt de Node incluido.
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
New-Item -ItemType Directory -Path "app/api/auth/[...all]" -Force
New-Item -ItemType Directory -Path "app/login" -Force
New-Item -ItemType Directory -Path "app/register" -Force
New-Item -ItemType Directory -Path "app/dashboard" -Force
New-Item -ItemType Directory -Path "app/forgot-password" -Force
New-Item -ItemType Directory -Path "app/reset-password" -Force
New-Item -ItemType Directory -Path "components/auth" -Force

# Crear archivos vacíos (los llenas en los próximos pasos)
New-Item -ItemType File -Path "lib/db/schema.ts" -Force
New-Item -ItemType File -Path "lib/db/index.ts" -Force
New-Item -ItemType File -Path "lib/auth/index.ts" -Force
New-Item -ItemType File -Path "lib/auth-client.ts" -Force
New-Item -ItemType File -Path "lib/session.ts" -Force
New-Item -ItemType File -Path "actions/auth.ts" -Force
New-Item -ItemType File -Path "app/api/auth/[...all]/route.ts" -Force
New-Item -ItemType File -Path "app/login/page.tsx" -Force
New-Item -ItemType File -Path "app/register/page.tsx" -Force
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path "app/forgot-password/page.tsx" -Force
New-Item -ItemType File -Path "app/reset-password/page.tsx" -Force
New-Item -ItemType File -Path "app/reset-password/reset-password-form.tsx" -Force
New-Item -ItemType File -Path "components/auth/GoogleLoginButton.tsx" -Force
New-Item -ItemType File -Path "drizzle.config.ts" -Force
New-Item -ItemType File -Path "proxy.ts" -Force
New-Item -ItemType File -Path ".env.local" -Force

Write-Host "✅ Estructura creada!" -ForegroundColor Green`}
          linuxCode={`# Crear carpetas
mkdir -p lib/db lib/auth actions "app/api/auth/[...all]" app/login app/register app/dashboard app/forgot-password app/reset-password components/auth

# Crear archivos vacíos (los llenas en los próximos pasos)
touch lib/db/schema.ts lib/db/index.ts lib/auth/index.ts lib/auth-client.ts lib/session.ts
touch actions/auth.ts "app/api/auth/[...all]/route.ts"
touch app/login/page.tsx app/register/page.tsx app/dashboard/page.tsx
touch app/forgot-password/page.tsx app/reset-password/page.tsx app/reset-password/reset-password-form.tsx
touch components/auth/GoogleLoginButton.tsx
touch drizzle.config.ts proxy.ts .env.local

echo "✅ Estructura creada!"`}
        />
        <p className="section-paragraph">La estructura final del proyecto queda así:</p>
        <CodeBlock
          code={`mi-app/
├── app/
│   ├── api/auth/[...all]/route.ts  ← TODAS las rutas de Better Auth (/api/auth/)
│   ├── login/page.tsx              ← Formulario de inicio de sesión
│   ├── register/page.tsx           ← Formulario de registro
│   ├── forgot-password/page.tsx    ← Solicitar enlace de recuperación (paso 6)
│   ├── reset-password/page.tsx     ← Nueva contraseña con token (paso 6)
│   │   └── reset-password-form.tsx ← Formulario de nueva contraseña (paso 6)
│   ├── dashboard/page.tsx          ← Página protegida
│   └── page.tsx                    ← (template)
├── actions/
│   └── auth.ts                     ← Server Actions (login, registro, logout, reset)
├── components/
│   └── auth/GoogleLoginButton.tsx  ← Botón de Google (paso 7)
├── lib/
│   ├── db/schema.ts                ← Tablas de Better Auth (Drizzle)
│   ├── db/index.ts                 ← Cliente de la base de datos
│   ├── auth/index.ts               ← Configuración de Better Auth
│   ├── auth-client.ts              ← Cliente para el frontend
│   └── session.ts                  ← Utilidad getSessionUser (paso 3)
├── proxy.ts                        ← Protección de rutas (Next 16)
├── drizzle.config.ts               ← Config de Drizzle CLI
└── .env.local                      ← Credenciales`}
        />
      </section>
    </>
  );
}
