import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function ProteccionRutas() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Protección de Rutas y Sesión</h1>
        <p className="content-subtitle">
          Hook para obtener la sesión, componente Dashboard y protección de rutas
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎣</span>
          ETAPA 1: Hook de sesión (<code>src/hooks/useSession.ts</code>)
        </h2>
        <p className="section-paragraph">
          Crea un hook que retorne tanto el objeto <code>session</code> como el <code>user</code>
          y un estado de carga fiable.
        </p>
        <CodeBlock
          code={`import { authClient } from "@/lib/auth-client";
import { useEffect, useState, useCallback } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: string | Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authClient.getSession();
      if (res?.data) {
        setSession(res.data.session as Session);
        setUser(res.data.user as User);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch {
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return { session, user, loading, refetch: fetchSession };
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            La sesión se obtiene automáticamente de la cookie HTTP-only que Better Auth maneja.
            El hook consulta el endpoint <code>/api/auth/session</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          ETAPA 2: Componente Dashboard (<code>src/components/Dashboard.tsx</code>)
        </h2>
        <p className="section-paragraph">
          Panel protegido que muestra la información del usuario, la sesión y la arquitectura del stack.
        </p>
        <CodeBlock
          code={`import { LogoutButton } from "@/components/LogoutButton";
import { useSession } from "@/hooks/useSession";

export function Dashboard() {
  const { user, session } = useSession();

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(" ");
      return parts.length > 1
        ? \`\${parts[0][0]}\${parts[1][0]}\`.toUpperCase()
        : name.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const formatDate = (dateVal?: string | Date) => {
    if (!dateVal) return "N/A";
    try {
      return new Date(dateVal).toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="app-background">
        <div className="aurora-glow-1" />
        <div className="aurora-glow-2" />
        <div className="bg-grid" />
      </div>

      <nav className="dashboard-nav">
        <div className="nav-brand">
          <div className="nav-brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="nav-brand-text">Void Auth Hub</span>
          <span className="nav-brand-badge">D1 SQLite</span>
        </div>

        <LogoutButton />
      </nav>

      <main className="dashboard-main">
        <section className="hero-welcome-card">
          <div className="user-profile-header">
            <div className="user-avatar-large">
              {getInitials(user?.name, user?.email)}
            </div>
            <div className="user-details">
              <h1>¡Bienvenido, {user?.name || "Usuario"}!</h1>
              <p>
                <span>{user?.email}</span>
                <span className="status-tag active">
                  <span className="status-dot" />
                  Sesión Autenticada
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-widget">
            <div className="widget-header">
              <h2 className="widget-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Datos de Usuario (Tabla <code>user</code>)</span>
              </h2>
              <span className="widget-badge">Drizzle ORM</span>
            </div>

            <div className="info-list">
              <div className="info-item">
                <span className="info-label">ID de Usuario:</span>
                <span className="info-value" title={user?.id}>{user?.id || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{user?.name || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Verificado:</span>
                <span className="info-value">{user?.emailVerified ? "Sí" : "No"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fecha de Registro:</span>
                <span className="info-value">{formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-widget">
            <div className="widget-header">
              <h2 className="widget-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Sesión Activa (Tabla <code>session</code>)</span>
              </h2>
              <span className="widget-badge">Better Auth</span>
            </div>

            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Token de Sesión:</span>
                <span className="info-value" title={session?.token}>
                  {session?.token ? \`\${session.token.slice(0, 16)}...\` : "Cookie httpOnly"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Expira:</span>
                <span className="info-value">{formatDate(session?.expiresAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Dirección IP:</span>
                <span className="info-value">{session?.ipAddress || "127.0.0.1 (Localhost)"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Almacenamiento:</span>
                <span className="info-value">D1 SQLite Local (.void)</span>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-widget" style={{ gap: "20px" }}>
          <div className="widget-header">
            <h2 className="widget-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
              <span>¿Dónde y cómo se guardan los datos?</span>
            </h2>
            <span className="widget-badge">Arquitectura Fullstack</span>
          </div>

          <div style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "12px" }}>
            <p>
              • <strong>En desarrollo local:</strong> Void simula Cloudflare D1 usando una base de datos SQLite local dentro del directorio <code>.void/</code> del proyecto. Tus usuarios, contraseñas hasheadas y sesiones se guardan automáticamente ahí.
            </p>
            <p>
              • <strong>En producción:</strong> Al hacer <code>void deploy</code>, Void aprovisiona y conecta de forma automática una base de datos <strong>Cloudflare D1</strong> distribuida en el edge.
            </p>
            <p>
              • <strong>Better Auth + Drizzle ORM:</strong> Better Auth se encarga de la lógica de autenticación (hasheo seguro de contraseñas con bcrypt/argon2, tokens de sesión y cookies seguras) y escribe directamente en las tablas definidas en <code>db/schema.ts</code> (<code>user</code>, <code>session</code>, <code>account</code> y <code>verification</code>).
            </p>
          </div>

          <div className="tech-stack-pills">
            <span className="tech-pill">
              <span className="tech-pill-dot" style={{ background: "#6366f1" }} />
              Vite 8
            </span>
            <span className="tech-pill">
              <span className="tech-pill-dot" style={{ background: "#06b6d4" }} />
              Void Runtime
            </span>
            <span className="tech-pill">
              <span className="tech-pill-dot" style={{ background: "#a855f7" }} />
              Better Auth 1.7
            </span>
            <span className="tech-pill">
              <span className="tech-pill-dot" style={{ background: "#10b981" }} />
              Drizzle ORM
            </span>
            <span className="tech-pill">
              <span className="tech-pill-dot" style={{ background: "#f59e0b" }} />
              Cloudflare D1 (SQLite)
            </span>
            <span className="tech-pill">
              <span className="tech-pill-dot" style={{ background: "#60a5fa" }} />
              React 19
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">📊</span>
          <span>
            El Dashboard muestra información técnica útil para entender cómo funciona el stack:
            los datos del usuario, la sesión activa y una explicación de la arquitectura de almacenamiento.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🚪</span>
          ETAPA 3: Botón de Logout (<code>src/components/LogoutButton.tsx</code>)
        </h2>
        <CodeBlock
          code={`import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authClient.signOut();
      navigate("/login");
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="btn-danger"
      title="Cerrar sesión activa"
    >
      {loading ? (
        <>
          <div className="spinner" style={{ width: 14, height: 14 }} />
          <span>Saliendo...</span>
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Cerrar Sesión</span>
        </>
      )}
    </button>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          ETAPA 4: Aplicación principal con rutas protegidas (<code>src/App.tsx</code>)
        </h2>
        <p className="section-paragraph">
          Configura el enrutamiento con React Router, incluyendo rutas públicas y protegidas.
        </p>
        <CodeBlock
          code={`import { useSession } from "@/hooks/useSession";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "@/components/Login";
import { Register } from "@/components/Register";
import { Dashboard } from "@/components/Dashboard";

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      <p style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.02em" }}>Cargando sesión...</p>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();

  if (loading) return <LoadingScreen />;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();

  if (loading) return <LoadingScreen />;
  if (session) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            La aplicación usa <code>react-router-dom</code> para el enrutamiento. Las rutas protegidas
            redirigen automáticamente al login si no hay sesión, y las rutas públicas redirigen al
            dashboard si el usuario ya está autenticado.
          </span>
        </div>
      </section>

      {/* ==================== ETAPA 5: EJECUCIÓN FINAL ==================== */}
      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🚀</span>
          ETAPA 5: Aplicar migraciones y ejecutar el servidor
        </h2>
        <p className="section-paragraph">
          Una vez que todos los archivos están creados, ejecuta los siguientes comandos para aplicar
          las migraciones de la base de datos y lanzar el servidor de desarrollo.
        </p>

        <p className="section-paragraph">
          <strong>1. Aplicar migraciones a D1 (local):</strong>
        </p>
        <CommandBlock command="pnpm exec void db push" />

        <p className="section-paragraph">
          <strong>2. Iniciar el servidor de desarrollo:</strong>
        </p>
        <CommandBlock command="npm run dev" />

        <div className="tip">
          <span className="tip-icon">🎉</span>
          <span>
            Con estos comandos, Void aprovisionará automáticamente la base de datos D1 (localmente)
            y aplicará las migraciones definidas en <code>drizzle.config.ts</code>. Luego, el servidor
            de desarrollo estará disponible en <code>http://localhost:5173</code>.
            <br />
            <br />
            <strong>¡Ya tienes tu sistema de autenticación funcionando!</strong>
          </span>
        </div>
      </section>
    </>
  );
}