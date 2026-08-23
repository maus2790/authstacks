import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + Lucia Auth</h1>
        <p className="content-subtitle">
          Una biblioteca de autenticación minimalista y moderna
        </p>
        <p className="text-gray-400 mt-4">
          Lucia te permite construir autenticación completa con control total sobre tu base de datos.
          Es independiente del ORM que uses (Prisma, Drizzle, Kysely, etc.) y te da flexibilidad absoluta.
          Este manual te guiará desde <strong>cero</strong> hasta tener un sistema de autenticación
          completo con Lucia, usando Drizzle ORM y PostgreSQL (puedes adaptarlo a cualquier base de datos).
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📌</span>
          Requisitos previos
        </h2>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>
            <strong>Node.js</strong> (versión 18 o superior) –{' '}
            <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Descargar</a>
          </li>
          <li>
            Una base de datos (PostgreSQL, MySQL, SQLite). En esta guía usaremos <strong>Turso</strong> (SQLite) por simplicidad.
          </li>
          <li>
            Conocimientos de Drizzle ORM (usaremos Drizzle para el ejemplo).
          </li>
        </ul>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          1. Instalación del Proyecto Next.js
        </h2>
        <p className="section-paragraph">Crea un nuevo proyecto Next.js:</p>
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
          2. Instalación de Lucia y Dependencias
        </h2>
        <p className="section-paragraph">Instala Lucia y las dependencias necesarias:</p>
        <CommandBlock command="npm install lucia @lucia-auth/adapter-drizzle arctic bcryptjs" />
        <p className="section-paragraph">Dependencias de desarrollo:</p>
        <CommandBlock command="npm install -D drizzle-kit @types/bcryptjs @libsql/client" />
        <p className="section-paragraph">Además, necesitas instalar el cliente de base de datos (en este caso, Turso):</p>
        <CommandBlock command="npm install @libsql/client" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong><br />
            • <code>lucia</code>: La biblioteca principal de autenticación.<br />
            • <code>@lucia-auth/adapter-drizzle</code>: Adaptador para Drizzle ORM.<br />
            • <code>arctic</code>: Biblioteca para OAuth (Google, GitHub, etc.).<br />
            • <code>bcryptjs</code>: Hash de contraseñas.<br />
            • <code>drizzle-kit</code>: Herramienta de migración de Drizzle.<br />
            • <code>@libsql/client</code>: Cliente para Turso.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📁</span>
          3. Estructura de Carpetas y Archivos
        </h2>
        <p className="section-paragraph">
          Crea la siguiente estructura de carpetas y archivos:
        </p>

        <h3 className="subsection-title">⚡ Comandos para crear la estructura</h3>
        <OsCommandTabs
          windowsCode={`# Crear carpetas
New-Item -ItemType Directory -Path "actions/auth" -Force
New-Item -ItemType Directory -Path "app/dashboard" -Force
New-Item -ItemType Directory -Path "app/profile" -Force
New-Item -ItemType Directory -Path "components/auth" -Force
New-Item -ItemType Directory -Path "components/dashboard" -Force
New-Item -ItemType Directory -Path "components/ui" -Force
New-Item -ItemType Directory -Path "lib/db" -Force
New-Item -ItemType Directory -Path "context" -Force
New-Item -ItemType Directory -Path "types" -Force

# Crear archivos
New-Item -ItemType File -Path "actions/auth/auth.ts" -Force
New-Item -ItemType File -Path "actions/auth/get-user.ts" -Force
New-Item -ItemType File -Path "actions/auth/update-profile.ts" -Force
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path "app/profile/page.tsx" -Force
New-Item -ItemType File -Path "components/auth/SignInForm.tsx" -Force
New-Item -ItemType File -Path "components/auth/SignUpForm.tsx" -Force
New-Item -ItemType File -Path "components/auth/RecoverPasswordForm.tsx" -Force
New-Item -ItemType File -Path "components/dashboard/Header.tsx" -Force
New-Item -ItemType File -Path "components/dashboard/Sidebar.tsx" -Force
New-Item -ItemType File -Path "components/ui/Button.tsx" -Force
New-Item -ItemType File -Path "components/ui/Input.tsx" -Force
New-Item -ItemType File -Path "components/ui/Card.tsx" -Force
New-Item -ItemType File -Path "context/AuthContext.tsx" -Force
New-Item -ItemType File -Path "lib/db/index.ts" -Force
New-Item -ItemType File -Path "lib/db/schema.ts" -Force
New-Item -ItemType File -Path "lib/lucia.ts" -Force
New-Item -ItemType File -Path "lib/utils.ts" -Force
New-Item -ItemType File -Path "middleware.ts" -Force
New-Item -ItemType File -Path "types/index.ts" -Force
New-Item -ItemType File -Path ".env.local" -Force
New-Item -ItemType File -Path "drizzle.config.ts" -Force

Write-Host "✅ Estructura creada!" -ForegroundColor Green`}
    linuxCode={`# Crear carpetas
mkdir -p actions/auth
mkdir -p app/dashboard
mkdir -p app/profile
mkdir -p components/auth
mkdir -p components/dashboard
mkdir -p components/ui
mkdir -p lib/db
mkdir -p context
mkdir -p types

# Crear archivos
touch actions/auth/auth.ts
touch actions/auth/get-user.ts
touch actions/auth/update-profile.ts
touch app/dashboard/page.tsx
touch app/profile/page.tsx
touch components/auth/SignInForm.tsx
touch components/auth/SignUpForm.tsx
touch components/auth/RecoverPasswordForm.tsx
touch components/dashboard/Header.tsx
touch components/dashboard/Sidebar.tsx
touch components/ui/Button.tsx
touch components/ui/Input.tsx
touch components/ui/Card.tsx
touch context/AuthContext.tsx
touch lib/db/index.ts
touch lib/db/schema.ts
touch lib/lucia.ts
touch lib/utils.ts
touch middleware.ts
touch types/index.ts
touch .env.local
touch drizzle.config.ts

echo "✅ Estructura creada!"`}
  />
      </section>
    </>
  );
}