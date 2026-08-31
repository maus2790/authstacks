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
          1. Variables de entorno y instalación
        </h2>
        <p className="section-paragraph">Instala <code>arctic</code> (OAuth2 para Lucia):</p>
        <CommandBlock command="npm install arctic" />
        <p className="section-paragraph">Añade a tu <code>.env.local</code>:</p>
        <CodeBlock
          code={`# Google OAuth
GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret"`}
        />
        <p className="section-paragraph">
          Reinicia el servidor de desarrollo tras añadirlas (las variables de entorno
          se cargan al arrancar).
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          2. Configuración en Google Cloud
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a>.</li>
          <li>Crea un proyecto o selecciona uno existente.</li>
          <li>Ve a <strong>APIs y Servicios → Credenciales</strong>.</li>
          <li>Crea un <strong>ID de cliente OAuth</strong> de tipo "Aplicación web".</li>
          <li>
            En <strong>Orígenes autorizados de JavaScript</strong>, añade:
            <CodeBlock code="http://localhost:3000" />
          </li>
          <li>
            En <strong>URIs de redireccionamiento autorizados</strong>, añade:
            <CodeBlock code="http://localhost:3000/api/auth/google/callback" />
          </li>
          <li>Copia el <strong>ID de cliente</strong> y <strong>Secreto de cliente</strong> al paso 1.</li>
        </ol>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">✨</span>
          3. Proveedor de Google (<code>lib/auth/google.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Crea la carpeta <code>lib/auth</code> (si no existe) y el archivo{" "}
          <code>lib/auth/google.ts</code>:
        </p>
        <CodeBlock
          code={`import { Google } from "arctic";

// Proveedor de Google (arctic). El redirectURI debe coincidir con el registrado
// en Google Cloud Console y en la URL de callback de tu app.
export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  \`\${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback\`
);`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          4. Ruta que inicia el flujo (<code>app/api/auth/google/route.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Genera el <code>state</code> y <code>codeVerifier</code> (protección CSRF +
          PKCE), los guarda en cookies y redirige a Google:
        </p>
        <CodeBlock
          code={`import { cookies } from "next/headers";
import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/lib/auth/google";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["openid", "profile", "email"];

  const url = google.createAuthorizationURL(state, codeVerifier, scopes);

  // Guardar state y codeVerifier en cookies httpOnly para validarlos en el callback
  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutos
  });
  cookieStore.set("google_oauth_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
  });

  return Response.redirect(url);
}`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            En arctic v3 (a diferencia de v1) el flujo usa <strong>PKCE</strong>:{" "}
            <code>createAuthorizationURL(state, codeVerifier, scopes)</code> y luego{" "}
            <code>validateAuthorizationCode(code, codeVerifier)</code>. Sin guardar
            el <code>codeVerifier</code> en una cookie, el callback falla.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔁</span>
          5. Callback de Google (<code>app/api/auth/google/callback/route.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Valida el <code>state</code> y el código, busca o crea el usuario, crea la
          sesión de Lucia y redirige al dashboard:
        </p>
        <CodeBlock
          code={`import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { google } from "@/lib/auth/google";
import { db, users, accounts } from "@/lib/db";
import { lucia } from "@/lib/lucia";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;
  const codeVerifier = cookieStore.get("google_oauth_code_verifier")?.value;

  // Validar que el state coincida (protección CSRF)
  if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
    return Response.redirect(new URL("/login?error=invalid_oauth", request.url));
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    // Obtener el perfil de Google
    const userResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: \`Bearer \${tokens.accessToken()}\`,
        },
      }
    );
    const googleUser = await userResponse.json();

    // Buscar si ya existe una cuenta vinculada a este Google
    const existingAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.providerUserId, googleUser.sub))
      .get();

    let userId: string;

    if (existingAccount) {
      userId = existingAccount.userId;
    } else {
      // Crear usuario nuevo (o vincular si el email ya existe)
      const existingUser = googleUser.email
        ? await db.select().from(users).where(eq(users.email, googleUser.email)).get()
        : null;

      userId = existingUser?.id ?? generateId(15);

      if (!existingUser) {
        await db.insert(users).values({
          id: userId,
          email: googleUser.email,
          name: googleUser.name ?? googleUser.email.split("@")[0],
        });
      }

      await db.insert(accounts).values({
        id: generateId(15),
        userId,
        providerId: "google",
        providerUserId: googleUser.sub,
        accessToken: tokens.accessToken(),
        refreshToken: tokens.hasRefreshToken() ? tokens.refreshToken() : null,
        expiresAt: tokens.accessTokenExpiresAt(),
      });
    }

    // Crear sesión de Lucia
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // Limpiar cookies temporales de OAuth
    cookieStore.delete("google_oauth_state");
    cookieStore.delete("google_oauth_code_verifier");

    return Response.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error en callback de Google:", error);
    return Response.redirect(new URL("/login?error=google_auth_failed", request.url));
  }
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          6. Botón de Google (<code>components/auth/GoogleLoginButton.tsx</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Crea el Client Component y añádelo a tu página de login:
        </p>
        <CodeBlock
          code={`"use client";

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Redirigir al route handler que inicia el flujo OAuth
    window.location.href = "/api/auth/google";
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-semibold transition hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continuar con Google
    </button>
  );
}`}
        />
        <p className="section-paragraph">
          Y en tu <code>app/login/page.tsx</code>, importa y renderiza el botón debajo
          del formulario:
        </p>
        <CodeBlock
          code={`import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

// Dentro del componente LoginPage, después del </form>:
<GoogleLoginButton />`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔄</span>
          7. Cómo funciona el flujo
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>El usuario hace clic en el botón → redirige a <code>/api/auth/google</code>.</li>
          <li>Esa ruta genera <code>state</code> + <code>codeVerifier</code>, los guarda en cookies y redirige a Google.</li>
          <li>Google autentica y vuelve a <code>/api/auth/google/callback?code=...&state=...</code>.</li>
          <li>El callback valida el <code>state</code> (CSRF) y el código (PKCE), busca o crea el usuario y la cuenta OAuth.</li>
          <li>Se crea la sesión de Lucia y se redirige a <code>/dashboard</code>.</li>
        </ol>
      </section>
    </>
  );
}
