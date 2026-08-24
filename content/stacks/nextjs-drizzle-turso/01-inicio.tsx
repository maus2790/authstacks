"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";
import { X, ChevronDown, ChevronUp, Info } from "lucide-react";

export default function Inicio() {
  // Estado para el acordeón: expandido por defecto
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + Drizzle + Turso</h1>
        <p className="content-subtitle">
          Autenticación completa con ORM tipo-safe y base de datos edge
        </p>
        <p className="text-gray-400 mt-4">
          Este manual te guiará desde <strong>cero</strong> hasta tener un sistema de autenticación
          completo y funcional con Next.js 16 (App Router), TypeScript, Turso, Drizzle ORM, Resend y
          Tailwind CSS. Incluye <strong>todos los archivos</strong>, comandos PowerShell y
          explicaciones detalladas. No se omite absolutamente nada.
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📌</span>
          Requisitos previos
        </h2>
        <p className="section-paragraph">Antes de comenzar, asegúrate de tener instalado:</p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>
            <strong>Node.js</strong> (versión 18 o superior) –{' '}
            <a
              href="https://nodejs.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Descargar
            </a>
          </li>
          <li>
            <strong>PowerShell</strong> (viene con Windows, o puedes usar cualquier terminal)
          </li>
          <li>
            Una cuenta en <strong>Turso</strong> (gratuita) –{' '}
            <a
              href="https://turso.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Regístrate
            </a>
          </li>
          <li>
            Una cuenta en <strong>Resend</strong> (gratuita) –{' '}
            <a
              href="https://resend.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Regístrate
            </a>
          </li>
        </ul>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          ETAPA 1: Creación del proyecto y estructura de carpetas
        </h2>
        <p className="section-paragraph">
          <strong>Objetivo:</strong> Crear el proyecto Next.js con TypeScript, Tailwind y App Router,
          y generar toda la estructura de carpetas y archivos necesarios.
        </p>
        <p className="section-paragraph">Comandos PowerShell (ejecutar en orden):</p>
        <CommandBlock command="npx create-next-app@latest app-general --typescript --tailwind --app --no-src-dir" />
        <CommandBlock command="cd app-general" />
        <p className="section-paragraph">Crear todas las carpetas y archivos necesarios (selecciona tu sistema operativo):</p>
        <OsCommandTabs
          windowsCode={`# Crear todas las carpetas
New-Item -ItemType Directory -Force -Path "app\\(auth)\\login", "app\\(auth)\\register", "app\\(auth)\\forgot-password", "app\\(auth)\\reset-password\\[token]"
New-Item -ItemType Directory -Force -Path "app\\(dashboard)\\dashboard", "app\\(dashboard)\\profile"
New-Item -ItemType Directory -Force -Path "app\\actions", "app\\api\\auth\\verify-email", "app\\api\\auth\\reset-password"
New-Item -ItemType Directory -Force -Path "app\\components\\ui", "app\\components\\auth"
New-Item -ItemType Directory -Force -Path "app\\hooks"
New-Item -ItemType Directory -Force -Path "lib\\db", "scripts", "types", "drizzle"

# Crear todos los archivos vacíos (los llenaremos en etapas posteriores)
$files = @(
    ".env",
    ".gitignore",
    "drizzle.config.ts",
    "tailwind.config.ts",
    "middleware.ts",
    "next.config.ts",
    "app\\layout.tsx",
    "app\\page.tsx",
    "app\\globals.css",
    "app\\(auth)\\layout.tsx",
    "app\\(auth)\\login\\page.tsx",
    "app\\(auth)\\register\\page.tsx",
    "app\\(auth)\\forgot-password\\page.tsx",
    "app\\(auth)\\reset-password\\[token]\\page.tsx",
    "app\\(dashboard)\\layout.tsx",
    "app\\(dashboard)\\dashboard\\page.tsx",
    "app\\(dashboard)\\profile\\page.tsx",
    "app\\actions\\auth.ts",
    "app\\actions\\rate-limit.ts",
    "app\\api\\auth\\verify-email\\route.ts",
    "app\\api\\auth\\reset-password\\route.ts",
    "app\\components\\ui\\Button.tsx",
    "app\\components\\ui\\Input.tsx",
    "app\\components\\ui\\Card.tsx",
    "app\\components\\ui\\Spinner.tsx",
    "app\\components\\auth\\LoginForm.tsx",
    "app\\components\\auth\\RegisterForm.tsx",
    "app\\hooks\\useAuth.ts",
    "lib\\db\\index.ts",
    "lib\\db\\schema.ts",
    "lib\\auth.ts",
    "lib\\password.ts",
    "lib\\mail.ts",
    "lib\\logger.ts",
    "lib\\utils.ts",
    "types\\index.ts",
    "scripts\\seed.ts"
)

foreach ($file in $files) {
    New-Item -ItemType File -Force -Path $file
}`}
          linuxCode={`# Crear todas las carpetas
mkdir -p "app/(auth)/login" "app/(auth)/register" "app/(auth)/forgot-password" "app/(auth)/reset-password/[token]"
mkdir -p "app/(dashboard)/dashboard" "app/(dashboard)/profile"
mkdir -p "app/actions" "app/api/auth/verify-email" "app/api/auth/reset-password"
mkdir -p "app/components/ui" "app/components/auth"
mkdir -p "app/hooks"
mkdir -p "lib/db" "scripts" "types" "drizzle"

# Crear todos los archivos vacíos (los llenaremos en etapas posteriores)
touch .env .gitignore drizzle.config.ts middleware.ts next.config.ts
touch "app/layout.tsx" "app/page.tsx" "app/globals.css"
touch "app/(auth)/layout.tsx" "app/(auth)/login/page.tsx" "app/(auth)/register/page.tsx"
touch "app/(auth)/forgot-password/page.tsx" "app/(auth)/reset-password/[token]/page.tsx"
touch "app/(dashboard)/layout.tsx" "app/(dashboard)/dashboard/page.tsx" "app/(dashboard)/profile/page.tsx"
touch "app/actions/auth.ts" "app/actions/rate-limit.ts"
touch "app/api/auth/verify-email/route.ts" "app/api/auth/reset-password/route.ts"
touch "app/components/ui/Button.tsx" "app/components/ui/Input.tsx" "app/components/ui/Card.tsx" "app/components/ui/Spinner.tsx"
touch "app/components/auth/LoginForm.tsx" "app/components/auth/RegisterForm.tsx"
touch "app/hooks/useAuth.ts"
touch "lib/db/index.ts" "lib/db/schema.ts"
touch "lib/auth.ts" "lib/password.ts" "lib/mail.ts" "lib/logger.ts" "lib/utils.ts"
touch "types/index.ts" "scripts/seed.ts"

echo "✅ Estructura creada exitosamente!"`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>Esta estructura es la base del proyecto. Todos los archivos se irán llenando en las siguientes etapas.</span>
        </div>
        <p className="section-paragraph">Estructura resultante del proyecto:</p>
        <CodeBlock
          language="bash"
          code={`app-general/
├── .env
├── .gitignore
├── drizzle.config.ts
├── middleware.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── [token]/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── actions/
│   │   ├── auth.ts
│   │   └── rate-limit.ts
│   ├── api/
│   │   └── auth/
│   │       ├── verify-email/
│   │       │   └── route.ts
│   │       └── reset-password/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Spinner.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── RegisterForm.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── db/
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── auth.ts
│   ├── password.ts
│   ├── mail.ts
│   ├── logger.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── drizzle/
└── scripts/
    └── seed.ts`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          ETAPA 2: Instalación de dependencias
        </h2>
        <p className="section-paragraph">
          <strong>Objetivo:</strong> Instalar todas las dependencias necesarias para el proyecto.
        </p>
        <p className="section-paragraph">Dependencias de producción:</p>
        <CommandBlock command="npm install @libsql/client drizzle-orm bcryptjs zod react-hook-form @hookform/resolvers react-hot-toast lucide-react class-variance-authority clsx tailwind-merge resend" />
        <p className="section-paragraph">Dependencias de desarrollo:</p>
        <CommandBlock command="npm install -D drizzle-kit @types/bcryptjs dotenv tsx @types/node @tailwindcss/postcss" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong> <br />
            • <code>@libsql/client</code>: Cliente para Turso. <br />
            • <code>drizzle-orm</code>: ORM para base de datos tipada. <br />
            • <code>bcryptjs</code>: Hash de contraseñas. <br />
            • <code>zod</code>: Validación de datos. <br />
            • <code>react-hook-form</code> + <code>@hookform/resolvers</code>: Manejo de formularios. <br />
            • <code>react-hot-toast</code>: Notificaciones elegantes. <br />
            • <code>lucide-react</code>: Iconos. <br />
            • <code>class-variance-authority</code>, <code>clsx</code>, <code>tailwind-merge</code>: Utilidades para estilos. <br />
            • <code>resend</code>: Cliente para correos electrónicos. <br />
            • <code>drizzle-kit</code>: Herramienta de migración. <br />
            • <code>dotenv</code>: Carga de variables de entorno. <br />
            • <code>tsx</code>: Ejecución de TypeScript. <br />
            • <code>@tailwindcss/postcss</code>: Plugin de Tailwind para PostCSS (necesario para Next.js 16).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">⚙️</span>
          ETAPA 3: Configuración de variables de entorno, Drizzle y Tailwind
        </h2>

        <h3 className="subsection-title">3.1. Variables de entorno (<code>.env</code>)</h3>
        <p className="section-paragraph">
          Abre el archivo <code>.env</code> y pega el siguiente contenido, reemplazando los
          valores con los tuyos:
        </p>
        <CodeBlock
          code={`TURSO_DATABASE_URL="libsql://<nombre-base>.turso.io"
TURSO_AUTH_TOKEN="<token-de-acceso>"
APP_URL="http://localhost:3000"

# Resend
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxx"   # Obtener en https://resend.com/api-keys
EMAIL_FROM="onboarding@resend.dev"        # O usa tu dominio verificado`}
        />

        <h4 className="subsection-title" style={{ marginTop: '1.5rem' }}>
          3.1.1. Obtención de variables de entorno
          <button
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="ml-3 text-blue-400 hover:text-blue-300 transition-colors"
            aria-label={isGuideOpen ? "Ocultar guía" : "Mostrar guía"}
          >
            {isGuideOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </h4>

        <p className="section-paragraph">
          A continuación, se detalla cómo obtener las credenciales necesarias para Turso y Resend.
          {!isGuideOpen && (
            <span className="text-blue-400 ml-2 cursor-pointer" onClick={() => setIsGuideOpen(true)}>
              Mostrar guía completa
            </span>
          )}
        </p>

        {isGuideOpen && (
          <div className="space-y-6">
            <h5 className="subsection-title" style={{ fontSize: '1.1rem', marginTop: '1rem' }}>🔷 Turso</h5>
            <ol className="list-decimal pl-6 text-gray-300 space-y-4">
              <li>
                <p><strong>Crear una base de datos</strong></p>
                <p>Accede a tu cuenta de Turso y haz clic en el botón para crear una nueva base de datos.</p>
                <img
                  src="/images/turso/img1.png"
                  alt="Crear base de datos en Turso"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
              </li>
              <li>
                <p><strong>Configurar la base de datos</strong></p>
                <p>Selecciona <strong>"New Database"</strong>, asigna un nombre a la base de datos, elige el grupo por defecto y haz clic en <strong>"Create Database"</strong>.</p>
                <img
                  src="/images/turso/img2.png"
                  alt="Formulario de creación de base de datos en Turso"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
              </li>
              <li>
                <p><strong>Generar un token de acceso</strong></p>
                <p>Una vez creada la base de datos, serás redirigido a la pestaña <strong>"Overview"</strong>. En la sección <strong>"Connect"</strong>, haz clic en <strong>"Create Token"</strong>.</p>
                <img
                  src="/images/turso/img3.png"
                  alt="Sección Connect de Turso"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
              </li>
              <li>
                <p><strong>Configurar el token</strong></p>
                <p>Se abrirá un modal. Mantén las opciones por defecto, selecciona la duración del token y el nivel de autorización <strong>"Read & Write"</strong>, luego haz clic en <strong>"Create Token"</strong>.</p>
                <img
                  src="/images/turso/img4.png"
                  alt="Modal de creación de token en Turso"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
              </li>
              <li>
                <p><strong>Copiar las credenciales</strong></p>
                <p>Finalmente, obtendrás las dos variables de entorno necesarias:</p>
                <ul className="list-disc pl-6 text-gray-300 space-y-1 mt-2">
                  <li><code>TURSO_DATABASE_URL</code></li>
                  <li><code>TURSO_AUTH_TOKEN</code></li>
                </ul>
                <p>Copíalas y pégalas en tu archivo <code>.env</code>.</p>
                <img
                  src="/images/turso/img5.png"
                  alt="Credenciales de Turso en el panel"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
              </li>
            </ol>

            <h5 className="subsection-title" style={{ fontSize: '1.1rem', marginTop: '1.5rem' }}>📧 Resend</h5>
            <ol className="list-decimal pl-6 text-gray-300 space-y-4">
              <li>
                <p><strong>Acceder a la sección API Keys</strong></p>
                <p>En el panel lateral de Resend, ve a la sección <strong>"API Keys"</strong> y haz clic en <strong>"Create API Key"</strong>.</p>
                <img
                  src="/images/resend/img6.png"
                  alt="Sección API Keys en Resend"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
              </li>
              <li>
                <p><strong>Crear la API Key</strong></p>
                <p>Completa el formulario con el nombre que desees, mantén las opciones por defecto y haz clic en <strong>"Add"</strong>.</p>
                <img
                  src="/images/resend/img7.png"
                  alt="Formulario de creación de API Key en Resend"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
              </li>
              <li>
                <p><strong>Copiar la clave</strong></p>
                <p>Obtendrás la API Key. Cópiala y pégala en tu archivo <code>.env</code>.</p>
                <p>Además, el <strong>EMAIL_FROM</strong> será el nombre de tu API Key seguido de <code>@resend.dev</code> (ej. <code>prueba@resend.dev</code>).</p>
                <img
                  src="/images/resend/img8.png"
                  alt="API Key generada en Resend"
                  className="rounded-lg border border-gray-700 my-2 max-w-full"
                />
              </li>
            </ol>

            <div className="flex items-center gap-2">
              <span
                className="text-blue-400 underline cursor-pointer hover:text-blue-300 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                <Info size={16} className="inline mr-1" />
                Más información de la plataforma
              </span>
              <span className="text-gray-500 text-sm">(planes, precios y limitaciones)</span>
            </div>

            <div className="tip">
              <span className="tip-icon">💡</span>
              <span>
                Recuerda que las variables de entorno son sensibles. No las subas a tu repositorio de control de versión.
                Asegúrate de tener el archivo <code>.env</code> en tu <code>.gitignore</code>.
              </span>
            </div>
          </div>
        )}

        <h3 className="subsection-title" style={{ marginTop: '2rem' }}>3.2. Configuración de Drizzle (<code>drizzle.config.ts</code>)</h3>
        <CodeBlock
          code={`import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  out: "./drizzle",
});`}
        />

        <h3 className="subsection-title">3.3. Configuración de Tailwind (<code>postcss.config.mjs</code>)</h3>
        <p className="section-paragraph">
          <strong>Importante:</strong> En Next.js 16, el plugin de Tailwind debe ser{' '}
          <code>@tailwindcss/postcss</code>.
        </p>
        <CodeBlock
          code={`/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;`}
        />

        <h3 className="subsection-title">3.4. <code>tailwind.config.ts</code></h3>
        <CodeBlock
          code={`import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;`}
        />

        <h3 className="subsection-title">3.5. <code>next.config.ts</code></h3>
        <CodeBlock
          code={`import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;`}
        />

        <h3 className="subsection-title">3.6. <code>package.json</code> (actualizar scripts)</h3>
        <p className="section-paragraph">
          Abre <code>package.json</code> y en la sección <code>&quot;scripts&quot;</code> agrega:
        </p>
        <CodeBlock
          code={`"db:generate": "drizzle-kit generate",
"db:push": "drizzle-kit push",
"seed": "tsx scripts/seed.ts"`}
        />
        <p className="section-paragraph">
          El <code>package.json</code> debe verse así:
        </p>
        <CodeBlock
          code={`{
  "name": "app-general",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "seed": "tsx scripts/seed.ts"
  },
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  }
}`}
        />
      </section>

{/* Modal de información de plataformas */}
{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
    <div className="bg-card rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl" onClick={(e) => e.stopPropagation()}>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Info size={24} className="text-blue-400" />
          Información de plataformas y límites
        </h2>

        <button
          onClick={() => setIsModalOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6 space-y-10">

        {/* ========================================================= */}
        {/* INTRODUCCIÓN */}
        {/* ========================================================= */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
          <div className="flex gap-3">
            <Info className="text-blue-400 shrink-0 mt-0.5" size={22} />

            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                ¿Qué significan estos límites?
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Los límites de una plataforma representan la cantidad de recursos
                incluidos en cada plan. No todos los límites funcionan de la misma
                manera: algunos son límites mensuales, otros diarios y otros
                corresponden al almacenamiento o a la cantidad de operaciones.
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Alcanzar un límite no significa necesariamente que la aplicación
                se detenga inmediatamente. El comportamiento depende del recurso
                utilizado y de las condiciones específicas del proveedor.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TIPOS DE LIMITES */}
        {/* ========================================================= */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Tipos de límites
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-green-400 font-semibold mb-2">
                🟢 Límite incluido
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Es la cantidad de recursos incluida en el precio del plan.
                Mientras el consumo permanezca dentro de este límite, no se
                generan cargos adicionales por ese recurso.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-yellow-400 font-semibold mb-2">
                🟡 Cerca del límite
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                La aplicación continúa funcionando, pero el administrador debería
                revisar el consumo y evaluar si es necesario optimizar consultas,
                almacenamiento o actualizar el plan.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-red-400 font-semibold mb-2">
                🔴 Límite alcanzado
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Dependiendo del servicio, determinadas operaciones pueden ser
                rechazadas, limitadas, pausadas o generar cargos adicionales.
                Por eso es importante controlar el consumo antes de llegar al
                límite.
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* TURSO */}
        {/* ========================================================= */}
        <section>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
              🔷 Turso
            </h3>

            <a
              href="https://turso.tech/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground underline hover:text-foreground"
            >
              Página oficial
            </a>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            Turso se utiliza como infraestructura de base de datos. Los límites
            principales están relacionados con almacenamiento, lecturas,
            escrituras, sincronización y cantidad de bases de datos.
          </p>

          {/* Tabla */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[900px] text-sm text-left">

              <thead className="bg-muted">
                <tr>
                  <th className="p-3 border-b border-border">Plan</th>
                  <th className="p-3 border-b border-border">Precio/mes</th>
                  <th className="p-3 border-b border-border">Bases de datos</th>
                  <th className="p-3 border-b border-border">Almacenamiento</th>
                  <th className="p-3 border-b border-border">Lecturas</th>
                  <th className="p-3 border-b border-border">Escrituras</th>
                  <th className="p-3 border-b border-border">Sincronización</th>
                </tr>
              </thead>

              <tbody>

                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">Gratis</td>
                  <td className="p-3">$0</td>
                  <td className="p-3">100</td>
                  <td className="p-3">5 GB</td>
                  <td className="p-3">500M</td>
                  <td className="p-3">10M</td>
                  <td className="p-3">3 GB</td>
                </tr>

                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">Developer</td>
                  <td className="p-3">$4.99</td>
                  <td className="p-3">Ilimitado</td>
                  <td className="p-3">9 GB</td>
                  <td className="p-3">2.5B</td>
                  <td className="p-3">25M</td>
                  <td className="p-3">10 GB</td>
                </tr>

                <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">Scaler</td>
                  <td className="p-3">$24.92</td>
                  <td className="p-3">Ilimitado</td>
                  <td className="p-3">24 GB</td>
                  <td className="p-3">100B</td>
                  <td className="p-3">100M</td>
                  <td className="p-3">24 GB</td>
                </tr>

                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium text-foreground">Pro</td>
                  <td className="p-3">$416.58</td>
                  <td className="p-3">Ilimitado</td>
                  <td className="p-3">50 GB</td>
                  <td className="p-3">250B</td>
                  <td className="p-3">250M</td>
                  <td className="p-3">100 GB</td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Explicación de recursos */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-2">
                📖 Lecturas
              </h4>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Se producen cuando la aplicación consulta información de la
                base de datos. Por ejemplo, cargar productos, usuarios,
                canciones, pedidos o categorías puede generar operaciones
                de lectura.
              </p>

              <p className="text-sm text-yellow-400 mt-2">
                ⚠️ Muchas consultas innecesarias pueden aumentar rápidamente
                este consumo.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-2">
                ✏️ Escrituras
              </h4>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Se producen cuando la aplicación crea, modifica o elimina
                información. Registrar usuarios, realizar pedidos, actualizar
                perfiles o guardar configuraciones son ejemplos de escrituras.
              </p>

              <p className="text-sm text-yellow-400 mt-2">
                ⚠️ Las escrituras suelen ser especialmente importantes en
                aplicaciones con mucha actividad.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-2">
                💾 Almacenamiento
              </h4>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Representa el espacio utilizado por las bases de datos.
                Aumenta conforme se almacenan más registros y datos.
              </p>

              <p className="text-sm text-muted-foreground mt-2">
                Eliminar registros que ya no son necesarios puede ayudar a
                controlar el crecimiento de la base de datos.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-2">
                🔄 Sincronización
              </h4>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Representa el volumen de datos transferidos mediante los
                mecanismos de sincronización de la plataforma.
              </p>

              <p className="text-sm text-yellow-400 mt-2">
                ⚠️ Aplicaciones con sincronización frecuente o grandes
                cantidades de datos pueden consumir este recurso más rápido.
              </p>
            </div>

          </div>

          {/* Qué pasa al superar */}
          <div className="mt-5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5">

            <h4 className="font-semibold text-yellow-300 mb-3">
              ¿Qué ocurre cuando Turso se acerca o supera un límite?
            </h4>

            <div className="space-y-3 text-sm text-muted-foreground">

              <p>
                <strong className="text-foreground">🟢 Consumo normal:</strong>{" "}
                la aplicación funciona normalmente y el administrador no
                necesita realizar ninguna acción.
              </p>

              <p>
                <strong className="text-yellow-300">🟡 Consumo elevado:</strong>{" "}
                conviene revisar el panel de consumo, optimizar consultas y
                comprobar qué funcionalidades están generando más operaciones.
              </p>

              <p>
                <strong className="text-red-300">🔴 Límite alcanzado:</strong>{" "}
                el comportamiento depende del recurso y de las condiciones
                del plan. Algunas operaciones podrían dejar de estar disponibles,
                limitarse o generar cargos adicionales.
              </p>

              <p>
                <strong className="text-foreground">👤 Experiencia del usuario:</strong>{" "}
                el usuario final podría experimentar errores al cargar datos,
                guardar información o realizar determinadas acciones si la
                operación requerida ya no puede ejecutarse.
              </p>

            </div>
          </div>

          {/* Recomendaciones */}
          <div className="mt-5 bg-card border border-border rounded-xl p-5">

            <h4 className="font-semibold text-foreground mb-3">
              Buenas prácticas para evitar alcanzar los límites
            </h4>

            <ul className="space-y-2 text-sm text-muted-foreground">

              <li>
                • Evitar realizar consultas repetidas innecesariamente.
              </li>

              <li>
                • Utilizar paginación para grandes cantidades de registros.
              </li>

              <li>
                • Seleccionar solamente las columnas necesarias en las consultas.
              </li>

              <li>
                • Utilizar índices adecuados en la base de datos.
              </li>

              <li>
                • Implementar caché cuando sea apropiado.
              </li>

              <li>
                • Controlar el crecimiento del almacenamiento.
              </li>

              <li>
                • Monitorizar periódicamente el consumo desde el panel del proveedor.
              </li>

            </ul>
          </div>

        </section>

        {/* ========================================================= */}
        {/* RESEND */}
        {/* ========================================================= */}
        <section>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
              📧 Resend
            </h3>

            <a
              href="https://resend.com/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground underline hover:text-foreground"
            >
              Página oficial
            </a>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            Resend se utiliza para el envío de correos electrónicos desde la
            aplicación, por ejemplo para verificación de cuentas, recuperación
            de contraseñas, notificaciones, confirmaciones y comunicaciones
            automáticas.
          </p>

          {/* Tabla */}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[700px] text-sm text-left">

              <thead className="bg-muted">
                <tr>
                  <th className="p-3 border-b border-border">Plan</th>
                  <th className="p-3 border-b border-border">Precio/mes</th>
                  <th className="p-3 border-b border-border">Emails/mes</th>
                  <th className="p-3 border-b border-border">Límite diario</th>
                  <th className="p-3 border-b border-border">Dominios</th>
                </tr>
              </thead>

              <tbody>

                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="p-3 font-medium text-foreground">Gratis</td>
                  <td className="p-3">$0</td>
                  <td className="p-3">3,000</td>
                  <td className="p-3">100</td>
                  <td className="p-3">1</td>
                </tr>

                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="p-3 font-medium text-foreground">Pro</td>
                  <td className="p-3">$20</td>
                  <td className="p-3">50,000</td>
                  <td className="p-3">Ilimitado</td>
                  <td className="p-3">10</td>
                </tr>

                <tr className="border-b border-border hover:bg-muted/50">
                  <td className="p-3 font-medium text-foreground">Scale</td>
                  <td className="p-3">$90</td>
                  <td className="p-3">100,000</td>
                  <td className="p-3">Ilimitado</td>
                  <td className="p-3">1,000</td>
                </tr>

                <tr>
                  <td className="p-3 font-medium text-foreground">Enterprise</td>
                  <td className="p-3">Personalizado</td>
                  <td className="p-3">Ilimitado</td>
                  <td className="p-3">Ilimitado</td>
                  <td className="p-3">Ilimitado</td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Tipos de correo */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-2">
                📩 Correos transaccionales
              </h4>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Son mensajes generados automáticamente por una acción del
                usuario o del sistema.
              </p>

              <ul className="text-sm text-muted-foreground mt-3 space-y-1">
                <li>• Verificación de correo electrónico</li>
                <li>• Recuperación de contraseña</li>
                <li>• Confirmación de registro</li>
                <li>• Notificaciones del sistema</li>
                <li>• Confirmaciones de operaciones</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-2">
                📊 Control del consumo
              </h4>

              <p className="text-sm text-muted-foreground leading-relaxed">
                El consumo debe monitorizarse especialmente cuando el correo
                electrónico es necesario para completar procesos importantes
                de la aplicación.
              </p>

              <p className="text-sm text-yellow-400 mt-3">
                Ejemplo: si un usuario necesita un correo para verificar su
                cuenta y el servicio de envío está limitado, esa operación
                podría no completarse correctamente.
              </p>
            </div>

          </div>

          {/* Experiencia del usuario */}
          <div className="mt-5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-5">

            <h4 className="font-semibold text-cyan-300 mb-3">
              Experiencia del usuario al alcanzar un límite
            </h4>

            <div className="space-y-3 text-sm text-muted-foreground">

              <p>
                <strong className="text-green-400">🟢 Dentro del límite:</strong>{" "}
                el correo se procesa normalmente y el usuario recibe la
                notificación correspondiente.
              </p>

              <p>
                <strong className="text-yellow-400">🟡 Cerca del límite:</strong>{" "}
                el administrador debería revisar el consumo y preparar una
                actualización del plan si el crecimiento continúa.
              </p>

              <p>
                <strong className="text-red-400">🔴 Límite alcanzado:</strong>{" "}
                algunos envíos pueden ser rechazados o quedar afectados
                dependiendo de las condiciones del servicio.
              </p>

              <p>
                <strong className="text-foreground">⚠️ Importante:</strong>{" "}
                la aplicación no debería mostrar al usuario un mensaje técnico
                como "Resend alcanzó su límite". Es preferible mostrar un
                mensaje amigable y registrar el error internamente para que
                el administrador pueda solucionarlo.
              </p>

            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* EXPERIENCIA DE USUARIO */}
        {/* ========================================================= */}
        <section>

          <h3 className="text-xl font-semibold text-foreground mb-4">
            Experiencia de usuario al alcanzar los límites
          </h3>

          <div className="space-y-4">

            <div className="flex gap-4 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="text-2xl">🟢</div>

              <div>
                <h4 className="font-semibold text-green-300">
                  Funcionamiento normal
                </h4>

                <p className="text-sm text-muted-foreground mt-1">
                  El consumo está dentro de los límites. El usuario no necesita
                  conocer los detalles de infraestructura y la aplicación
                  funciona normalmente.
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-2xl">🟡</div>

              <div>
                <h4 className="font-semibold text-yellow-300">
                  Consumo elevado
                </h4>

                <p className="text-sm text-muted-foreground mt-1">
                  El administrador debe recibir una advertencia. La aplicación
                  debería continuar funcionando sin mostrar mensajes técnicos
                  innecesarios al usuario final.
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="text-2xl">🔴</div>

              <div>
                <h4 className="font-semibold text-red-300">
                  Recurso agotado
                </h4>

                <p className="text-sm text-muted-foreground mt-1">
                  Si una operación no puede completarse, la aplicación debería
                  manejar el error correctamente, evitar perder información y
                  proporcionar al usuario una respuesta clara.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================= */}
        {/* RECOMENDACIÓN TÉCNICA */}
        {/* ========================================================= */}
        <section className="bg-card border border-border rounded-xl p-5">

          <h3 className="text-lg font-semibold text-foreground mb-4">
            🛡️ Recomendación para la aplicación
          </h3>

          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">

            <p>
              La aplicación no debería depender únicamente de que el proveedor
              rechace una operación cuando se alcanza un límite.
            </p>

            <p>
              Es recomendable implementar manejo de errores, registro de
              excepciones y mensajes amigables para el usuario.
            </p>

            <p>
              Por ejemplo, si una operación de escritura falla temporalmente,
              el sistema puede informar:
            </p>

            <div className="bg-muted border border-border rounded-lg p-4 text-muted-foreground">
              "No pudimos completar esta operación en este momento.
              Por favor, inténtalo nuevamente en unos instantes."
            </div>

            <p>
              Mientras tanto, el error técnico puede registrarse en los logs
              para que el administrador pueda identificar si el problema está
              relacionado con la base de datos, el servicio de correo, límites
              de consumo o cualquier otra causa.
            </p>

          </div>

        </section>

        {/* ========================================================= */}
        {/* PIE */}
        {/* ========================================================= */}
        <div className="border-t border-border pt-5">

          <div className="bg-muted rounded-lg p-4">
            <p className="text-muted-foreground text-xs leading-relaxed">
              <strong className="text-foreground">
                Importante:
              </strong>{" "}
              los precios, límites, características y políticas de los
              proveedores pueden cambiar. La información mostrada aquí tiene
              carácter orientativo y debe contrastarse con la documentación
              oficial antes de tomar decisiones de contratación o arquitectura.
            </p>
          </div>

          <p className="text-muted-foreground text-xs mt-3 text-center">
            Consulta siempre las páginas oficiales para conocer los límites y
            precios vigentes.
          </p>

        </div>

      </div>
    </div>
  </div>
)}
    </>
  );
}