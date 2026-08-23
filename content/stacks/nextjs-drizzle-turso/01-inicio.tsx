import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
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
        <h3 className="subsection-title">3.2. Configuración de Drizzle (<code>drizzle.config.ts</code>)</h3>
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
    ...
  },
  "devDependencies": {
    ...
  }
}`}
        />
      </section>
    </>
  );
}