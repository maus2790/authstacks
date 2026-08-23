import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + Supabase: Login Completo</h1>
        <p className="content-subtitle">
          Guía paso a paso para crear una aplicación con Next.js, Shadcn/UI y Supabase
        </p>
        <p className="text-gray-400 mt-4">
          Este manual te guiará desde <strong>cero</strong> hasta tener un sistema de autenticación
          completo con Next.js 16, Supabase, Shadcn/UI y Tailwind CSS. Incluye <strong>todos los
          archivos</strong>, comandos PowerShell y explicaciones detalladas.
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
            <strong>PowerShell</strong> (viene con Windows, o puedes usar cualquier terminal)
          </li>
          <li>
            Una cuenta en <strong>Supabase</strong> (gratuita) –{' '}
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Regístrate</a>
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
          <span>Selecciona las opciones por defecto cuando te pregunte durante la instalación</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎨</span>
          2. Instalación de Shadcn/UI
        </h2>
        <p className="section-paragraph">
          <strong>Shadcn/UI</strong> es una biblioteca de componentes moderna y personalizable.
        </p>
        <p className="section-paragraph">Documentación oficial:</p>
        <CodeBlock code="https://ui.shadcn.com/docs/installation/next" />

        <h3 className="subsection-title">Iniciar instalación:</h3>
        <CommandBlock command="npx shadcn@latest init" />

        <p className="section-paragraph">Cuando pregunte:</p>
        <CodeBlock code={`Need to install the following packages:
shadcn@4.0.2
Ok to proceed? (y)`} />
        <p className="section-note">Presiona <strong>y</strong> o <strong>yes</strong> para continuar.</p>

        <div className="two-columns">
          <div className="column">
            <h4 className="option-title">
              <span className="option-icon">🔘</span>
              Selecciona Radix:
            </h4>
            <div className="option-display">
              <span className="option-prompt">Select a component library</span>
              <span className="option-selected">› Radix</span>
            </div>
          </div>
          <div className="column">
            <h4 className="option-title">
              <span className="option-icon">🎯</span>
              Selecciona Vega:
            </h4>
            <div className="option-display">
              <span className="option-prompt">Which preset would you like to use?</span>
              <span className="option-selected">› Vega</span>
            </div>
          </div>
        </div>

        <p className="section-paragraph">Agrega los componentes UI necesarios:</p>
        <CommandBlock command="npx shadcn@latest add avatar badge button card dialog input label skeleton table" />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📁</span>
          3. Estructura de Carpetas y Archivos
        </h2>
        <p className="section-paragraph">
          Necesitas crear la siguiente estructura de carpetas y archivos. Ejecuta los comandos
          según tu sistema operativo.
        </p>

        <h3 className="subsection-title">⚡ Comandos para crear la estructura</h3>

        <OsCommandTabs
          windowsCode={`# Crear estructura de carpetas
New-Item -ItemType Directory -Path "actions/auth" -Force
New-Item -ItemType Directory -Path "app/api/auth/callback" -Force
New-Item -ItemType Directory -Path "app/api/auth/signout" -Force
New-Item -ItemType Directory -Path "app/dashboard" -Force
New-Item -ItemType Directory -Path "app/profile/components" -Force
New-Item -ItemType Directory -Path "app/update-password" -Force
New-Item -ItemType Directory -Path "components/auth" -Force
New-Item -ItemType Directory -Path "components/dashboard" -Force
New-Item -ItemType Directory -Path "components/ui" -Force
New-Item -ItemType Directory -Path "context" -Force
New-Item -ItemType Directory -Path "interfaces" -Force
New-Item -ItemType Directory -Path "lib/supabase" -Force

# Crear archivos de autenticación en actions/auth
New-Item -ItemType File -Path "actions/auth/auth.ts" -Force
New-Item -ItemType File -Path "actions/auth/get-user.ts" -Force
New-Item -ItemType File -Path "actions/auth/update-avatar.ts" -Force
New-Item -ItemType File -Path "actions/auth/update-profile.ts" -Force

# Crear archivos de API
New-Item -ItemType File -Path "app/api/auth/callback/route.ts" -Force
New-Item -ItemType File -Path "app/api/auth/signout/route.ts" -Force

# Crear páginas y layouts
New-Item -ItemType File -Path "app/dashboard/layout.tsx" -Force
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path "app/profile/page.tsx" -Force
New-Item -ItemType File -Path "app/update-password/page.tsx" -Force

# Crear componentes de perfil en profile/components
New-Item -ItemType File -Path "app/profile/components/AccountForm.tsx" -Force
New-Item -ItemType File -Path "app/profile/components/UserProfile.tsx" -Force

# Crear componentes de autenticación
New-Item -ItemType File -Path "components/auth/AuthForm.tsx" -Force
New-Item -ItemType File -Path "components/auth/RecoverPasswordForm.tsx" -Force
New-Item -ItemType File -Path "components/auth/SignInForm.tsx" -Force
New-Item -ItemType File -Path "components/auth/SignUpForm.tsx" -Force
New-Item -ItemType File -Path "components/auth/UpdatePasswordForm.tsx" -Force

# Crear componentes de dashboard
New-Item -ItemType File -Path "components/dashboard/Header.tsx" -Force
New-Item -ItemType File -Path "components/dashboard/Sidebar.tsx" -Force

# Crear componentes UI personalizados
New-Item -ItemType File -Path "components/ui/form.tsx" -Force

# Crear componentes personalizados (en components/)
New-Item -ItemType File -Path "components/AvatarBadge.tsx" -Force
New-Item -ItemType File -Path "components/PhoneInput.tsx" -Force

# Crear archivos de Context e Interfaces
New-Item -ItemType File -Path "context/AuthContext.tsx" -Force
New-Item -ItemType File -Path "interfaces/user.ts" -Force

# Crear archivos de Supabase
New-Item -ItemType File -Path "lib/supabase/client.ts" -Force
New-Item -ItemType File -Path "lib/supabase/server.ts" -Force
New-Item -ItemType File -Path "lib/supabase/proxy.ts" -Force

# Crear archivos de configuración
New-Item -ItemType File -Path ".env.local" -Force
New-Item -ItemType File -Path "proxy.ts" -Force

Write-Host "✅ Estructura de carpetas y archivos creada exitosamente!" -ForegroundColor Green`}
          linuxCode={`# Crear estructura de carpetas
mkdir -p actions/auth
mkdir -p app/api/auth/callback
mkdir -p app/api/auth/signout
mkdir -p app/dashboard
mkdir -p app/profile/components
mkdir -p app/update-password
mkdir -p components/auth
mkdir -p components/dashboard
mkdir -p components/ui
mkdir -p context
mkdir -p interfaces
mkdir -p lib/supabase

# Crear archivos
touch actions/auth/auth.ts
touch actions/auth/get-user.ts
touch actions/auth/update-avatar.ts
touch actions/auth/update-profile.ts
touch app/api/auth/callback/route.ts
touch app/api/auth/signout/route.ts
touch app/dashboard/layout.tsx
touch app/dashboard/page.tsx
touch app/profile/page.tsx
touch app/update-password/page.tsx
touch app/profile/components/AccountForm.tsx
touch app/profile/components/UserProfile.tsx
touch components/auth/AuthForm.tsx
touch components/auth/RecoverPasswordForm.tsx
touch components/auth/SignInForm.tsx
touch components/auth/SignUpForm.tsx
touch components/auth/UpdatePasswordForm.tsx
touch components/dashboard/Header.tsx
touch components/dashboard/Sidebar.tsx
touch components/ui/form.tsx
touch components/AvatarBadge.tsx
touch components/PhoneInput.tsx
touch context/AuthContext.tsx
touch interfaces/user.ts
touch lib/supabase/client.ts
touch lib/supabase/server.ts
touch lib/supabase/proxy.ts
touch .env.local
touch proxy.ts

echo "✅ Estructura de carpetas y archivos creada exitosamente!"`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          4. Instalación de dependencias
        </h2>
        <p className="section-paragraph">Instala las dependencias necesarias:</p>
        <CommandBlock command="npm install @supabase/supabase-js @supabase/ssr react-hook-form zod @hookform/resolvers react-hot-toast lucide-react" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong><br />
            • <code>@supabase/supabase-js</code> y <code>@supabase/ssr</code>: Cliente de Supabase para Next.js.<br />
            • <code>react-hook-form</code>, <code>zod</code>, <code>@hookform/resolvers</code>: Formularios y validación.<br />
            • <code>react-hot-toast</code>: Notificaciones.<br />
            • <code>lucide-react</code>: Iconos.
          </span>
        </div>
      </section>
    </>
  );
}