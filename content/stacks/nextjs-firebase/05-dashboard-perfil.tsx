import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function DashboardPerfil() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Dashboard, Perfil y Contexto</h1>
        <p className="content-subtitle">
          Área protegida, perfil de usuario y contexto global de autenticación
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
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getUser } from "@/actions/auth/get-user";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Obtener datos adicionales desde el servidor (opcional)
        const userData = await getUser();
        setUser(userData || {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}`}
        />
        <p className="section-paragraph">
          Envuelve tu aplicación con <code>AuthProvider</code> en <code>app/layout.tsx</code>.
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          2. Dashboard protegido
        </h2>

        <h3 className="subsection-title">Layout del dashboard (<code>app/dashboard/layout.tsx</code>)</h3>
        <CodeBlock
          code={`import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full md:pl-64 h-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}`}
        />

        <h3 className="subsection-title">Página principal del dashboard (<code>app/dashboard/page.tsx</code>)</h3>
        <CodeBlock
          code={`"use client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        {loading ? (
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
        ) : (
          <h2 className="text-3xl font-bold tracking-tight">Hola de nuevo, {user?.displayName || 'Usuario'} 👋</h2>
        )}
        <p className="text-muted-foreground mt-2">
          Aquí tienes un resumen general de la actividad de tu sistema.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Tarjetas de estadísticas... */}
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          3. Perfil de usuario
        </h2>

        <h3 className="subsection-title">Página de perfil (<code>app/profile/page.tsx</code>)</h3>
        <CodeBlock
          code={`import React from "react";
import UserProfile from "./components/UserProfile";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 relative overflow-hidden bg-background">
      <Link href="/dashboard" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all z-20 group">
        <div className="p-2 bg-muted/40 rounded-full group-hover:bg-muted transition-colors">
          <ArrowLeft size={20} />
        </div>
        <span className="font-medium hidden sm:inline-block">Volver al Dashboard</span>
      </Link>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-muted-foreground/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 w-full flex justify-center mt-12 md:mt-0">
        <UserProfile />
      </div>
    </div>
  );
}`}
        />

        <h3 className="subsection-title">Componentes del perfil</h3>
        <p className="section-paragraph">
          <code>app/profile/components/AccountForm.tsx</code> y{' '}
          <code>app/profile/components/UserProfile.tsx</code> manejan la edición de perfil.
          Puedes usar <code>updateProfile</code> de Firebase para actualizar displayName y photoURL.
        </p>
      </section>
    </>
  );
}