import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + Clerk</h1>
        <p className="content-subtitle">
          La forma más rápida de añadir autenticación completa a Next.js
        </p>
        <p className="text-gray-400 mt-4">
          Clerk es una solución de autenticación como servicio que proporciona componentes
          pre-construidos, manejo de sesiones, MFA y una integración extremadamente rápida.
          Este manual te guiará desde <strong>cero</strong> hasta tener un sistema de autenticación
          completo en minutos.
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
            Una cuenta en <strong>Clerk</strong> (gratuita) –{' '}
            <a href="https://clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Regístrate</a>
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
          <span className="section-icon">👤</span>
          2. Instalación de Clerk
        </h2>
        <p className="section-paragraph">Instala el paquete de Clerk para Next.js:</p>
        <CommandBlock command="npm install @clerk/nextjs" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>¿Qué es Clerk?</strong><br />
            Clerk es una plataforma de autenticación y gestión de usuarios que ofrece
            componentes listos para usar, manejo de sesiones, autenticación social,
            MFA y más. Se integra perfectamente con Next.js App Router.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📁</span>
          3. Estructura de Carpetas y Archivos
        </h2>
        <p className="section-paragraph">
          A diferencia de otros stacks, Clerk requiere muy pocos archivos manuales.
          La mayor parte de la autenticación está manejada por Clerk.
        </p>

        <h3 className="subsection-title">⚡ Comandos para crear la estructura</h3>
        <OsCommandTabs
          windowsCode={`# Crear carpetas principales
New-Item -ItemType Directory -Path "app/dashboard" -Force
New-Item -ItemType Directory -Path "app/profile" -Force
New-Item -ItemType Directory -Path "components/ui" -Force

# Crear archivos básicos
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path "app/profile/page.tsx" -Force
New-Item -ItemType File -Path "components/ui/Button.tsx" -Force
New-Item -ItemType File -Path "middleware.ts" -Force
New-Item -ItemType File -Path ".env.local" -Force

Write-Host "✅ Estructura creada!" -ForegroundColor Green`}
          linuxCode={`# Crear carpetas principales
mkdir -p app/dashboard
mkdir -p app/profile
mkdir -p components/ui

# Crear archivos básicos
touch app/dashboard/page.tsx
touch app/profile/page.tsx
touch components/ui/Button.tsx
touch middleware.ts
touch .env.local

echo "✅ Estructura creada!"`}
        />
        <p className="section-paragraph">
          Clerk automáticamente maneja las páginas de login, registro y recuperación,
          por lo que no necesitas crearlas manualmente a menos que quieras personalizarlas.
        </p>
      </section>
    </>
  );
}