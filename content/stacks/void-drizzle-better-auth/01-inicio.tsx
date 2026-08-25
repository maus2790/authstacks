import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { OsCommandTabs } from "@/components/ui/OsCommandTabs";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Void + Drizzle + Better Auth</h1>
        <p className="content-subtitle">
          El stack del futuro: infraestructura aprovisionada automáticamente
        </p>
        <p className="text-gray-400 mt-4">
          Void es la plataforma que <strong>elimina toda la complejidad</strong> de la infraestructura.
          Escanea tu código, detecta que usas <code>db</code> y <code>auth</code>, y aprovisiona
          automáticamente una base de datos D1, configura las rutas de autenticación y despliega
          tu aplicación con un solo comando.
          <br />
          <br />
          Este manual te guiará desde <strong>cero</strong> hasta tener un sistema de autenticación
          completo con Void, Drizzle ORM y Better Auth, con un diseño moderno Glassmorphism y Dark Cyber.
        </p>
      </header>

      {/* ==================== NUEVA SECCIÓN TEÓRICA ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧠</span>
          ¿Qué es Void + Drizzle + Better Auth?
        </h2>

        <p className="section-paragraph">
          Este stack combina tres tecnologías que, juntas, representan una de las formas
          <strong>más eficientes y modernas</strong> de construir aplicaciones full-stack
          en la actualidad. Cada una aporta una pieza clave del rompecabezas:
        </p>

        <div className="two-columns">
          <div className="column">
            <h4 className="option-title">
              <span className="option-icon">🚀</span>
              Void (Vite + Cloudflare Workers)
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Void es una <strong>plataforma de desarrollo full-stack</strong> que se ejecuta
              sobre Vite y utiliza Cloudflare Workers para el backend y D1 para la base de datos.
              <br />
              <br />
              <span className="text-foreground font-semibold">Ventajas clave:</span>
              <br />
              • <strong>Zero-config:</strong> No necesitas configurar ni un panel de Cloudflare.
              Void escanea tu código y aprovisiona todo automáticamente.
              <br />
              • <strong>Despliegue inmediato:</strong> Con <code>void deploy</code> tienes tu
              aplicación en producción en segundos.
              <br />
              • <strong>Escalabilidad global:</strong> Al estar basado en Cloudflare Workers,
              tu aplicación se ejecuta en el edge (más de 300 ciudades en el mundo).
              <br />
              • <strong>Simulación local:</strong> Void simula D1 localmente con SQLite, sin
              necesidad de conexión a internet.
            </p>
          </div>

          <div className="column">
            <h4 className="option-title">
              <span className="option-icon">📦</span>
              Drizzle ORM
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Drizzle es un <strong>ORM moderno y ligero</strong> diseñado específicamente
              para TypeScript. Es la alternativa más rápida y segura a Prisma en entornos
              como Cloudflare D1.
              <br />
              <br />
              <span className="text-foreground font-semibold">Ventajas clave:</span>
              <br />
              • <strong>Type-safety extremo:</strong> Todos los tipos se infieren directamente
              desde tu esquema, sin necesidad de generar código adicional.
              <br />
              • <strong>Rendimiento superior:</strong> Al estar basado en queries SQL
              preparadas, es más rápido que otros ORMs en el edge.
              <br />
              • <strong>Sin overhead:</strong> Solo importas lo que usas, lo que reduce
              el tamaño del bundle en Workers.
              <br />
              • <strong>Migraciones simples:</strong> Con <code>drizzle-kit</code> puedes
              generar y aplicar migraciones de forma declarativa.
            </p>
          </div>
        </div>

        <div className="two-columns" style={{ marginTop: "1.5rem" }}>
          <div className="column">
            <h4 className="option-title">
              <span className="option-icon">🔐</span>
              Better Auth
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Better Auth es una <strong>biblioteca de autenticación moderna y extensible</strong>
              que se integra perfectamente con cualquier ORM o base de datos. Es el sucesor
              espiritual de NextAuth.js (Auth.js), pero con un enfoque más modular y
              optimizado para el edge.
              <br />
              <br />
              <span className="text-foreground font-semibold">Ventajas clave:</span>
              <br />
              • <strong>Extensible:</strong> Soporta email/contraseña, OAuth (Google, GitHub,
              etc.), magic links y más.
              <br />
              • <strong>Adaptadores universales:</strong> Funciona con Drizzle, Prisma,
              Kysely, Mongoose o cualquier cliente de base de datos.
              <br />
              • <strong>Seguridad por defecto:</strong> Maneja cookies HTTP-only, cifrado
              de contraseñas, protección CSRF y tokens de sesión de forma nativa.
              <br />
              • <strong>Optimizado para el edge:</strong> Diseñado para ejecutarse en
              Cloudflare Workers, Vercel Edge, Deno, Bun y Node.js.
            </p>
          </div>

          <div className="column">
            <h4 className="option-title">
              <span className="option-icon">⚡</span>
              El poder de la sinergia
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cuando estas tres tecnologías se combinan, el resultado es un stack que
              <strong>elimina la complejidad</strong> y te permite centrarte en lo que
              importa: tu código.
              <br />
              <br />
              <span className="text-foreground font-semibold">¿Por qué es revolucionario?</span>
              <br />
              • <strong>Sin YAML, sin paneles:</strong> Void escanea tu código y detecta
              automáticamente que usas <code>db</code> y <code>auth</code>. Crea la base
              de datos D1, configura las rutas de autenticación y despliega la aplicación
              sin intervención manual.
              <br />
              • <strong>Full-stack TypeScript:</strong> Todo tu código, desde el frontend
              hasta la base de datos, está tipado al 100% con TypeScript.
              <br />
              • <strong>Rendimiento edge:</strong> Tu aplicación se ejecuta en el borde
              de la red, reduciendo la latencia a milisegundos.
              <br />
              • <strong>Costo cero:</strong> El plan gratuito de Void incluye suficiente
              capacidad para la mayoría de los proyectos en fase inicial.
            </p>
          </div>
        </div>

        <div className="tip" style={{ marginTop: "1.5rem" }}>
          <span className="tip-icon">🚀</span>
          <span>
            <strong>En resumen:</strong> Void + Drizzle + Better Auth te permite construir
            aplicaciones full-stack con autenticación, base de datos y despliegue
            <strong>en menos de 10 minutos</strong>, sin necesidad de tocar un panel de
            Cloudflare ni escribir una línea de YAML.
          </span>
        </div>
      </section>

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
            <strong>pnpm</strong> (gestor de paquetes) –{' '}
            <a href="https://pnpm.io/installation" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Instalar pnpm</a>
          </li>
          <li>
            Una cuenta en <strong>Void</strong> (Beta Privada) –{' '}
            <a href="https://void.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Solicita acceso</a>
          </li>
          <li>
            <strong>PowerShell</strong> (Windows) o cualquier terminal (Linux/macOS)
          </li>
        </ul>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            Void está en <strong>Beta Privada</strong>. Si no tienes acceso, puedes solicitar invitación
            en su página oficial.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          ETAPA 1: Instalación del proyecto
        </h2>
        <p className="section-paragraph">
          Crea un nuevo proyecto con Void. Void utiliza Vite como bundler, así que empezamos con un
          template de Vite + React + TypeScript.
        </p>
        <CommandBlock command="pnpm create vite@latest mi-app -- --template react-ts" />
        <CommandBlock command="cd mi-app" />

        <p className="section-paragraph">
          <strong>Antes de instalar dependencias, es fundamental crear el archivo de permisos de pnpm v11</strong>
          para evitar errores de compilación de paquetes nativos en Windows. Este archivo permite que <code>pnpm</code>
          compile correctamente <code>better-sqlite3</code>, <code>esbuild</code> y <code>workerd</code>.
        </p>

        <OsCommandTabs
          windowsCode={`# Crear el archivo de permisos de pnpm v11 en formato UTF-8 (Clave del éxito)
"allowBuilds:" | Out-File -FilePath pnpm-workspace.yaml -Encoding utf8
"  better-sqlite3: true" | Out-File -FilePath pnpm-workspace.yaml -Encoding utf8 -Append
"  esbuild: true" | Out-File -FilePath pnpm-workspace.yaml -Encoding utf8 -Append
"  workerd: true" | Out-File -FilePath pnpm-workspace.yaml -Encoding utf8 -Append`}
          linuxCode={`# Crear el archivo de permisos de pnpm v11
echo "allowBuilds:" > pnpm-workspace.yaml
echo "  better-sqlite3: true" >> pnpm-workspace.yaml
echo "  esbuild: true" >> pnpm-workspace.yaml
echo "  workerd: true" >> pnpm-workspace.yaml`}
        />

        <div className="tip">
          <span className="tip-icon">🔑</span>
          <span>
            Este archivo evita el error de compilación de <code>workerd</code> en Windows, que requiere
            Visual Studio o SDKs adicionales. Con estos permisos, <code>pnpm</code> compila sin problemas.
          </span>
        </div>

        <p className="section-paragraph">Instala las dependencias de producción:</p>
        <CommandBlock command="pnpm add void drizzle-orm better-auth @better-auth/drizzle-adapter react-router-dom" />

        <p className="section-paragraph">Instala las herramientas de desarrollo:</p>
        <CommandBlock command="pnpm add -D drizzle-kit @cloudflare/workers-types --ignore-scripts" />

        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            <strong>Explicación:</strong> <br />
            • <code>void</code>: La plataforma que aprovisiona infraestructura automáticamente.<br />
            • <code>drizzle-orm</code>: ORM para trabajar con la base de datos D1.<br />
            • <code>better-auth</code>: Biblioteca de autenticación moderna y extensible.<br />
            • <code>@better-auth/drizzle-adapter</code>: Adaptador de Better Auth para Drizzle.<br />
            • <code>react-router-dom</code>: Enrutamiento para el frontend.<br />
            • <code>@cloudflare/workers-types</code>: Tipos para el entorno de Cloudflare Workers (necesario para D1).<br />
            • <code>--ignore-scripts</code>: Evita que pnpm ejecute scripts de instalación de dependencias (útil en entornos controlados).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📁</span>
          ETAPA 2: Estructura de carpetas y archivos
        </h2>
        <p className="section-paragraph">
          Crea la estructura de carpetas y archivos necesaria para el proyecto. Selecciona tu sistema operativo:
        </p>

        <OsCommandTabs
          windowsCode={`# Crear carpetas
New-Item -ItemType Directory -Path "db" -Force
New-Item -ItemType Directory -Path "src/components" -Force
New-Item -ItemType Directory -Path "src/hooks" -Force
New-Item -ItemType Directory -Path "src/lib" -Force
New-Item -ItemType Directory -Path "server/api/auth" -Force
New-Item -ItemType Directory -Path "server/src" -Force
New-Item -ItemType Directory -Path "drizzle" -Force

# Crear archivos de base de datos
New-Item -ItemType File -Path "db/schema.ts" -Force
New-Item -ItemType File -Path "db/index.ts" -Force

# Crear archivos del servidor de autenticación
New-Item -ItemType File -Path "server/src/auth.ts" -Force
New-Item -ItemType File -Path "server/api/auth/[...all].ts" -Force

# Crear componentes del frontend
New-Item -ItemType File -Path "src/components/Login.tsx" -Force
New-Item -ItemType File -Path "src/components/Register.tsx" -Force
New-Item -ItemType File -Path "src/components/LogoutButton.tsx" -Force
New-Item -ItemType File -Path "src/components/Dashboard.tsx" -Force
New-Item -ItemType File -Path "src/hooks/useSession.ts" -Force
New-Item -ItemType File -Path "src/lib/auth-client.ts" -Force

# Crear archivos de configuración
New-Item -ItemType File -Path "vite.config.ts" -Force
New-Item -ItemType File -Path "tsconfig.json" -Force
New-Item -ItemType File -Path ".env" -Force
New-Item -ItemType File -Path "drizzle.config.ts" -Force
New-Item -ItemType File -Path "void.json" -Force
New-Item -ItemType File -Path "index.html" -Force

Write-Host "✅ Estructura creada!" -ForegroundColor Green`}
          linuxCode={`# Crear carpetas
mkdir -p db
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p server/api/auth
mkdir -p server/src
mkdir -p drizzle

# Crear archivos de base de datos
touch db/schema.ts
touch db/index.ts

# Crear archivos del servidor de autenticación
touch server/src/auth.ts
touch server/api/auth/[...all].ts

# Crear componentes del frontend
touch src/components/Login.tsx
touch src/components/Register.tsx
touch src/components/LogoutButton.tsx
touch src/components/Dashboard.tsx
touch src/hooks/useSession.ts
touch src/lib/auth-client.ts

# Crear archivos de configuración
touch vite.config.ts
touch tsconfig.json
touch .env
touch drizzle.config.ts
touch void.json
touch index.html

echo "✅ Estructura creada!"`}
        />

        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>Esta estructura es la base del proyecto. Todos los archivos se irán llenando en las siguientes etapas.</span>
        </div>

        <p className="section-paragraph">Estructura resultante del proyecto:</p>
        <CodeBlock
          language="bash"
          code={`mi-app/
├── .env
├── void.json
├── index.html
├── drizzle.config.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
├── db/
│   ├── schema.ts          # Esquema de Drizzle (tablas)
│   └── index.ts           # Cliente de base de datos
├── server/
│   ├── src/
│   │   └── auth.ts        # Configuración de Better Auth
│   └── api/
│       └── auth/
│           └── [...all].ts # Endpoint de autenticación
├── src/
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── LogoutButton.tsx
│   │   └── Dashboard.tsx
│   ├── hooks/
│   │   └── useSession.ts
│   ├── lib/
│   │   └── auth-client.ts # Cliente de Better Auth
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
└── drizzle/               # Migraciones generadas`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">⚙️</span>
          ETAPA 3: Configuración de Vite, TypeScript y Void
        </h2>

        <h3 className="subsection-title">3.1. Configuración de Vite (<code>vite.config.ts</code>)</h3>
        <p className="section-paragraph">
          Void integra su plugin directamente desde el paquete <code>void</code>.
        </p>
        <CodeBlock
          code={`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { voidPlugin } from 'void';

export default defineConfig({
  plugins: [
    voidPlugin(),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});`}
        />

        <h3 className="subsection-title">3.2. TypeScript (<code>tsconfig.json</code>)</h3>
        <p className="section-paragraph">
          Asegura que los tipos de Vite y Cloudflare Workers estén disponibles.
        </p>
        <CodeBlock
          code={`{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client", "@cloudflare/workers-types"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "db", "server"],
}`}
        />

        <h3 className="subsection-title">3.3. Configuración de Void (<code>void.json</code>)</h3>
        <p className="section-paragraph">
          Void necesita un archivo de configuración para saber qué proveedores de autenticación están habilitados.
        </p>
        <CodeBlock
          code={`{
  "$schema": "./node_modules/void/schema.json",
  "auth": {
    "providers": [
      "email"
    ]
  },
  "worker": {
    "compatibility_date": "2026-02-24"
  }
}`}
        />

        <h3 className="subsection-title">3.4. Variables de entorno (<code>.env</code>)</h3>
        <p className="section-paragraph">
          Configura las variables de entorno necesarias para Better Auth.
        </p>
        <CodeBlock
          code={`# Better Auth Secret (genera uno seguro para producción)
BETTER_AUTH_SECRET="un_secreto_super_seguro_para_desarrollo_local_123456789"
BETTER_AUTH_URL="http://localhost:5173"

# URL de la app (para desarrollo)
VITE_APP_URL="http://localhost:5173"

# Google OAuth (opcional)
# AUTH_GOOGLE_CLIENT_ID=""
# AUTH_GOOGLE_CLIENT_SECRET=""`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            <strong>BETTER_AUTH_SECRET</strong> es obligatorio. Puedes generarlo con{' '}
            <code>openssl rand -hex 32</code> en la terminal. No uses el valor de ejemplo en producción.
          </span>
        </div>

        <h3 className="subsection-title">3.5. HTML (<code>index.html</code>)</h3>
        <p className="section-paragraph">
          El archivo HTML con las fuentes y metadatos necesarios para el diseño.
        </p>
        <CodeBlock
          code={`<!doctype html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Void + Drizzle + Better Auth - Autenticación</title>
  <meta name="description" content="Aplicación de autenticación moderna con Vite, Void, Drizzle ORM y Better Auth" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
    rel="stylesheet" />
</head>

<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>

</html>`}
        />
      </section>
    </>
  );
}