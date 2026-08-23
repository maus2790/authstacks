import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Componentes y Hooks de Clerk</h1>
        <p className="content-subtitle">
          Uso de los componentes y hooks pre-construidos de Clerk
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          1. Componentes principales de Clerk
        </h2>
        <p className="section-paragraph">
          Clerk proporciona componentes listos para usar que puedes integrar en tu aplicación:
        </p>

        <h3 className="subsection-title">1.1. SignIn (Login)</h3>
        <CodeBlock
          code={`import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return <SignIn />;
}`}
        />

        <h3 className="subsection-title">1.2. SignUp (Registro)</h3>
        <CodeBlock
          code={`import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return <SignUp />;
}`}
        />

        <h3 className="subsection-title">1.3. UserButton (Menú de usuario)</h3>
        <CodeBlock
          code={`import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1>Mi App</h1>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}`}
        />

        <h3 className="subsection-title">1.4. UserProfile (Perfil completo)</h3>
        <CodeBlock
          code={`import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return <UserProfile />;
}`}
        />

        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Todos estos componentes son totalmente personalizables usando la prop <code>appearance</code>
            para cambiar estilos y la prop <code>path</code> para definir rutas personalizadas.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎣</span>
          2. Hooks de Clerk
        </h2>
        <p className="section-paragraph">
          Clerk proporciona hooks para acceder a la información del usuario y sesión:
        </p>

        <h3 className="subsection-title">2.1. useUser()</h3>
        <CodeBlock
          code={`"use client";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Cargando...</div>;
  if (!user) return <div>No autenticado</div>;

  return (
    <div>
      <h1>Hola, {user.fullName}</h1>
      <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
      <p>Rol: {user.publicMetadata?.role || "usuario"}</p>
    </div>
  );
}`}
        />

        <h3 className="subsection-title">2.2. useSession()</h3>
        <CodeBlock
          code={`import { useSession } from "@clerk/nextjs";

export default function SessionInfo() {
  const { session, isLoaded } = useSession();

  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <div>
      <p>ID de sesión: {session?.id}</p>
      <p>Último acceso: {session?.lastActiveAt?.toLocaleDateString()}</p>
    </div>
  );
}`}
        />

        <h3 className="subsection-title">2.3. useAuth()</h3>
        <CodeBlock
          code={`import { useAuth } from "@clerk/nextjs";

export default function ProtectedComponent() {
  const { isLoaded, isSignedIn, userId } = useAuth();

  if (!isLoaded) return <div>Cargando...</div>;
  if (!isSignedIn) return <div>Acceso denegado</div>;

  return <div>Usuario ID: {userId}</div>;
}`}
        />

        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            Los hooks de Clerk funcionan tanto en Server Components como en Client Components.
            En Server Components, usa <code>auth()</code> y <code>currentUser()</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🖥️</span>
          3. Server Components con Clerk
        </h2>
        <p className="section-paragraph">
          En Server Components, puedes usar las funciones <code>auth()</code> y <code>currentUser()</code>:
        </p>
        <CodeBlock
          code={`import { auth, currentUser } from "@clerk/nextjs/server";

export default async function ServerComponent() {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) {
    return <div>No autenticado</div>;
  }

  return (
    <div>
      <p>Usuario ID: {userId}</p>
      <p>Nombre: {user?.firstName} {user?.lastName}</p>
      <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">⚡</span>
          <span>
            <code>auth()</code> es síncrono y se usa para verificar autenticación en Server Components.
            <code>currentUser()</code> es asíncrono y obtiene los datos completos del usuario.
          </span>
        </div>
      </section>
    </>
  );
}