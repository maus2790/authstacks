import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + Auth0</h1>
        <p className="content-subtitle">
          La plataforma de autenticación líder para empresas
        </p>
        <p className="text-gray-400 mt-4">
          Auth0 es la solución de autenticación más completa del mercado, utilizada por
          empresas como Atlassian, Mozilla y Siemens. Este manual te guiará desde
          <strong>cero</strong> hasta tener un sistema de autenticación empresarial
          completo con Next.js y Auth0.
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
            Una cuenta en <strong>Auth0</strong> (gratuita) –{' '}
            <a href="https://auth0.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Regístrate</a>
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
          <span className="section-icon">🏢</span>
          2. Instalación de Auth0
        </h2>
        <p className="section-paragraph">Instala el SDK de Auth0 para Next.js:</p>
        <CommandBlock command="npm install @auth0/nextjs-auth0" />
        <p className="section-paragraph">También necesitarás algunas utilidades para el frontend:</p>
        <CommandBlock command="npm install react-hook-form zod @hookform/resolvers react-hot-toast lucide-react class-variance-authority clsx tailwind-merge" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong><br />
            • <code>@auth0/nextjs-auth0</code>: SDK oficial de Auth0 para Next.js App Router.<br />
            • <code>react-hook-form</code>, <code>zod</code>: Formularios y validación.<br />
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
          Auth0 requiere una estructura mínima. Crea los siguientes archivos:
        </p>

        <h3 className="subsection-title">⚡ Comandos para crear la estructura</h3>
        <OsCommandTabs
          windowsCode={`# Crear carpetas
New-Item -ItemType Directory -Path "app/dashboard" -Force
New-Item -ItemType Directory -Path "app/profile" -Force
New-Item -ItemType Directory -Path "app/api/auth/[auth0]" -Force
New-Item -ItemType Directory -Path "components/ui" -Force
New-Item -ItemType Directory -Path "lib" -Force

# Crear archivos
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path "app/profile/page.tsx" -Force
New-Item -ItemType File -Path "app/api/auth/[auth0]/route.ts" -Force
New-Item -ItemType File -Path "components/ui/Button.tsx" -Force
New-Item -ItemType File -Path "components/ui/Input.tsx" -Force
New-Item -ItemType File -Path "components/ui/Card.tsx" -Force
New-Item -ItemType File -Path "lib/utils.ts" -Force
New-Item -ItemType File -Path "middleware.ts" -Force
New-Item -ItemType File -Path ".env.local" -Force

Write-Host "✅ Estructura creada!" -ForegroundColor Green`}
          linuxCode={`# Crear carpetas
mkdir -p app/dashboard
mkdir -p app/profile
mkdir -p "app/api/auth/[auth0]"
mkdir -p components/ui
mkdir -p lib

# Crear archivos
touch app/dashboard/page.tsx
touch app/profile/page.tsx
touch "app/api/auth/[auth0]/route.ts"
touch components/ui/Button.tsx
touch components/ui/Input.tsx
touch components/ui/Card.tsx
touch lib/utils.ts
touch middleware.ts
touch .env.local

echo "✅ Estructura creada!"`}
        />
        <p className="section-paragraph">
          Auth0 maneja automáticamente las páginas de login, registro y recuperación
          a través de su interfaz de Universal Login.
        </p>
      </section>
    </>
  );
}