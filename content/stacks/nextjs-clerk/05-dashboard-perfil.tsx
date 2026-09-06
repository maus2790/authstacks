import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function DashboardPerfil() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Dashboard Protegido</h1>
        <p className="content-subtitle">
          Página privada y controles de auth en la home
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📊</span>
          1. Dashboard protegido (<code>app/dashboard/page.tsx</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Un Server Component que lee la sesión con <code>await auth()</code>,
          redirige al login si no hay usuario y muestra sus datos con{" "}
          <code>currentUser()</code>. Crea <code>app/dashboard/page.tsx</code>:
        </p>
        <CodeBlock
          code={`import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Clerk v7: auth() es async
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="rounded-2xl border border-gray-200 p-8 shadow-lg dark:border-white/10">
        <img
          src={user?.imageUrl}
          alt={user?.firstName ?? "Usuario"}
          className="mx-auto mb-4 h-20 w-20 rounded-full"
        />
        <p className="text-lg font-medium">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {user?.emailAddresses[0]?.emailAddress}
        </p>
      </div>
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            El logout no requiere código: el <code>UserButton</code> (paso 3) ya
            incluye "Cerrar sesión" en su menú. Si quieres una redirección tras
            cerrar sesión, pasa <code>afterSignOutUrl="/"</code> al{" "}
            <code>&lt;UserButton /&gt;</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔗</span>
          2. Home con controles de auth (<code>app/page.tsx</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          <code>clerk init</code> deja los controles listos en la home. Si la
          reemplazas, integra <code>SignInButton</code>, <code>SignUpButton</code>,
          <code>Show</code> y <code>UserButton</code> para que el usuario pueda
          crear su primera cuenta desde el header. Ejemplo completo:
        </p>
        <CodeBlock
          code={`import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-end gap-4 p-6">
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton afterSignOutUrl="/" />
        </Show>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-4xl font-bold">Bienvenido</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Inicia sesión o crea una cuenta desde el header
        </p>
      </main>
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">🧩</span>
          <span>
            <code>Show when="signed-out" / "signed-in"</code> es el sustituto
            moderno de <code>SignedIn</code>/<code>SignedOut</code> (deprecados en
            esta versión).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧪</span>
          3. Probar el flujo completo
        </h2>
        <CommandBlock command="npm run dev" />
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Abre <code>http://localhost:3000</code> → verás los botones Sign in / Sign up.</li>
          <li>Haz clic en <strong>Sign up</strong> → formulario de Clerk en <code>/sign-up</code>.</li>
          <li>Crea tu primer usuario → al autenticarte aparece el <code>UserButton</code>.</li>
          <li>Entra a <code>/dashboard</code> autenticado → ves tus datos.</li>
          <li>Visita <code>/dashboard</code> sin sesión → el proxy te manda a <code>/sign-in</code>.</li>
          <li>Abre el menú del <code>UserButton</code> → <strong>Sign out</strong> → vuelves a la home.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">🎉</span>
          <span>
            Si aparece el aviso "Configure your application" en el dashboard de
            Clerk, haz clic en él para completar los datos de tu app (nombre, etc.).
          </span>
        </div>
      </section>
    </>
  );
}
