import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Supabase</h1>
        <p className="content-subtitle">
          Proyecto, credenciales, clientes y proxy
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          1. Crear proyecto y obtener credenciales
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Entra a <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Supabase Dashboard</a> → <strong>New Project</strong>.</li>
          <li>Pon nombre, contraseña de la base de datos (guárdala) y región → crea.</li>
          <li>En el menú lateral: <strong>⚙️ Project Settings → API</strong> (Data API).</li>
          <li>Copia la <strong>Project URL</strong> y la <strong>anon key</strong> (pública).</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">🔑</span>
          <span>
            La <strong>anon key</strong> es <strong>pública</strong> por diseño (va en
            <code>NEXT_PUBLIC_*</code>). La <code>service_role</code> key NO debe ir
            nunca en el cliente.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📧</span>
          2. Configurar la confirmación de email (recomendado para desarrollo)
        </h2>
        <p className="section-paragraph">
          Por defecto Supabase exige <strong>confirmar el email</strong> antes de
          iniciar sesión. Para desarrollo local es más cómodo desactivarlo:
        </p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Supabase Dashboard → <strong>Authentication → Providers → Email</strong>.</li>
          <li>
            Desactiva <strong>"Confirm email"</strong> (o déjalo activo si quieres el
            flujo real de confirmación; la guía funciona en ambos casos).
          </li>
          <li>Guarda.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">⚙️</span>
          <span>
            Si dejas "Confirm email" activo, tras el registro el usuario debe abrir
            el enlace del correo (Supabase lo envía gratis) antes de poder iniciar
            sesión. Para producción es lo recomendado.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          3. Variables de entorno (<code>.env.local</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`# Supabase — Project Settings -> API (Data API)
# URL: https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
# anon/publishable key (pública, puede ir en el cliente)
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key"

# URL de tu app
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
        />
        <p className="section-paragraph">
          Reinicia el servidor de desarrollo tras añadirlas (las variables se cargan
          al arrancar).
        </p>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🖥️</span>
          4. Cliente del navegador (<code>lib/supabase/client.ts</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`"use client";

import { createBrowserClient } from "@supabase/ssr";

// Cliente del NAVEGADOR. Se usa en Client Components (ej: botón de Google).
// Crea una instancia nueva en cada uso (no exportes una singleton).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🖥️</span>
          5. Cliente del servidor (<code>lib/supabase/server.ts</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cliente del SERVIDOR. Se usa en Server Components, Server Actions y
// Route Handlers. Crea UNA instancia nueva por request (nunca compartir).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Si falla es porque estamos en un Server Component sin poder
            // escribir cookies (el proxy se encarga de refrescarlas).
          }
        },
      },
    }
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            Usa <code>getAll</code>/<code>setAll</code> (API actual del SSR). Los
            métodos viejos <code>get</code>/<code>set</code>/<code>remove</code>{" "}
            están deprecados y causan bugs de sesión difíciles de depurar.
          </span>
        </div>
      </section>
    </>
  );
}
