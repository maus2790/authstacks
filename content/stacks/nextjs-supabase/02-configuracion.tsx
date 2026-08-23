import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Supabase</h1>
        <p className="content-subtitle">
          Clientes, variables de entorno y middleware
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔷</span>
          1. Creación de proyecto en Supabase
        </h2>
        <p className="section-paragraph">Sigue estos pasos en el Dashboard de Supabase:</p>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Haz clic en <strong>"New Project"</strong>.</li>
          <li>Completa el formulario: organización, nombre, contraseña segura (guárdala), región.</li>
          <li>Marca <strong>Enable Data API</strong> y <strong>Enable automatic RLS</strong>.</li>
          <li>Espera a que se cree el proyecto.</li>
        </ol>
        <p className="section-paragraph">Obtén las credenciales:</p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li><strong>Project URL:</strong> Ejemplo <code>https://smsdrwkqwrchqbobbyxi.supabase.co</code></li>
          <li><strong>Publishable Key (anon key):</strong> Ejemplo <code>sb_publishtable_N9cZDAE01QhXkS2kuwOMw_y8ci</code></li>
        </ul>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>Estas credenciales son sensibles. La Publishable Key es segura para el cliente.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          2. Variables de entorno (<code>.env.local</code>)
        </h2>
        <p className="section-paragraph">Crea el archivo <code>.env.local</code> con:</p>
        <CodeBlock
          code={`NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key-aqui"
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🗄️</span>
          3. Creación de tablas en Supabase
        </h2>
        <p className="section-paragraph">
          Ve a <strong>SQL Editor</strong> y ejecuta el siguiente script para crear la tabla <code>profiles</code> y configurar RLS:
        </p>
        <CodeBlock
          code={`-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  created_at timestamp with time zone,
  name text,
  email text,
  country_code text,
  phone text,
  avatar_url text
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Trigger para crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, created_at, updated_at, name, email, avatar_url)
  values (
    new.id,
    now(),
    now(),
    new.raw_user_meta_data->>'name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Configurar Storage para avatares
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar." on storage.objects
  for update using ((select auth.uid()) = owner) with check (bucket_id = 'avatars');`}
        />
        <div className="tip">
          <span className="tip-icon">✅</span>
          <span>Después de ejecutar el script, verifica que la tabla <code>profiles</code> existe en <strong>Table Editor</strong>.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📧</span>
          4. Plantillas de correo
        </h2>
        <p className="section-paragraph">
          Personaliza los correos de confirmación y recuperación en <strong>Authentication → Email</strong>.
          Puedes usar plantillas HTML personalizadas (ver código completo en los archivos del proyecto).
        </p>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>Las variables <code>{`{{ .SiteURL }}`}</code> y <code>{`{{ .TokenHash }}`}</code> son reemplazadas automáticamente por Supabase.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔌</span>
          5. Clientes de Supabase
        </h2>

        <h3 className="subsection-title">5.1. Cliente del navegador (<code>lib/supabase/client.ts</code>)</h3>
        <CodeBlock
          code={`import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}`}
        />

        <h3 className="subsection-title">5.2. Cliente del servidor (<code>lib/supabase/server.ts</code>)</h3>
        <CodeBlock
          code={`import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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
            // Ignorar en Server Components
          }
        },
      },
    }
  );
}`}
        />

        <h3 className="subsection-title">5.3. Middleware (<code>lib/supabase/proxy.ts</code>)</h3>
        <CodeBlock
          code={`import { getUser } from '@/actions/auth/get-user';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const user = await getUser();
  const protectedRoutes = ['/dashboard', '/profile', '/update-password'];

  if (!user && protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (user && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}`}
        />
      </section>
    </>
  );
}