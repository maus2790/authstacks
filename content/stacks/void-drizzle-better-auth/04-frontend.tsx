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
          CSS completo con diseño Glassmorphism y tema Cyber Nebula.
        </p>
        <CodeBlock
          code={`/* src/index.css */
:root {
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-heading: 'Outfit', var(--font-sans);
  --font-mono: 'JetBrains Mono', monospace;

  /* Color Palette - Cyber Nebula */
  --bg-primary: #090b10;
  --bg-secondary: #0f131d;
  --bg-card: rgba(18, 24, 38, 0.72);
  --bg-card-hover: rgba(26, 34, 52, 0.85);
  --bg-input: rgba(13, 17, 26, 0.65);
  --bg-input-focus: rgba(19, 25, 39, 0.9);

  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-medium: rgba(255, 255, 255, 0.14);
  --border-focus: #6366f1;
  --border-glow: rgba(99, 102, 241, 0.35);

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-inverse: #020617;

  /* Vibrant Accents */
  --accent-cyan: #06b6d4;
  --accent-indigo: #6366f1;
  --accent-purple: #a855f7;
  --accent-pink: #ec4899;
  --accent-emerald: #10b981;
  --accent-rose: #f43f5e;

  /* Gradients */
  --grad-primary: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%);
  --grad-hover: linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #0891b2 100%);
  --grad-card: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  --grad-accent-border: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(168, 85, 247, 0.3), rgba(6, 182, 212, 0.6));

  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.25);
  --shadow-md: 0 8px 24px -4px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.15);
  --shadow-glow: 0 0 25px rgba(99, 102, 241, 0.4);

  /* Spacings & Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Background Atmosphere */
.app-background {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.aurora-glow-1 {
  position: absolute;
  top: -15%;
  left: 20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 70%);
  filter: blur(80px);
  animation: floatOrb 18s ease-in-out infinite alternate;
}

.aurora-glow-2 {
  position: absolute;
  bottom: -10%;
  right: 15%;
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%);
  filter: blur(90px);
  animation: floatOrb 22s ease-in-out infinite alternate-reverse;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
}

@keyframes floatOrb {
  0% {
    transform: translate(0, 0) scale(1);
  }

  100% {
    transform: translate(60px, 40px) scale(1.1);
  }
}

/* Layout Containers */
.auth-page-container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.auth-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 20px;
  backdrop-filter: blur(8px);
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 36px 32px;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--grad-primary);
}

.auth-card-header {
  text-align: center;
  margin-bottom: 28px;
}

.auth-card-title {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.auth-card-subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Forms & Inputs */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  pointer-events: none;
}

.input-action-btn {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.input-action-btn:hover {
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  background: var(--bg-input);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  outline: none;
  transition: all 0.2s ease;
}

.form-input.has-right-action {
  padding-right: 42px;
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:focus {
  background: var(--bg-input-focus);
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--border-glow);
}

/* Buttons */
.btn-primary {
  width: 100%;
  padding: 13px 20px;
  background: var(--grad-primary);
  border: none;
  border-radius: var(--radius-md);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background: var(--grad-hover);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 9px 18px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: var(--border-medium);
}

.btn-danger {
  padding: 10px 20px;
  background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
  border: none;
  border-radius: var(--radius-md);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
  box-shadow: 0 6px 18px rgba(244, 63, 94, 0.45);
  transform: translateY(-1px);
}

/* Error & Success Alerts */
.alert-box {
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: fadeIn 0.25s ease;
}

.alert-error {
  background: rgba(244, 63, 94, 0.12);
  border: 1px solid rgba(244, 63, 94, 0.35);
  color: #fda4af;
}

.alert-success {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #6ee7b7;
}

/* Links & Nav */
.auth-footer-nav {
  margin-top: 24px;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.auth-link {
  color: #a5b4fc;
  text-decoration: none;
  font-weight: 600;
  margin-left: 6px;
  transition: color 0.15s ease;
}

.auth-link:hover {
  color: #c7d2fe;
  text-decoration: underline;
}

/* Spinners & Animations */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dashboard Layout */
.dashboard-container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.dashboard-nav {
  padding: 18px 32px;
  background: rgba(15, 19, 29, 0.8);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-brand-logo {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  background: var(--grad-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.nav-brand-text {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
}

.nav-brand-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(6, 182, 212, 0.15);
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: var(--accent-cyan);
  font-weight: 600;
  text-transform: uppercase;
}

.dashboard-main {
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.hero-welcome-card {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.hero-welcome-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  background: var(--grad-primary);
}

.user-profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar-large {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
  border: 2px solid rgba(255, 255, 255, 0.15);
}

.user-details h1 {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
}

.user-details p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.status-tag.active {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.dashboard-widget {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 12px;
}

.widget-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.widget-badge {
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.02);
  font-size: 0.875rem;
}

.info-label {
  color: var(--text-muted);
  font-weight: 500;
}

.info-value {
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tech-stack-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.tech-pill-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.loading-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .hero-welcome-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-nav {
    padding: 16px 20px;
  }
}`}
        />
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