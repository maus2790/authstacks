import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Frontend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Páginas de Autenticación</h1>
        <p className="content-subtitle">
          Páginas de login y registro con los componentes SignIn y SignUp
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          1. Cómo funcionan las páginas de auth
        </h2>
        <p className="section-paragraph">
          Los botones <code>SignInButton</code>/<code>SignUpButton</code> redirigen
          a las URLs definidas en tus variables de entorno (
          <code>/sign-in</code> y <code>/sign-up</code>). Allí renderizas los
          componentes <code>SignIn</code> y <code>SignUp</code>, que muestran el
          formulario completo (email, contraseña, "olvidé mi contraseña", botones
          sociales si los activas en el dashboard).
        </p>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            La ruta usa un <strong>catch-all</strong>{" "}
            <code>[[...sign-in]]</code>: Clerk la aprovecha para sus flujos internos
            (verificación de email, etc.) sobre la misma URL.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          2. Página de Login (<code>app/sign-in/[[...sign-in]]/page.tsx</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Crea la carpeta y el archivo. Contenido completo:
        </p>
        <CodeBlock
          code={`import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          3. Página de Registro (<code>app/sign-up/[[...sign-up]]/page.tsx</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎨</span>
          4. Personalizar apariencia (opcional)
        </h2>
        <p className="section-paragraph">
          Los componentes aceptan la prop <code>appearance</code> para adaptarlos a
          tu marca sin escribir HTML:
        </p>
        <CodeBlock
          code={`import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <SignIn
        appearance={{
          elements: {
            card: "bg-white shadow-xl rounded-2xl",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            headerTitle: "text-2xl font-bold",
          },
        }}
      />
    </div>
  );
}`}
        />
        <p className="section-paragraph">
          También puedes cambiar colores, logo y textos globales en el{" "}
          <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Clerk Dashboard</a>{" "}
          → <strong>Appearance</strong>, sin tocar código.
        </p>
      </section>
    </>
  );
}
