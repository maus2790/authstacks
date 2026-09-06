import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Activa Google en Firebase Auth y añade el botón
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">💡</span>
          1. Cómo funciona con Firebase
        </h2>
        <p className="section-paragraph">
          Firebase Auth soporta Google nativamente. Activas el proveedor en la
          consola y usas <code>GoogleAuthProvider</code> +{" "}
          <code>signInWithPopup</code> en el navegador. El resto del flujo (crear la
          session cookie) es idéntico al paso 4.
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          2. Activar Google en Firebase Console
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Firebase Console → <strong>Authentication → Sign-in method</strong>.</li>
          <li>Activa <strong>Google</strong>.</li>
          <li>
            Firebase te permite usar sus credenciales de Google ("Web SDK
            configuration") o las tuyas. Para desarrollo, elige la opción por
            defecto y guarda.
          </li>
        </ol>
        <div className="tip">
          <span className="tip-icon">📋</span>
          <span>
            A diferencia de otros stacks, <strong>no configuras URIs de callback</strong>{" "}
            en Google Cloud si usas las credenciales de Firebase. Para producción
            con tu propio proyecto de Google, sigue el enlace que Firebase te da
            dentro del proveedor.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          3. Botón de Google (<code>components/auth/GoogleLoginButton.tsx</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Crea la carpeta <code>components/auth</code> y el botón. Usa{" "}
          <code>signInWithPopup</code> y luego el mismo{" "}
          <code>createSessionAction</code> del paso 3:
        </p>
        <CodeBlock
          code={`"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { createSessionAction } from "@/actions/auth";

export function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const auth = getClientAuth();
      const provider = new GoogleAuthProvider();

      // 1. Popup de Google -> obtiene el usuario y su idToken
      const credential = await signInWithPopup(auth, provider);
      const idToken = await credential.user.getIdToken();

      // 2. Crear la session cookie (igual que en login/registro)
      const sessionForm = new FormData();
      sessionForm.append("idToken", idToken);
      const result = await createSessionAction(undefined, sessionForm);

      if (result?.error) {
        console.error(result.error);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      // El usuario puede cerrar el popup (auth/popup-closed-by-user) -> no es error real
      if (!err?.code?.includes("popup-closed")) {
        console.error("Error con Google:", err);
      }
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-semibold transition hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10 disabled:opacity-50"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {loading ? "Conectando..." : "Continuar con Google"}
    </button>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔗</span>
          4. Integrar el botón en el login
        </h2>
        <p className="section-paragraph">
          En tu <code>app/login/page.tsx</code>, importa el botón y añádelo después
          del <code>&lt;/form&gt;</code>:
        </p>
        <CodeBlock
          code={`import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

// Dentro del componente LoginPage, después del </form>:
<GoogleLoginButton />`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <code>signInWithPopup</code> necesita un dominio autorizado. En
            localhost funciona sin configuración. En producción, añade tu dominio en{" "}
            <strong>Authentication → Settings → Authorized domains</strong>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔄</span>
          5. Cómo funciona el flujo
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>El usuario hace clic → Firebase abre el popup de Google.</li>
          <li>Google autentica → Firebase crea (o vincula) el usuario.</li>
          <li>Se obtiene el <code>idToken</code> → se crea la session cookie (paso 3).</li>
          <li>Redirección a <code>/dashboard</code>.</li>
        </ol>
      </section>
    </>
  );
}
