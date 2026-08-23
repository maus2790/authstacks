import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + MongoDB</h1>
        <p className="content-subtitle">
          Guía paso a paso para crear una aplicación con Next.js, MongoDB y Tailwind CSS
        </p>
        <p className="text-gray-400 mt-4">
          Este manual te guiará desde <strong>cero</strong> hasta tener un sistema de autenticación
          completo con Next.js 16, MongoDB, Mongoose ODM y Tailwind CSS. Incluye
          <strong>todos los archivos</strong>, comandos PowerShell y explicaciones detalladas.
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
            <strong>MongoDB</strong> (local o Atlas) –{' '}
            <a href="https://www.mongodb.com/atlas" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">MongoDB Atlas (gratuito)</a>
          </li>
          <li>
            <strong>PowerShell</strong> (viene con Windows, o puedes usar cualquier terminal)
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
          <span>Selecciona las opciones por defecto cuando te pregunte durante la instalación.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🍃</span>
          2. Instalación de dependencias
        </h2>
        <p className="section-paragraph">Instala las dependencias necesarias:</p>
        <CommandBlock command="npm install mongoose bcryptjs jsonwebtoken zod react-hook-form @hookform/resolvers react-hot-toast lucide-react class-variance-authority clsx tailwind-merge" />
        <p className="section-paragraph">Dependencias de desarrollo:</p>
        <CommandBlock command="npm install -D @types/bcryptjs @types/jsonwebtoken @types/node" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong><br />
            • <code>mongoose</code>: ODM para MongoDB.<br />
            • <code>bcryptjs</code>: Hash de contraseñas.<br />
            • <code>jsonwebtoken</code>: Generación y verificación de JWT para sesiones.<br />
            • <code>zod</code>, <code>react-hook-form</code>: Formularios y validación.<br />
            • <code>react-hot-toast</code>: Notificaciones.<br />
            • <code>lucide-react</code>: Iconos.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📁</span>
          3. Estructura de Carpetas y Archivos
        </h2>
        <p className="section-paragraph">
          Crea la siguiente estructura de carpetas y archivos. Ejecuta los comandos según tu sistema operativo.
        </p>

        <h3 className="subsection-title">⚡ Comandos para crear la estructura</h3>
        <OsCommandTabs
          windowsCode={`# Crear carpetas
New-Item -ItemType Directory -Path "actions/auth" -Force
New-Item -ItemType Directory -Path "app/api/auth/session" -Force
New-Item -ItemType Directory -Path "app/dashboard" -Force
New-Item -ItemType Directory -Path "app/profile/components" -Force
New-Item -ItemType Directory -Path "components/auth" -Force
New-Item -ItemType Directory -Path "components/dashboard" -Force
New-Item -ItemType Directory -Path "components/ui" -Force
New-Item -ItemType Directory -Path "context" -Force
New-Item -ItemType Directory -Path "interfaces" -Force
New-Item -ItemType Directory -Path "lib/db" -Force
New-Item -ItemType Directory -Path "models" -Force
New-Item -ItemType Directory -Path "middleware" -Force

# Crear archivos
New-Item -ItemType File -Path "actions/auth/auth.ts" -Force
New-Item -ItemType File -Path "actions/auth/get-user.ts" -Force
New-Item -ItemType File -Path "actions/auth/update-profile.ts" -Force
New-Item -ItemType File -Path "app/api/auth/session/route.ts" -Force
New-Item -ItemType File -Path "app/dashboard/layout.tsx" -Force
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path "app/profile/page.tsx" -Force
New-Item -ItemType File -Path "app/profile/components/AccountForm.tsx" -Force
New-Item -ItemType File -Path "app/profile/components/UserProfile.tsx" -Force
New-Item -ItemType File -Path "components/auth/AuthForm.tsx" -Force
New-Item -ItemType File -Path "components/auth/SignInForm.tsx" -Force
New-Item -ItemType File -Path "components/auth/SignUpForm.tsx" -Force
New-Item -ItemType File -Path "components/auth/RecoverPasswordForm.tsx" -Force
New-Item -ItemType File -Path "components/dashboard/Header.tsx" -Force
New-Item -ItemType File -Path "components/dashboard/Sidebar.tsx" -Force
New-Item -ItemType File -Path "components/ui/Button.tsx" -Force
New-Item -ItemType File -Path "components/ui/Input.tsx" -Force
New-Item -ItemType File -Path "components/ui/Card.tsx" -Force
New-Item -ItemType File -Path "context/AuthContext.tsx" -Force
New-Item -ItemType File -Path "interfaces/user.ts" -Force
New-Item -ItemType File -Path "lib/db/index.ts" -Force
New-Item -ItemType File -Path "lib/db/models.ts" -Force
New-Item -ItemType File -Path "lib/auth.ts" -Force
New-Item -ItemType File -Path "lib/utils.ts" -Force
New-Item -ItemType File -Path "middleware.ts" -Force
New-Item -ItemType File -Path ".env.local" -Force

Write-Host "✅ Estructura creada!" -ForegroundColor Green`}
    linuxCode={`# Crear carpetas
mkdir -p actions/auth
mkdir -p app/api/auth/session
mkdir -p app/dashboard
mkdir -p app/profile/components
mkdir -p components/auth
mkdir -p components/dashboard
mkdir -p components/ui
mkdir -p context
mkdir -p interfaces
mkdir -p lib/db
mkdir -p models
mkdir -p middleware

# Crear archivos
touch actions/auth/auth.ts
touch actions/auth/get-user.ts
touch actions/auth/update-profile.ts
touch app/api/auth/session/route.ts
touch app/dashboard/layout.tsx
touch app/dashboard/page.tsx
touch app/profile/page.tsx
touch app/profile/components/AccountForm.tsx
touch app/profile/components/UserProfile.tsx
touch components/auth/AuthForm.tsx
touch components/auth/SignInForm.tsx
touch components/auth/SignUpForm.tsx
touch components/auth/RecoverPasswordForm.tsx
touch components/dashboard/Header.tsx
touch components/dashboard/Sidebar.tsx
touch components/ui/Button.tsx
touch components/ui/Input.tsx
touch components/ui/Card.tsx
touch context/AuthContext.tsx
touch interfaces/user.ts
touch lib/db/index.ts
touch lib/db/models.ts
touch lib/auth.ts
touch lib/utils.ts
touch middleware.ts
touch .env.local

echo "✅ Estructura creada!"`}
  />
      </section>
    </>
  );
}