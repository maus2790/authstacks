
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + MongoDB Auth</h1>
        <p className="content-subtitle">
          Login y registro con MongoDB, bcrypt y sesiones JWT
        </p>
        <p className="text-gray-400 mt-4">
          MongoDB no es un proveedor de autenticación: es tu <strong>base de
          datos</strong>. Aquí construyes el auth "a mano", con control total:
          guardas los usuarios en MongoDB Atlas, hasheas contraseñas con bcrypt y
          gestionas la sesión con un <strong>JWT en cookie httpOnly</strong>. Esta
          guía te lleva desde <strong>cero</strong> hasta login + registro +
          dashboard protegido, con código listo para copiar y pegar.
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
            Un cluster <strong>MongoDB Atlas</strong> (plan M0 gratis) –{' '}
            <a href="https://www.mongodb.com/atlas" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Crear cuenta</a>
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
          <span className="section-icon">🍃</span>
          2. Instalar dependencias
        </h2>
        <CommandBlock command="npm install mongoose bcryptjs jsonwebtoken" />
        <CommandBlock command="npm install -D @types/bcryptjs @types/jsonwebtoken" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong><br />
            • <code>mongoose</code>: ODM para conectar con MongoDB y definir modelos.<br />
            • <code>bcryptjs</code>: hash seguro de contraseñas (pure JS, sin compilar).<br />
            • <code>jsonwebtoken</code>: firma/verificación del JWT de sesión.<br />
            <br />
            <strong>No necesitas</strong> react-hook-form, zod ni toast: formularios
            nativos + estados de React.
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
New-Item -ItemType Directory -Path "lib/db" -Force
New-Item -ItemType Directory -Path "actions" -Force
New-Item -ItemType Directory -Path "app/login" -Force
New-Item -ItemType Directory -Path "app/register" -Force
New-Item -ItemType Directory -Path "app/dashboard" -Force

# Crear archivos vacíos (los llenas en los próximos pasos)
New-Item -ItemType File -Path "lib/db/index.ts" -Force
New-Item -ItemType File -Path "lib/db/models.ts" -Force
New-Item -ItemType File -Path "lib/auth.ts" -Force
New-Item -ItemType File -Path "lib/session.ts" -Force
New-Item -ItemType File -Path "actions/auth.ts" -Force
New-Item -ItemType File -Path "app/login/page.tsx" -Force
New-Item -ItemType File -Path "app/register/page.tsx" -Force
New-Item -ItemType File -Path "app/dashboard/page.tsx" -Force
New-Item -ItemType File -Path "proxy.ts" -Force
New-Item -ItemType File -Path ".env.local" -Force

Write-Host "✅ Estructura creada!" -ForegroundColor Green`}
          linuxCode={`# Crear carpetas
mkdir -p lib/db actions app/login app/register app/dashboard

# Crear archivos vacíos (los llenas en los próximos pasos)
touch lib/db/index.ts lib/db/models.ts lib/auth.ts lib/session.ts
touch actions/auth.ts app/login/page.tsx app/register/page.tsx app/dashboard/page.tsx
touch proxy.ts .env.local

echo "✅ Estructura creada!"`}
        />
        <p className="section-paragraph">La estructura final queda así:</p>
        <CodeBlock
          code={`mi-app/
├── app/
│   ├── login/page.tsx              ← Login (formulario + Server Action)
│   ├── register/page.tsx           ← Registro (formulario + Server Action)
│   ├── dashboard/page.tsx          ← Página protegida
│   └── page.tsx                    ← (template, se adapta en el paso 5)
├── actions/
│   └── auth.ts                     ← Server Actions (registro, login, logout)
├── lib/
│   ├── db/index.ts                 ← Conexión a MongoDB (singleton)
│   ├── db/models.ts                ← Modelo User (Mongoose)
│   ├── auth.ts                     ← JWT + cookie de sesión
│   └── session.ts                  ← Lee el usuario autenticado
├── proxy.ts                        ← Protección de rutas (Next 16)
└── .env.local                      ← MONGODB_URI + JWT_SECRET`}
        />
      </section>
    </>
  );
}
