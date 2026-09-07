
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + Supabase Auth</h1>
        <p className="content-subtitle">
          Login y registro con Supabase Auth (sin shadcn/ui)
        </p>
        <p className="text-gray-400 mt-4">
          Supabase es un <strong>Backend as a Service</strong>: te da Auth, una base
          PostgreSQL y Storage listos para usar. En esta guía usamos el SDK oficial{" "}
          <code>@supabase/ssr</code>, que maneja las sesiones con cookies
          automáticamente. <strong>Sin shadcn/ui</strong>: solo formularios nativos y
          Tailwind, como en el resto de esta plataforma. Te lleva desde{" "}
          <strong>cero</strong> hasta login + registro + dashboard protegido, con
          código listo para copiar y pegar.
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
            Un proyecto en <strong>Supabase</strong> (plan Free) –{' '}
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Crear cuenta</a>
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
          <span className="section-icon">🟢</span>
          2. Instalar los SDKs de Supabase
        </h2>
        <p className="section-paragraph">Instala <strong>solo</strong> estas dos dependencias:</p>
        <CommandBlock command="npm install @supabase/supabase-js @supabase/ssr" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong><br />
            • <code>@supabase/supabase-js</code>: el cliente base de Supabase.<br />
            • <code>@supabase/ssr</code>: integración para Next.js (App Router) que
            guarda la sesión en cookies automáticamente.<br />
            <br />
            <strong>No necesitas</strong> react-hook-form, zod, toast ni shadcn/ui:
            formularios nativos + estados de React.
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
New-Item -ItemType Directory -Path "lib/supabase" -Force
New-Item -ItemType Directory -Path "actions" -Force
New-Item -ItemType Directory -Path "app/login" -Force
New-Item -ItemType Directory -Path "app/register" -Force
New-Item -ItemType Directory -Path "app/dashboard" -Force
New-Item -ItemType Directory -Path "app/auth/callback" -Force
New-Item -ItemType Directory -Path "components/auth" -Force

# Crear archivos vacíos (los llenas en los próximos pasos)
New-Item -ItemType File -Path "lib/supabase/client.ts" -Force
New-Item -ItemType File -Path "lib/supabase/server.ts" -Force
New-Item -ItemType File -Path "lib/supabase/session.ts" -Force
New-Item -ItemType File -Path "actions/auth.ts" -Force
New-Item -ItemType File -Path "app/login/page.tsx" -Force
New-Item -ItemType File -Path "app/register/page.tsx" -Force
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path "app/auth/callback/route.ts" -Force
New-Item -ItemType File -Path "components/auth/GoogleLoginButton.tsx" -Force
New-Item -ItemType File -Path "proxy.ts" -Force
New-Item -ItemType File -Path ".env.local" -Force

Write-Host "✅ Estructura creada!" -ForegroundColor Green`}
          linuxCode={`# Crear carpetas
mkdir -p lib/supabase actions app/login app/register app/dashboard app/auth/callback components/auth

# Crear archivos vacíos (los llenas en los próximos pasos)
touch lib/supabase/client.ts lib/supabase/server.ts lib/supabase/session.ts
touch actions/auth.ts app/login/page.tsx app/register/page.tsx app/dashboard/page.tsx
touch app/auth/callback/route.ts components/auth/GoogleLoginButton.tsx
touch proxy.ts .env.local

echo "✅ Estructura creada!"`}
        />
        <p className="section-paragraph">La estructura final queda así:</p>
        <CodeBlock
          code={`mi-app/
├── app/
│   ├── auth/callback/route.ts       ← Recibe el retorno de OAuth/correos
│   ├── login/page.tsx               ← Login (Server Action)
│   ├── register/page.tsx            ← Registro (Server Action)
│   ├── dashboard/page.tsx           ← Página protegida
│   └── page.tsx                     ← (template, se adapta en el paso 5)
├── actions/
│   └── auth.ts                      ← Server Actions (login, registro, logout)
├── components/
│   └── auth/GoogleLoginButton.tsx   ← Botón de Google (paso 6)
├── lib/supabase/
│   ├── client.ts                    ← Cliente del navegador
│   ├── server.ts                    ← Cliente del servidor
│   └── session.ts                   ← Lee el usuario autenticado
├── proxy.ts                         ← Refresca sesión + protege rutas (Next 16)
└── .env.local                       ← Credenciales`}
        />
      </section>
    </>
  );
}
