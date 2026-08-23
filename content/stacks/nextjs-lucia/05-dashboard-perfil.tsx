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
          <span className="section-icon">📊</span>
          2. Dashboard (<code>app/dashboard/page.tsx</code>)
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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-400 mt-2">Bienvenido, {user?.name}!</p>
      <p className="text-gray-400">Email: {user?.email}</p>
      <Button onClick={() => logoutAction()} variant="danger" className="mt-4">
        Cerrar sesión
      </Button>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          3. Perfil (<code>app/profile/page.tsx</code>)
        </h2>
        <CodeBlock
          code={`"use client";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/actions/auth/update-profile";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");

  if (loading) return <div>Cargando...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    const result = await updateProfile(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Perfil actualizado");
      refresh();
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-gray-400">Email: {user?.email}</p>
        <Button type="submit">Actualizar</Button>
      </form>
    </div>
  );
}`}
        />
      </section>
    </>
  );
}