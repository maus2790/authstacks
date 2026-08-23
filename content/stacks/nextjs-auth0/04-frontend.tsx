import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Frontend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Páginas de Autenticación</h1>
        <p className="content-subtitle">
          Configuración de páginas de login y registro con Auth0 Universal Login
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          1. Universal Login de Auth0
        </h2>
        <p className="section-paragraph">
          Auth0 maneja automáticamente las páginas de autenticación a través de <strong>Universal Login</strong>.
          Puedes personalizar la apariencia desde el dashboard de Auth0.
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <strong>Branding → Universal Login</strong> en el dashboard.</li>
          <li>Personaliza el logo, colores, y estilos de la página de login.</li>
          <li>Puedes usar plantillas HTML personalizadas para un control total.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">🎨</span>
          <span>
            Universal Login es la forma más segura y mantenible de manejar autenticación
            con Auth0. Todas las redirecciones son manejadas automáticamente.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          2. Página de Login personalizada (opcional)
        </h2>
        <p className="section-paragraph">
          Si prefieres manejar el login desde tu propia UI, puedes crear una página de login personalizada
          que redirija a Auth0. Crea <code>app/login/page.tsx</code>:
        </p>
        <CodeBlock
          code={`"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true);
    window.location.href = "/api/auth/login";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Bienvenido</h1>
        <p className="text-white/60 text-center mb-8">
          Inicia sesión con Auth0 para acceder a tu cuenta
        </p>
        <Button
          variant="primary"
          onClick={handleLogin}
          loading={loading}
          className="w-full text-lg py-6"
        >
          Iniciar sesión con Auth0
        </Button>
        <p className="text-white/40 text-center text-sm mt-4">
          Auth0 maneja la autenticación de forma segura
        </p>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          3. Página de logout personalizada (opcional)
        </h2>
        <p className="section-paragraph">
          Puedes crear una página de logout que redirija a Auth0. Crea <code>app/logout/page.tsx</code>:
        </p>
        <CodeBlock
          code={`"use client";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    // Redirigir automáticamente a Auth0 para cerrar sesión
    window.location.href = "/api/auth/logout";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Cerrando sesión...</p>
      </div>
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
          Crea componentes reutilizables para manejar el estado de autenticación:
        </p>
        <CodeBlock
          code={`"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@/components/ui/Button";

export default function AuthStatus() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="text-gray-400">Cargando...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-400">No autenticado</span>
        <Button
          variant="primary"
          onClick={() => (window.location.href = "/api/auth/login")}
        >
          Iniciar sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <img
        src={user.picture}
        alt={user.name}
        className="rounded-full w-8 h-8"
      />
      <span className="text-white">{user.name}</span>
      <Button
        variant="secondary"
        onClick={() => (window.location.href = "/api/auth/logout")}
      >
        Cerrar sesión
      </Button>
    </div>
  );
}`}
        />
      </section>
    </>
  );
}