import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function GoogleOAuth() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Login con Google (OAuth)</h1>
        <p className="content-subtitle">
          Implementación de autenticación con Google usando NextAuth.js (Auth.js) con MongoDB
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          1. Instalación de NextAuth.js
        </h2>
        <CommandBlock command="npm install next-auth @auth/mongodb-adapter mongodb" />
        <div className="tip">
          <span className="tip-icon">📚</span>
          <span>Usaremos el adaptador de MongoDB para guardar las sesiones de NextAuth en nuestra base de datos.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          2. Variables de entorno adicionales
        </h2>
        <CodeBlock
          code={`# NextAuth
NEXTAUTH_SECRET="tu-secreto-nextauth"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="tu-client-id"
GOOGLE_CLIENT_SECRET="tu-client-secret"`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          3. Configuración de NextAuth (<code>auth.ts</code>)
        </h2>
        <p className="section-paragraph">Crea <code>lib/auth/nextauth.ts</code>:</p>
        <CodeBlock
          code={`import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db/mongodb-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          4. API Route de NextAuth
        </h2>
        <p className="section-paragraph">Crea <code>app/api/auth/[...nextauth]/route.ts</code>:</p>
        <CodeBlock
          code={`import { handlers } from "@/lib/auth/nextauth";
export const { GET, POST } = handlers;`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          5. Botón de Google en el frontend
        </h2>
        <CodeBlock
          code={`"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function GoogleLoginButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signIn("google")}
      className="w-full flex items-center justify-center gap-2"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continuar con Google
    </Button>
  );
}`}
        />
        <p className="section-paragraph">Luego, importa este botón en tu página de login.</p>
      </section>
    </>
  );
}