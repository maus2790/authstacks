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
          Better Auth es una alternativa ligera y flexible a NextAuth.js, con soporte
          para múltiples bases de datos (Prisma, Drizzle, Kysely) y un sistema de plugins
          extensible. Este manual te guiará desde <strong>cero</strong> hasta tener un
          sistema de autenticación completo con Better Auth.
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
            Una base de datos (PostgreSQL, MySQL, SQLite). En esta guía usaremos <strong>Turso</strong> (SQLite) con Drizzle ORM.
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
          <span className="section-icon">✨</span>
          2. Instalación de Better Auth y Dependencias
        </h2>
        <p className="section-paragraph">Instala Better Auth y las dependencias necesarias:</p>
        <CommandBlock command="npm install better-auth @better-auth/drizzle @libsql/client drizzle-orm bcryptjs" />
        <p className="section-paragraph">Dependencias de desarrollo:</p>
        <CommandBlock command="npm install -D drizzle-kit @types/bcryptjs" />
        <p className="section-paragraph">También necesitarás utilidades para el frontend:</p>
        <CommandBlock command="npm install react-hook-form zod @hookform/resolvers react-hot-toast lucide-react class-variance-authority clsx tailwind-merge" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong><br />
            • <code>better-auth</code>: La biblioteca principal de autenticación.<br />
            • <code>@better-auth/drizzle</code>: Adaptador para Drizzle ORM.<br />
            • <code>bcryptjs</code>: Hash de contraseñas.<br />
            • <code>drizzle-orm</code> y <code>drizzle-kit</code>: ORM y CLI.<br />
            • <code>@libsql/client</code>: Cliente para Turso (SQLite).
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
New-Item -ItemType Directory -Path "lib/auth" -Force
New-Item -ItemType Directory -Path "context" -Force

# Crear archivos
New-Item -ItemType File -Path "actions/auth/auth.ts" -Force
New-Item -ItemType File -Path "actions/auth/get-user.ts" -Force
New-Item -ItemType File -Path "actions/auth/update-profile.ts" -Force
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path "app/profile/page.tsx" -Force
New-Item -ItemType File -Path "components/auth/SignInForm.tsx" -Force
New-Item -ItemType File -Path "components/auth/SignUpForm.tsx" -Force
New-Item -ItemType File -Path "components/dashboard/Header.tsx" -Force
New-Item -ItemType File -Path "components/dashboard/Sidebar.tsx" -Force
New-Item -ItemType File -Path "components/ui/Button.tsx" -Force
New-Item -ItemType File -Path "components/ui/Input.tsx" -Force
New-Item -ItemType File -Path "context/AuthContext.tsx" -Force
New-Item -ItemType File -Path "lib/db/index.ts" -Force
New-Item -ItemType File -Path "lib/db/schema.ts" -Force
New-Item -ItemType File -Path "lib/auth/index.ts" -Force
New-Item -ItemType File -Path "lib/auth/middleware.ts" -Force
New-Item -ItemType File -Path "lib/utils.ts" -Force
New-Item -ItemType File -Path "middleware.ts" -Force
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
mkdir -p lib/auth
mkdir -p context

# Crear archivos
touch actions/auth/auth.ts
touch actions/auth/get-user.ts
touch actions/auth/update-profile.ts
touch app/dashboard/page.tsx
touch app/profile/page.tsx
touch components/auth/SignInForm.tsx
touch components/auth/SignUpForm.tsx
touch components/dashboard/Header.tsx
touch components/dashboard/Sidebar.tsx
touch components/ui/Button.tsx
touch components/ui/Input.tsx
touch context/AuthContext.tsx
touch lib/db/index.ts
touch lib/db/schema.ts
touch lib/auth/index.ts
touch lib/auth/middleware.ts
touch lib/utils.ts
touch middleware.ts
touch .env.local
touch drizzle.config.ts

echo "✅ Estructura creada!"`}
        />
      </section>
    </>
  );
}