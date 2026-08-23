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
          code={`'use client';
import { getUser } from "@/actions/auth/get-user";
import { User } from "@/interfaces/user";
import { createClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  getUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await getUser();
      if (userData) setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const eventTypes = [
        'INITIAL_SESSION', 'SIGNED_IN', 'USER_UPDATED',
        'PASSWORD_RECOVERY', 'SIGNED_OUT'
      ];
      if (eventTypes.includes(event)) {
        if (session) getUserData();
        else setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, getUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};`}
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
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, CreditCard, DollarSign, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        {isLoading ? (
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
        ) : (
          <h2 className="text-3xl font-bold tracking-tight">Hola de nuevo, {user?.name?.split(' ')[0] || 'Usuario'} 👋</h2>
        )}
        <p className="text-muted-foreground mt-2">
          Aquí tienes un resumen general de la actividad de tu sistema.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Tarjetas de estadísticas */}
        <Card className="hover:border-primary/50 transition-colors bg-card/60 backdrop-blur-sm shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3" /> +20.1%
            </p>
          </CardContent>
        </Card>
        {/* Más tarjetas... */}
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
          code={`import React from 'react';
import UserProfile from './components/UserProfile';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen p-4 relative overflow-hidden bg-background'>
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
          <code>app/profile/components/UserProfile.tsx</code> manejan la edición de perfil y avatar.
          Estos archivos son extensos y se pueden consultar en el código completo del proyecto.
        </p>
      </section>
    </>
  );
}