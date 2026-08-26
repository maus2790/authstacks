
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + Auth0</h1>
        <p className="content-subtitle">
          Login y registro con Auth0: el mínimo código posible
        </p>
        <p className="text-gray-400 mt-4">
          Auth0 se encarga de <strong>todo</strong> el flujo de autenticación:
          formularios de login y registro (Universal Login), verificación de
          email, recuperación de contraseña, sesiones seguras y cierre de
          sesión. Nuestra app solo necesita leer la sesión y proteger un par de
          rutas. Esta guía te lleva desde <strong>cero</strong> hasta un login +
          registro + dashboard protegido, con código listo para copiar y pegar.
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
            Una cuenta en <strong>Auth0</strong> (plan Free) –{' '}
            <a href="https://auth0.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Regístrate</a>
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
          <span>Selecciona las opciones por defecto si te pregunta algo más.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🏢</span>
          2. Instalar el SDK de Auth0
        </h2>
        <p className="section-paragraph">
          <strong>Única dependencia extra que necesitas.</strong> Auth0 maneja login,
          registro, sesión y logout por su cuenta:
        </p>
        <CommandBlock command="npm install @auth0/nextjs-auth0" />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <strong>No necesitas</strong> react-hook-form, zod, react-hot-toast,
            clsx ni ningún formulario propio: los formularios los muestra Auth0
            en su Universal Login. Menos código = menos bugs y más seguridad.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📁</span>
          3. Estructura mínima de archivos
        </h2>
        <p className="section-paragraph">
          En total son <strong>5 archivos</strong> (más el <code>.env.local</code>).
          <code>app/page.tsx</code> y <code>app/layout.tsx</code> ya existen del
          template; solo crea los demás:
        </p>

        <h3 className="subsection-title">⚡ Comandos para crear la estructura</h3>
        <OsCommandTabs
          windowsCode={`# Crear carpetas
New-Item -ItemType Directory -Path "lib" -Force
New-Item -ItemType Directory -Path "app/dashboard" -Force

# Crear archivos vacíos (los llenas en los próximos pasos)
New-Item -ItemType File -Path "lib/auth0.ts" -Force
New-Item -ItemType File -Path "proxy.ts" -Force
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path ".env.local" -Force

Write-Host "✅ Estructura creada!" -ForegroundColor Green`}
          linuxCode={`# Crear carpetas
mkdir -p lib app/dashboard

# Crear archivos vacíos (los llenas en los próximos pasos)
touch lib/auth0.ts proxy.ts app/dashboard/page.tsx .env.local

echo "✅ Estructura creada!"`}
        />
        <p className="section-paragraph">
          La estructura final del proyecto queda así:
        </p>
        <CodeBlock
          code={`mi-app/
├── app/
│   ├── page.tsx          ← Landing con botones Registrarse / Iniciar sesión
│   ├── dashboard/
│   │   └── page.tsx      ← Dashboard protegido con botón Cerrar sesión
│   └── layout.tsx        ← (ya existe del template)
├── lib/
│   └── auth0.ts          ← Cliente Auth0 del SDK
├── proxy.ts              ← Monta las rutas /auth/* de Auth0
└── .env.local            ← Credenciales (paso siguiente)`}
        />
        <div className="tip">
          <span className="tip-icon">🧠</span>
          <span>
            En el SDK v4 ya <strong>no existe</strong> <code>app/api/auth/[auth0]/route.ts</code>:
            las rutas de autenticación (<code>/auth/login</code>, <code>/auth/callback</code>,
            <code>/auth/logout</code>, etc.) las monta el SDK automáticamente desde el
            proxy. Por eso la estructura es tan pequeña.
          </span>
        </div>
      </section>
    </>
  );
}
