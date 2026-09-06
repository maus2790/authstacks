import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Sesión y Server Actions</h1>
        <p className="content-subtitle">
          Cookie de sesión, login, registro y logout con Firebase
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🍪</span>
          1. Cómo funciona la sesión (importante)
        </h2>
        <p className="section-paragraph">
          Firebase Auth trabaja con tokens. El flujo recomendado en Next.js App
          Router:
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>El navegador (SDK web) autentica al usuario → obtiene un <strong>ID token</strong>.</li>
          <li>Envía ese token al servidor (Server Action).</li>
          <li>El servidor (Admin SDK) lo valida y crea una <strong>session cookie</strong> httpOnly.</li>
          <li>Las rutas protegidas leen y verifican esa cookie en cada request.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            La cookie es <code>httpOnly</code>: el navegador no puede leerla, solo
            el servidor. Así el usuario no falsifica su sesión.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          2. Leer la sesión (<code>lib/firebase/session.ts</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

// Lee la cookie de sesión y devuelve el usuario autenticado o null.
// La cookie la crea la Server Action con un session cookie de Firebase.
export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("firebase-session")?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded; // { uid, email, name?, picture?, ... }
  } catch (error) {
    return null;
  }
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          3. Server Actions (<code>actions/auth.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          La acción <code>createSessionAction</code> intercambia el ID token del
          navegador por una session cookie; <code>logoutAction</code> la borra y
          revoca la sesión. Crea <code>actions/auth.ts</code> con este contenido
          completo:
        </p>
        <CodeBlock
          code={`"use server";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export type ActionState = { error?: string } | undefined;

// Intercambia el ID token (obtenido con el SDK web en el navegador)
// por una session cookie de Firebase y la guarda en httpOnly.
export async function createSessionAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const idToken = String(formData.get("idToken") ?? "");

  if (!idToken) return { error: "Token inválido" };

  try {
    // Verificar el token y crear session cookie (máx. 14 días)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const cookieStore = await cookies();
    cookieStore.set("firebase-session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 5,
      path: "/",
    });

    return { error: undefined };
  } catch (error) {
    return { error: "No se pudo crear la sesión" };
  }
}

// Cierra la sesión: borra la cookie y revoca la sesión de Firebase.
export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("firebase-session")?.value;

  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie);
      await adminAuth.revokeRefreshTokens(decoded.uid);
    } catch (error) {
      // si la cookie no es válida, solo la borramos
    }
  }

  cookieStore.delete("firebase-session");
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            El <code>expiresIn</code> de una session cookie de Firebase va de 5
            minutos a 14 días (1000 * 60 * 60 * 24 * 14). 5 días es un valor
            común.
          </span>
        </div>
      </section>
    </>
  );
}
