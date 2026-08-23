import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Autenticación con Google usando Lucia y Arctic
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          1. Instalación de Arctic
        </h2>
        <CommandBlock command="npm install arctic" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>
            Arctic es una biblioteca para OAuth2 que Lucia recomienda. Soporta Google, GitHub, Discord, etc.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          2. Configuración del proveedor Google en el servidor
        </h2>
        <p className="section-paragraph">
          Crea <code>lib/auth/google.ts</code> con la configuración de OAuth:
        </p>
        <CodeBlock
          code={`import { Google } from "arctic";
import { generateId } from "lucia";
import { db, users, accounts } from "@/lib/db";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  \`\${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback\`
);

export async function handleGoogleCallback(code: string) {
  const tokens = await google.validateAuthorizationCode(code);
  const googleUserResponse = await fetch(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      headers: {
        Authorization: \`Bearer \${tokens.accessToken}\`,
      },
    }
  );
  const googleUser = await googleUserResponse.json();

  // Buscar cuenta existente por providerUserId
  let account = await db
    .select()
    .from(accounts)
    .where(eq(accounts.providerUserId, googleUser.sub))
    .get();

  let user;

  if (account) {
    user = await db
      .select()
      .from(users)
      .where(eq(users.id, account.userId))
      .get();
  } else {
    // Crear nuevo usuario
    const userId = generateId(15);
    await db.insert(users).values({
      id: userId,
      name: googleUser.name || googleUser.email.split("@")[0],
      email: googleUser.email,
      emailVerified: true,
      avatarUrl: googleUser.picture,
    });

    await db.insert(accounts).values({
      id: generateId(15),
      userId,
      providerId: "google",
      providerUserId: googleUser.sub,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || null,
      expiresAt: tokens.accessTokenExpiresAt || null,
    });

    user = await db.select().from(users).where(eq(users.id, userId)).get();
  }

  // Crear sesión
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

export async function getGoogleAuthURL() {
  return google.createAuthorizationURL();
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          3. API Route para el callback de Google
        </h2>
        <p className="section-paragraph">
          Crea <code>app/api/auth/google/callback/route.ts</code>:
        </p>
        <CodeBlock
          code={`import { handleGoogleCallback } from "@/lib/auth/google";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  try {
    await handleGoogleCallback(code);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error en OAuth de Google:", error);
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", request.url));
  }
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          4. Botón de Google en el frontend
        </h2>
        <CodeBlock
          code={`"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/google");
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No se pudo obtener la URL de autenticación");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al iniciar sesión con Google");
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {loading ? "Cargando..." : "Continuar con Google"}
    </Button>
  );
}`}
        />
        <p className="section-paragraph">
          También necesitas crear la ruta <code>app/api/auth/google/route.ts</code> para devolver la URL de autenticación:
        </p>
        <CodeBlock
          code={`import { getGoogleAuthURL } from "@/lib/auth/google";
import { NextResponse } from "next/server";

export async function GET() {
  const url = await getGoogleAuthURL();
  return NextResponse.json({ url });
}`}
        />
      </section>
    </>
  );
}