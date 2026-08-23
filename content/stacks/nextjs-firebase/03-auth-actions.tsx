import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Server Actions de Autenticación</h1>
        <p className="content-subtitle">
          Funciones para login, registro, recuperación y gestión de perfil con Firebase
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          1. Acciones principales de autenticación
        </h2>
        <p className="section-paragraph">
          Crea <code>actions/auth/auth.ts</code> con las siguientes funciones usando Firebase Admin SDK:
        </p>

        <h3 className="subsection-title">1.1. Obtener sesión (<code>lib/firebase/auth.ts</code>)</h3>
        <p className="section-paragraph">
          Primero, crea <code>lib/firebase/auth.ts</code> con funciones auxiliares:
        </p>
        <CodeBlock
          code={`import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-session")?.value;
  if (!token) return null;

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verificando token:", error);
    return null;
  }
}

export async function createSessionCookie(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
  return sessionCookie;
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("firebase-session");
}`}
        />

        <h3 className="subsection-title">1.2. Registro con email y contraseña</h3>
        <p className="section-paragraph">En <code>actions/auth/auth.ts</code>:</p>
        <CodeBlock
          code={`"use server";
import { adminAuth } from "@/lib/firebase/admin";
import { createSessionCookie } from "@/lib/firebase/auth";

export async function signup(formData: { email: string; password: string; name: string }) {
  try {
    // Crear usuario en Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email: formData.email,
      password: formData.password,
      displayName: formData.name,
    });

    // (Opcional) Guardar perfil en Firestore
    // const { adminDb } = await import("@/lib/firebase/admin");
    // await adminDb.collection("users").doc(userRecord.uid).set({
    //   name: formData.name,
    //   email: formData.email,
    //   createdAt: new Date(),
    // });

    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    console.error("Error en signup:", error);
    return { success: false, message: error.message };
  }
}`}
        />

        <h3 className="subsection-title">1.3. Login con email y contraseña</h3>
        <CodeBlock
          code={`export async function login(formData: { email: string; password: string }) {
  try {
    // Nota: Firebase Admin no soporta login con email/password directamente.
    // En su lugar, se usa el cliente Firebase en el frontend para obtener el idToken,
    // y luego se crea la cookie de sesión en el servidor.
    // Este action se usa en combinación con el frontend.
    // Redirigimos al cliente para que use el SDK de Firebase.
    return { success: false, message: "Usa el cliente Firebase para login" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}`}
        />

        <p className="section-paragraph">
          <strong>Nota:</strong> Para el login, usaremos el cliente de Firebase en el frontend y luego
          intercambiaremos el token por una cookie de sesión a través de una API Route.
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          2. API Routes para manejo de sesiones
        </h2>

        <h3 className="subsection-title">2.1. Crear cookie de sesión (<code>app/api/auth/callback/route.ts</code>)</h3>
        <CodeBlock
          code={`import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/firebase/auth";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "ID token missing" }, { status: 400 });
    }

    const sessionCookie = await createSessionCookie(idToken);

    const response = NextResponse.json({ success: true });
    response.cookies.set("firebase-session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 5, // 5 días
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error creating session cookie:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`}
        />

        <h3 className="subsection-title">2.2. Cerrar sesión (<code>app/api/auth/signout/route.ts</code>)</h3>
        <CodeBlock
          code={`import { NextResponse } from "next/server";
import { deleteSessionCookie } from "@/lib/firebase/auth";

export async function POST() {
  await deleteSessionCookie();
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          3. Obtener usuario y actualizar perfil
        </h2>

        <h3 className="subsection-title">3.1. Obtener usuario (<code>actions/auth/get-user.ts</code>)</h3>
        <CodeBlock
          code={`"use server";
import { getSession } from "@/lib/firebase/auth";
import { adminAuth } from "@/lib/firebase/admin";

export async function getUser() {
  try {
    const session = await getSession();
    if (!session) return null;

    const user = await adminAuth.getUser(session.uid);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }
}`}
        />

        <h3 className="subsection-title">3.2. Actualizar perfil (<code>actions/auth/update-profile.ts</code>)</h3>
        <CodeBlock
          code={`"use server";
import { getSession } from "@/lib/firebase/auth";
import { adminAuth } from "@/lib/firebase/admin";

export async function updateProfile(data: { displayName?: string; photoURL?: string }) {
  try {
    const session = await getSession();
    if (!session) throw new Error("No autenticado");

    await adminAuth.updateUser(session.uid, {
      displayName: data.displayName,
      photoURL: data.photoURL,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error actualizando perfil:", error);
    return { success: false, message: error.message };
  }
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📧</span>
          4. Recuperación de contraseña
        </h2>
        <p className="section-paragraph">
          Firebase proporciona envío de correos de restablecimiento. Puedes usar el cliente Firebase
          directamente en el frontend, o crear una Server Action:
        </p>
        <CodeBlock
          code={`"use server";
import { adminAuth } from "@/lib/firebase/admin";

export async function sendPasswordResetEmail(email: string) {
  try {
    await adminAuth.generatePasswordResetLink(email);
    // Nota: Firebase Admin no envía el correo directamente, solo genera el enlace.
    // Para enviarlo, necesitas usar un servicio externo (SendGrid, Resend, etc.)
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>Firebase Auth envía correos de restablecimiento automáticamente si configuras las plantillas en la consola. Puedes personalizarlas en <strong>Authentication → Templates</strong>.</span>
        </div>
      </section>
    </>
  );
}