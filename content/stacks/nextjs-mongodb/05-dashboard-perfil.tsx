import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function DashboardPerfil() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Dashboard, Perfil y Middleware</h1>
        <p className="content-subtitle">
          Área protegida, perfil de usuario y protección de rutas
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          1. Contexto de autenticación (<code>context/AuthContext.tsx</code>)
        </h2>
        <CodeBlock
          code={`"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/actions/auth/get-user";

const AuthContext = createContext({ user: null, loading: true, refresh: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await getUser();
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          2. Middleware de protección (<code>middleware.ts</code>)
        </h2>
        <CodeBlock
          code={`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
const protectedPaths = ["/dashboard", "/profile"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get("auth-token")?.value;
  const isValid = token ? verifyToken(token) : null;

  const isPublic = publicPaths.some((p) => path.startsWith(p));
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (isValid && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isValid && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>El middleware verifica el JWT en las cookies. Si el token expiró o es inválido, redirige al login.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          3. Dashboard (<code>app/dashboard/page.tsx</code>)
        </h2>
        <CodeBlock
          code={`"use client";
import { useAuth } from "@/context/AuthContext";
import { logoutAction } from "@/actions/auth/auth";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Bienvenido, {user?.name}!</p>
      <Button onClick={() => logoutAction()} variant="danger" className="mt-4">
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