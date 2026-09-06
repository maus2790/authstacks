import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          OAuth2 con arctic + cuenta de Google guardada en MongoDB
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">💡</span>
          1. Cómo funciona
        </h2>
        <p className="section-paragraph">
          Como nuestro auth es manual (JWT + MongoDB), el login social también lo
          implementamos: usamos <code>arctic</code> (la biblioteca OAuth2 estándar)
          para hablar con Google, guardamos la cuenta vinculada en la colección{" "}
          <code>accounts</code> y reutilizamos el <code>createSession</code> del
          paso 3 para la cookie. No necesitas NextAuth ni Auth.js.
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          2. Variables y credenciales de Google
        </h2>
        <p className="section-paragraph">
          Añade a tu <code>.env.local</code> y crea un proyecto OAuth en{" "}
          <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a>{" "}
          (credenciales de tipo "Aplicación web"):
        </p>
        <CodeBlock
          code={`GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret"`}
        />
        <p className="section-paragraph">
          En <strong>URIs de redireccionamiento autorizados</strong> registra:{" "}
          <code>http://localhost:3000/api/auth/google/callback</code>
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          3. Instalar arctic
        </h2>
        <CommandBlock command="npm install arctic" />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          4. Modelo Account (<code>lib/db/models.ts</code>) — añade esta tabla
        </h2>
        <p className="section-paragraph">
          Añade al final de <code>lib/db/models.ts</code>:
        </p>
        <CodeBlock
          code={`export interface IAccount {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  provider: string; // "google"
  providerAccountId: string; // sub de Google
}

const accountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
});

// Índice único: (provider + providerAccountId) identifica la cuenta social
accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export const Account: mongoose.Model<IAccount> =
  models.Account || model<IAccount>("Account", accountSchema);`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          5. Ruta que inicia el flujo (<code>app/api/auth/google/route.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Crea la carpeta <code>app/api/auth/google</code>. Genera{" "}
          <code>state</code> + <code>codeVerifier</code> (PKCE), los guarda en
          cookies y redirige a Google:
        </p>
        <CodeBlock
          code={`import { cookies } from "next/headers";
import { generateState, generateCodeVerifier, Google } from "arctic";

const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  \`\${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback\`
);

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["openid", "profile", "email"];

  const url = google.createAuthorizationURL(state, codeVerifier, scopes);

  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
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
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔁</span>
          6. Callback (<code>app/api/auth/google/callback/route.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Valida el código, busca/crea el usuario y la cuenta en MongoDB, y crea la
          sesión JWT:
        </p>
        <CodeBlock
          code={`import { cookies } from "next/headers";
import { Google } from "arctic";
import { connectToDatabase } from "@/lib/db";
import { User, Account } from "@/lib/db/models";
import { createSession } from "@/lib/auth";

const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  \`\${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback\`
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;
  const codeVerifier = cookieStore.get("google_oauth_code_verifier")?.value;

  if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
    return Response.redirect(new URL("/login?error=invalid_oauth", request.url));
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const userResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: \`Bearer \${tokens.accessToken()}\` } }
    );
    const googleUser = await userResponse.json();

    await connectToDatabase();

    // Buscar la cuenta vinculada
    let account = await Account.findOne({ provider: "google", providerAccountId: googleUser.sub });
    let user;

    if (account) {
      user = await User.findById(account.userId);
    } else {
      // Buscar por email (o crear usuario)
      user = await User.findOne({ email: googleUser.email });

      if (!user) {
        user = await User.create({
          email: googleUser.email,
          name: googleUser.name ?? googleUser.email.split("@")[0],
          passwordHash: "", // sin contraseña: solo acceso social
        });
      }

      await Account.create({
        userId: user._id,
        provider: "google",
        providerAccountId: googleUser.sub,
      });
    }

    await createSession({ userId: user._id.toString(), email: user.email });
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
          7. Botón de Google
        </h2>
        <p className="section-paragraph">
          El botón solo redirige a <code>/api/auth/google</code>. Añádelo a tu
          página de login:
        </p>
        <CodeBlock
          code={`"use client";

export function GoogleLoginButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = "/api/auth/google";
      }}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-semibold transition hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10"
    >
      Continuar con Google
    </button>
  );
}`}
        />
      </section>
    </>
  );
}
