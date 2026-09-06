
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Inicio() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Next.js + Clerk</h1>
        <p className="content-subtitle">
          La forma más rápida de añadir autenticación completa a Next.js
        </p>
        <p className="text-gray-400 mt-4">
          Clerk es una plataforma de autenticación <strong>como servicio</strong>:
          te da componentes pre-construidos (login, registro, perfil), sesiones,
          MFA, autenticación social y gestión de usuarios desde el dashboard, sin
          que escribas formularios ni toques la base de datos. Esta guía usa el{" "}
          <strong>Clerk CLI</strong>, que instala el SDK, configura el proveedor y
          deja la app lista en minutos, con código listo para copiar y pegar.
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
            Una cuenta en <strong>Clerk</strong> (gratuita) –{' '}
            <a href="https://clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Regístrate</a>
          </li>
        </ul>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          1. Crear el proyecto Next.js (si no existe)
        </h2>
        <CommandBlock command="npx create-next-app@latest mi-app --typescript --tailwind --app --no-src-dir" />
        <CommandBlock command="cd mi-app" />
        <p className="section-paragraph">
          Si ya tienes un proyecto Next.js, ve a su raíz y continúa con el paso 2 —
          el CLI detecta el framework y el gestor de paquetes automáticamente.
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">⚡</span>
          2. El plan de setup (checklist)
        </h2>
        <p className="section-paragraph">
          Antes de ejecutar nada, esto es lo que vamos a hacer:
        </p>
        <CodeBlock
          code={`1. Instalar o actualizar el Clerk CLI
2. Iniciar sesión en tu cuenta de Clerk
3. Inicializar Clerk en el proyecto (instala @clerk/nextjs y configura todo)
4. Verificar el matcher del proxy de Next.js
5. Añadir los controles de autenticación (Sign in / Sign up / UserButton)
6. Iniciar la app y probar el flujo`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛠️</span>
          3. Instalar o actualizar el Clerk CLI
        </h2>
        <p className="section-paragraph">
          Comprueba si el CLI ya está disponible y su versión:
        </p>
        <CommandBlock command="clerk --version" />
        <p className="section-paragraph">Si está instalado, actualízalo:</p>
        <CommandBlock command="clerk update --yes" />
        <p className="section-paragraph">
          Si no está instalado, instálalo con tu gestor preferido (por defecto, npm):
        </p>
        <CommandBlock command="npm install -g clerk" />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Equivalente con otros gestores: <code>pnpm install -g clerk</code>,{" "}
            <code>yarn global add clerk</code>, <code>bun add -g clerk</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          4. Iniciar sesión en Clerk
        </h2>
        <p className="section-paragraph">
          Inmediatamente después de instalar o actualizar el CLI, ejecuta desde la
          raíz del proyecto:
        </p>
        <CommandBlock command="clerk auth login" />
        <p className="section-paragraph">
          Se abrirá el navegador para que completes el login con tu cuenta de Clerk.
          El CLI queda autenticado y listo para inicializar. (Si ya habías iniciado
          sesión antes, este comando no pregunta nada.)
        </p>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <code>clerk auth login</code> es <strong>siempre</strong> el primer
            comando tras instalar el CLI. No intentes listar apps ni inicializar
            antes de autenticarte.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🚀</span>
          5. Inicializar Clerk en el proyecto
        </h2>
        <p className="section-paragraph">
          En un proyecto existente, ejecuta (si ya tienes una aplicación en Clerk,
          pásale su ID con <code>--app</code> para vincularla):
        </p>
        <CommandBlock command="clerk init" />
        <p className="section-paragraph">O vinculando una app específica:</p>
        <CommandBlock command="clerk init --app app_XXXXXXXXXXXX" />
        <p className="section-paragraph">
          <code>clerk init</code> detecta el framework (Next.js) y el gestor de
          paquetes (npm/pnpm/yarn/bun), instala <code>@clerk/nextjs</code> y aplica
          el setup: <code>ClerkProvider</code> en el layout, el{" "}
          <code>proxy.ts</code>, las variables de entorno y (si la app está vacía)
          las páginas de ejemplo. <strong>No</strong> pases{" "}
          <code>--framework</code> ni <code>--pm</code> en proyectos existentes.
        </p>
        <div className="tip">
          <span className="tip-icon">🔧</span>
          <span>
            Gestor detectado por lockfile: <code>pnpm-lock.yaml</code> → pnpm,{" "}
            <code>yarn.lock</code> → yarn, <code>bun.lock</code> → bun,{" "}
            <code>package-lock.json</code> → npm. Sin lockfile y sin preferencia →
            npm.
          </span>
        </div>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            En un directorio vacío, el CLI pregunta framework y gestor. Sin
            preferencia: Next.js + npm, con{" "}
            <code>clerk init --framework next --pm npm</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📁</span>
          7. Qué archivos genera <code>clerk init</code>
        </h2>
        <p className="section-paragraph">
          Al terminar, el CLI deja esta estructura mínima (los archivos con * los
          completamos en los próximos pasos):
        </p>
        <CodeBlock
          code={`mi-app/
├── app/
│   ├── sign-in/[[...sign-in]]/page.tsx  ← Página de login (SignIn)
│   ├── sign-up/[[...sign-up]]/page.tsx  ← Página de registro (SignUp)
│   ├── layout.tsx                       ← Envuelve todo en <ClerkProvider>
│   └── page.tsx                         ← Home con botones Sign in / Sign up
├── proxy.ts                             ← clerkMiddleware() + matcher /__clerk
└── .env.local                           ← Tus claves de Clerk (las rellena el CLI)`}
        />
        <div className="tip">
          <span className="tip-icon">🎯</span>
          <span>
            A diferencia de otras bibliotecas, <strong>no hay</strong> tablas de
            usuarios, ni Server Actions de login, ni hash de contraseñas: Clerk
            gestiona todo eso en su nube. Tu código solo renderiza componentes y
            lee la sesión.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧪</span>
          6. Verificar con <code>clerk doctor</code>
        </h2>
        <p className="section-paragraph">
          Tras inicializar, ejecuta el diagnóstico del CLI:
        </p>
        <CommandBlock command="clerk doctor" />
        <p className="section-paragraph">Arregla cualquier problema que reporte y continúa con los pasos siguientes.</p>
      </section>
    </>
  );
}
