import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Hooks y Componentes de Auth0</h1>
        <p className="content-subtitle">
          Uso de los hooks y componentes de Auth0 en Next.js
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎣</span>
          1. Hooks de Auth0
        </h2>
        <p className="section-paragraph">
          Auth0 proporciona hooks para acceder a la información del usuario y sesión en Server Components y Client Components:
        </p>

        <h3 className="subsection-title">1.1. En Server Components – <code>getSession()</code></h3>
        <CodeBlock
          code={`import { getSession } from "@auth0/nextjs-auth0";

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return <div>No autenticado</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user.name}</p>
      <p>Email: {user.email}</p>
      <img src={user.picture} alt="Avatar" className="rounded-full w-16 h-16" />
    </div>
  );
}`}
        />

        <h3 className="subsection-title">1.2. En Client Components – <code>useUser()</code></h3>
        <CodeBlock
          code={`"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@/components/ui/Button";

export default function UserProfile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No autenticado</div>;

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <img
          src={user.picture}
          alt={user.name}
          className="rounded-full w-16 h-16"
        />
        <div>
          <h3 className="font-bold">{user.name}</h3>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            <code>useUser</code> es un hook de cliente que necesita el proveedor <code>UserProvider</code>.
            En Next.js App Router, <code>UserProvider</code> ya está integrado automáticamente.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔌</span>
          2. Componentes de autenticación
        </h2>

        <h3 className="subsection-title">2.1. Botón de Login</h3>
        <CodeBlock
          code={`"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@/components/ui/Button";

export default function LoginButton() {
  const { user } = useUser();

  if (user) {
    return (
      <Button variant="secondary" onClick={() => (window.location.href = "/api/auth/logout")}>
        Cerrar sesión
      </Button>
    );
  }

  return (
    <Button variant="primary" onClick={() => (window.location.href = "/api/auth/login")}>
      Iniciar sesión
    </Button>
  );
}`}
        />

        <h3 className="subsection-title">2.2. Botón de Logout</h3>
        <CodeBlock
          code={`"use client";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function LogoutButton() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <button
      onClick={() => (window.location.href = "/api/auth/logout")}
      className="text-red-500 hover:text-red-700"
    >
      Cerrar sesión
    </button>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          3. Dashboard protegido en Server Component
        </h2>
        <p className="section-paragraph">
          Crea <code>app/dashboard/page.tsx</code> usando <code>getSession</code> en Server Component:
        </p>
        <CodeBlock
          code={`import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/login");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.picture}
            alt={user.name}
            className="rounded-full w-20 h-20 border-2 border-blue-500"
          />
          <div>
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-500">ID: {user.sub}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Email verificado</p>
            <p className="font-medium">{user.email_verified ? "✅ Sí" : "❌ No"}</p>
          </div>
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Proveedor</p>
            <p className="font-medium">{user.sub?.split("|")[0] || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}`}
        />
      </section>
    </>
  );
}