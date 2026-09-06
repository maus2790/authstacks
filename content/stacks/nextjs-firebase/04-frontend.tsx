import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Frontend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Páginas de Login y Registro</h1>
        <p className="content-subtitle">
          Formularios que autentican con el SDK web y crean la sesión
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">💡</span>
          1. Cómo funcionan los formularios
        </h2>
        <p className="section-paragraph">
          A diferencia de las bibliotecas que has visto, aquí el login NO ocurre en
          una Server Action con email/password: Firebase valida las contraseñas con
          su SDK <strong>web</strong> en el navegador. El flujo de cada formulario:
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>El usuario envía el formulario.</li>
          <li>
            <code>signInWithEmailAndPassword</code> (o{" "}
            <code>createUserWithEmailAndPassword</code>) autentica contra Firebase.
          </li>
          <li>Se obtiene el <code>idToken</code> del usuario autenticado.</li>
          <li>Se llama a <code>createSessionAction</code> para crear la cookie de sesión.</li>
          <li>Redirección a <code>/dashboard</code>.</li>
        </ol>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          2. Página de Login (<code>app/login/page.tsx</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { createSessionAction } from "@/actions/auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      // 1. Autenticar con Firebase Auth (SDK web) -> obtiene idToken
      const auth = getClientAuth();
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();

      // 2. Intercambiar el idToken por una session cookie en el servidor
      const sessionForm = new FormData();
      sessionForm.append("idToken", idToken);
      const result = await createSessionAction(undefined, sessionForm);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("invalid-credential") || msg.includes("user-not-found")) {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      } else if (msg.includes("invalid-api-key")) {
        setError(
          "Falta la config web de Firebase (.env.local): revisa NEXT_PUBLIC_FIREBASE_API_KEY."
        );
      } else {
        setError(msg);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-6 text-3xl font-bold text-center">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </a>
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
          3. Página de Registro (<code>app/register/page.tsx</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { createSessionAction } from "@/actions/auth";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // 1. Crear usuario en Firebase Auth (SDK web)
      const auth = getClientAuth();
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });

      // 2. Intercambiar el idToken por una session cookie en el servidor
      const idToken = await credential.user.getIdToken();
      const sessionForm = new FormData();
      sessionForm.append("idToken", idToken);
      const result = await createSessionAction(undefined, sessionForm);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("email-already-in-use")) {
        setError("Este correo ya está registrado.");
      } else if (msg.includes("weak-password")) {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (msg.includes("invalid-api-key")) {
        setError(
          "Falta la config web de Firebase (.env.local): revisa NEXT_PUBLIC_FIREBASE_API_KEY."
        );
      } else {
        setError(msg);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-6 text-3xl font-bold text-center">Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Tu nombre"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}`}
        />
      </section>
    </>
  );
}
