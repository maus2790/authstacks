import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Frontend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Componentes de Login y Registro</h1>
        <p className="content-subtitle">
          Formularios de autenticación con Better Auth y diseño Glassmorphism
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          ETAPA 1: Cliente de Better Auth (<code>src/lib/auth-client.ts</code>)
        </h2>
        <p className="section-paragraph">
          Void ya proporciona un cliente preconfigurado y tipado desde <code>void/client</code>.
        </p>
        <CodeBlock
          code={`import { auth, createAuthClient } from "void/client";

export const authClient = auth;
export { createAuthClient };`}
        />
        <div className="tip">
          <span className="tip-icon">⚡</span>
          <span>
            Usar <code>void/client</code> asegura que todas las rutas y cabeceras de Better Auth
            estén sincronizadas automáticamente con tu servidor.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🎨</span>
          ETAPA 2: Estilos globales (<code>src/index.css</code>)
        </h2>
        <p className="section-paragraph">
          CSS completo con diseño Glassmorphism y tema Cyber Nebula. (Ver código completo en el archivo del proyecto)
        </p>
        <div className="tip">
          <span className="tip-icon">🎨</span>
          <span>
            El diseño incluye: efectos de vidrio esmerilado, gradientes neón, grid de fondo,
            animaciones de auroras y tipografías modernas (Inter + Outfit).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          ETAPA 3: Componente de Login (<code>src/components/Login.tsx</code>)
        </h2>
        <CodeBlock
          code={`import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message || "Credenciales incorrectas o usuario no encontrado");
        setLoading(false);
      } else if (data) {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Error al comunicarse con el servidor");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="app-background">
        <div className="aurora-glow-1" />
        <div className="aurora-glow-2" />
        <div className="bg-grid" />
      </div>

      <div className="auth-header-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span>Void · Drizzle ORM · Better Auth</span>
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="auth-card-title">Iniciar Sesión</h1>
          <p className="auth-card-subtitle">Ingresa a tu cuenta para continuar</p>
        </div>

        {error && (
          <div className="alert-box alert-error" style={{ marginBottom: "20px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Correo Electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input has-right-action"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: "8px" }}>
            {loading ? (
              <>
                <div className="spinner" />
                <span>Validando sesión...</span>
              </>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-nav">
          <span>¿No tienes una cuenta?</span>
          <Link to="/register" className="auth-link">Regístrate gratis</Link>
        </div>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          ETAPA 4: Componente de Registro (<code>src/components/Register.tsx</code>)
        </h2>
        <CodeBlock
          code={`import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe contener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message || "Error al crear la cuenta");
        setLoading(false);
      } else if (data) {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Error de conexión con el servidor");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="app-background">
        <div className="aurora-glow-1" />
        <div className="aurora-glow-2" />
        <div className="bg-grid" />
      </div>

      <div className="auth-header-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
        <span>Nuevo Usuario</span>
      </div>

      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="auth-card-title">Crear Cuenta</h1>
          <p className="auth-card-subtitle">Regístrate para probar el flujo de autenticación</p>
        </div>

        {error && (
          <div className="alert-box alert-error" style={{ marginBottom: "20px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Nombre Completo</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="reg-name"
                type="text"
                placeholder="Ej. Alex Morales"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Correo Electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                id="reg-email"
                type="email"
                placeholder="alex@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input has-right-action"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: "8px" }}>
            {loading ? (
              <>
                <div className="spinner" />
                <span>Creando cuenta en D1...</span>
              </>
            ) : (
              <>
                <span>Registrarse</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer-nav">
          <span>¿Ya tienes cuenta?</span>
          <Link to="/login" className="auth-link">Inicia sesión</Link>
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