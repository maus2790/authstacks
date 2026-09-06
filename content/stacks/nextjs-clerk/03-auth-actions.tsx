import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Componentes y Hooks de Clerk</h1>
        <p className="content-subtitle">
          Controles de auth listos para usar y lectura de sesión en el servidor
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          1. Componentes de Clerk (no escribes formularios)
        </h2>
        <p className="section-paragraph">
          Clerk te da componentes completos y estilizados. Para una app mínima
          necesitas exactamente estos tres, importados de <code>@clerk/nextjs</code>:
        </p>

        <h3 className="subsection-title">1.1. Controles de sesión (SignInButton / SignUpButton / Show / UserButton)</h3>
        <CodeBlock
          code={`import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";

// Muestra "Sign in" y "Sign up" cuando NO hay sesión,
// y el botón de usuario (con menú y logout) cuando SÍ la hay.
export function AuthControls() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton />
        <SignUpButton />
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            <code>&lt;SignInButton /&gt;</code> y <code>&lt;SignUpButton /&gt;</code>{" "}
            redirigen a tus páginas <code>/sign-in</code> y <code>/sign-up</code>{" "}
            (las definen las variables <code>NEXT_PUBLIC_CLERK_SIGN_IN_URL</code> y{" "}
            <code>SIGN_UP_URL</code>). <code>&lt;UserButton /&gt;</code> incluye el
            menú de cuenta y el <strong>cerrar sesión</strong> integrados.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎣</span>
          2. Leer la sesión en el servidor (<code>auth()</code>)
        </h2>
        <p className="section-paragraph">
          En <strong>Server Components</strong>, usa <code>auth()</code> de{" "}
          <code>@clerk/nextjs/server</code>. Desde Next.js 15+ (y Clerk v7){" "}
          <code>auth()</code> es <strong>asíncrono</strong>:
        </p>
        <CodeBlock
          code={`import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  // Clerk v7 + Next 15+: auth() es ASYNC, siempre con await
  const { userId } = await auth();

  if (!userId) {
    // Si prefieres que Clerk maneje la redirección automáticamente:
    // return auth().redirectToSignIn();
    redirect("/sign-in");
  }

  return <h1>Usuario autenticado: {userId}</h1>;
}`}
        />
        <div className="tip">
          <span className="tip-icon">🚨</span>
          <span>
            <strong>Error típico:</strong> usar <code>const {"{ userId }"} = auth()</code>{" "}
            sin <code>await</code>. En Clerk v7 con Next 15+,{" "}
            <code>auth()</code> devuelve una promesa: siempre{" "}
            <code>await auth()</code>. Para rutas API puedes usar{" "}
            <code>auth.protect()</code>, que redirige o devuelve 404 según el caso.
          </span>
        </div>
        <p className="section-paragraph">
          Si necesitas los datos completos del usuario (nombre, email, imagen),
          usa <code>currentUser()</code>:
        </p>
        <CodeBlock
          code={`import { auth, currentUser } from "@clerk/nextjs/server";

export default async function ServerComponent() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();

  return (
    <div>
      <p>{user?.firstName} {user?.lastName}</p>
      <p>{user?.emailAddresses[0]?.emailAddress}</p>
      <p>{user?.imageUrl}</p>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎣</span>
          3. Hooks en Client Components
        </h2>
        <p className="section-paragraph">
          En el cliente, Clerk expone hooks como <code>useUser()</code> (datos del
          usuario), <code>useAuth()</code> (estado de sesión) y{" "}
          <code>useSession()</code>:
        </p>
        <CodeBlock
          code={`"use client";
import { useUser } from "@clerk/nextjs";

export default function UserBadge() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <p>Cargando...</p>;
  if (!user) return <p>No autenticado</p>;

  return <p>Hola, {user.firstName} 👋</p>;
}`}
        />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            Regla general: en <strong>Server Components</strong> usa{" "}
            <code>await auth()</code> / <code>currentUser()</code>; en{" "}
            <strong>Client Components</strong> usa los hooks. Ambos necesitan el{" "}
            <code>ClerkProvider</code> del layout y el <code>proxy.ts</code>.
          </span>
        </div>
      </section>
    </>
  );
}
