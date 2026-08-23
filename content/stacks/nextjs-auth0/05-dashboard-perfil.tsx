import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function DashboardPerfil() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Dashboard y Perfil Protegido</h1>
        <p className="content-subtitle">
          Páginas protegidas con Auth0 y gestión de sesiones
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          1. Dashboard con datos del usuario
        </h2>
        <p className="section-paragraph">
          Crea <code>app/dashboard/page.tsx</code> con protección automática gracias al middleware:
        </p>
        <CodeBlock
          code={`import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/login");
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/api/auth/logout">
          <Button variant="danger">Cerrar sesión</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700">
          <div className="flex items-center gap-4">
            <img
              src={user.picture}
              alt={user.name}
              className="rounded-full w-16 h-16 border-2 border-blue-500"
            />
            <div>
              <p className="text-xl font-semibold">{user.name}</p>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 col-span-2">
          <h2 className="text-lg font-semibold mb-4">Información de la sesión</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-400">ID de usuario:</span> {user.sub}</p>
            <p><span className="text-gray-400">Email verificado:</span> {user.email_verified ? "✅ Sí" : "❌ No"}</p>
            <p><span className="text-gray-400">Proveedor:</span> {user.sub?.split("|")[0] || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          2. Perfil de usuario
        </h2>
        <p className="section-paragraph">
          Crea <code>app/profile/page.tsx</code> como una página protegida:
        </p>
        <CodeBlock
          code={`import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/login");
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard" className="text-blue-400 hover:underline">
          ← Volver al Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.picture}
            alt={user.name}
            className="rounded-full w-24 h-24 border-4 border-blue-500 mb-4"
          />
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
          <div className="mt-4 flex gap-3">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
              ID: {user.sub?.slice(0, 12)}...
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
              {user.email_verified ? "✅ Verificado" : "❌ No verificado"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          3. Protección de rutas en API Routes
        </h2>
        <p className="section-paragraph">
          Para proteger API Routes, usa <code>withApiAuthRequired</code>:
        </p>
        <CodeBlock
          code={`import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

export const GET = withApiAuthRequired(async function GET(req: NextRequest) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Aquí puedes acceder a la base de datos u otras operaciones
  return NextResponse.json({
    user: {
      id: user.sub,
      email: user.email,
      name: user.name,
    },
  });
});`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            <code>withApiAuthRequired</code> es un middleware que verifica la autenticación
            automáticamente antes de ejecutar tu handler de API.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          4. Acceso a tokens de acceso
        </h2>
        <p className="section-paragraph">
          Puedes obtener el token de acceso para llamar a APIs externas usando <code>getAccessToken</code>:
        </p>
        <CodeBlock
          code={`import { getAccessToken } from "@auth0/nextjs-auth0";

export async function fetchExternalAPI() {
  try {
    const { accessToken } = await getAccessToken();
    const response = await fetch("https://api.externa.com/data", {
      headers: {
        Authorization: \`Bearer \${accessToken}\`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching external API:", error);
    throw error;
  }
}`}
        />
      </section>
    </>
  );
}