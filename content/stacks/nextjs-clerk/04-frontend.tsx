import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Frontend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Páginas de Autenticación</h1>
        <p className="content-subtitle">
          Configuración de páginas de login, registro y recuperación con Clerk
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          1. Página de Login personalizada
        </h2>
        <p className="section-paragraph">
          Crea <code>app/sign-in/[[...sign-in]]/page.tsx</code> para una página de login personalizada:
        </p>
        <CodeBlock
          code={`import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Bienvenido</h1>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none",
              headerTitle: "text-white text-2xl",
              headerSubtitle: "text-white/70",
              socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 border-white/20 text-white",
              dividerLine: "bg-white/20",
              dividerText: "text-white/50",
              formFieldLabel: "text-white/80",
              formFieldInput: "bg-white/10 border-white/20 text-white placeholder-white/50",
              formButtonPrimary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white",
              footerActionLink: "text-cyan-300 hover:text-cyan-200",
            },
          }}
        />
      </div>
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">🎨</span>
          <span>La prop <code>appearance</code> permite personalizar cada elemento del componente <code>SignIn</code>.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          2. Página de Registro personalizada
        </h2>
        <p className="section-paragraph">
          Crea <code>app/sign-up/[[...sign-up]]/page.tsx</code>:
        </p>
        <CodeBlock
          code={`import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Crear cuenta</h1>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none",
              headerTitle: "text-white text-2xl",
              headerSubtitle: "text-white/70",
              socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 border-white/20 text-white",
              dividerLine: "bg-white/20",
              dividerText: "text-white/50",
              formFieldLabel: "text-white/80",
              formFieldInput: "bg-white/10 border-white/20 text-white placeholder-white/50",
              formButtonPrimary: "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white",
              footerActionLink: "text-cyan-300 hover:text-cyan-200",
            },
          }}
        />
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          3. Página de Recuperación de Contraseña
        </h2>
        <p className="section-paragraph">
          Clerk maneja automáticamente la recuperación de contraseña. Solo necesitas crear la ruta
          <code>app/reset-password/[[...reset-password]]/page.tsx</code> (opcional).
          Puedes usar el componente <code>ResetPassword</code> de Clerk:
        </p>
        <CodeBlock
          code={`import { ResetPassword } from "@clerk/nextjs";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ResetPassword />
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          4. Componentes reutilizables
        </h2>
        <p className="section-paragraph">
          Puedes usar los componentes de Clerk en cualquier parte de tu aplicación. Por ejemplo,
          un botón de inicio de sesión rápido:
        </p>
        <CodeBlock
          code={`"use client";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";

export default function AuthNav() {
  const { isSignedIn } = useUser();

  return (
    <nav className="flex items-center gap-4">
      {isSignedIn ? (
        <>
          <UserButton afterSignOutUrl="/" />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="primary">Iniciar sesión</Button>
        </SignInButton>
      )}
    </nav>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            La prop <code>mode="modal"</code> abre la autenticación en un modal en lugar de redirigir a una página.
          </span>
        </div>
      </section>
    </>
  );
}