import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function DashboardPerfil() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Dashboard y Perfil Protegido</h1>
        <p className="content-subtitle">
          Páginas protegidas con Clerk y uso de metadatos del usuario
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          1. Dashboard protegido
        </h2>
        <p className="section-paragraph">
          Crea <code>app/dashboard/page.tsx</code> con protección automática gracias al middleware de Clerk:
        </p>
        <CodeBlock
          code={`"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return <div className="p-8 text-center">Cargando...</div>;
  if (!isSignedIn) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
        <p className="text-lg">Bienvenido, {user.fullName || user.firstName} 👋</p>
        <p className="text-gray-400 mt-2">Email: {user.emailAddresses[0]?.emailAddress}</p>
        <p className="text-gray-400 mt-1">ID: {user.id}</p>
        <div className="mt-4 flex gap-4">
          <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
            Rol: {user.publicMetadata?.role || "usuario"}
          </span>
        </div>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          2. Perfil de usuario con Clerk
        </h2>
        <p className="section-paragraph">
          Crea <code>app/profile/page.tsx</code> usando el componente <code>UserProfile</code> de Clerk:
        </p>
        <CodeBlock
          code={`import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full max-w-2xl",
            card: "bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl",
            navbar: "bg-gray-900/50",
            navbarButton: "text-gray-300 hover:text-white hover:bg-gray-700/50",
            navbarActive: "bg-gray-700/50 text-white",
            profileSection: "text-gray-300",
            profileSectionTitle: "text-white",
            formFieldLabel: "text-gray-300",
            formFieldInput: "bg-gray-800/50 border-gray-600 text-white",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
          },
        }}
      />
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          3. Metadatos de usuario en Clerk
        </h2>
        <p className="section-paragraph">
          Clerk permite añadir metadatos públicos y privados a los usuarios. Puedes establecerlos
          desde el dashboard de Clerk o mediante la API. Ejemplo de cómo acceder a ellos:
        </p>
        <CodeBlock
          code={`"use client";
import { useUser } from "@clerk/nextjs";

export default function UserBadge() {
  const { user } = useUser();

  if (!user) return null;

  const role = user.publicMetadata?.role || "usuario";
  const plan = user.publicMetadata?.plan || "gratuito";

  return (
    <div className="flex gap-2">
      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
        {role}
      </span>
      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
        {plan}
      </span>
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Los metadatos públicos son accesibles desde el frontend. Los metadatos privados solo
            se pueden leer desde el servidor usando <code>auth().session?.user?.privateMetadata</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          4. Protección de rutas en Server Components
        </h2>
        <p className="section-paragraph">
          En Server Components, puedes usar <code>auth()</code> para verificar autenticación y
          redirigir si no hay usuario:
        </p>
        <CodeBlock
          code={`import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedServerComponent() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Obtener datos del usuario desde la base de datos
  // ...

  return (
    <div>
      <h1>Contenido protegido</h1>
      <p>Usuario ID: {userId}</p>
    </div>
  );
}`}
        />
      </section>
    </>
  );
}