import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function AuthActions() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Server Actions de Autenticación</h1>
        <p className="content-subtitle">
          Todas las acciones del servidor: login, registro, recuperación, actualización y gestión de perfil
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📡</span>
          1. Acciones principales de autenticación
        </h2>
        <p className="section-paragraph">
          Crea <code>actions/auth/auth.ts</code> con las siguientes funciones:
        </p>

        <h3 className="subsection-title">1.1. Login</h3>
        <CodeBlock
          code={`'use server'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: { email: string, password: string }) {
  const supabase = await createClient()
  const { error, data } = await supabase.auth.signInWithPassword(formData)

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: "Usuario autenticado exitosamente", data }
}`}
        />

        <h3 className="subsection-title">1.2. Signup</h3>
        <CodeBlock
          code={`export async function signup(formData: { name: string, email: string, password: string }) {
  const supabase = await createClient()
  const { error, data } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: { name: formData.name }
    }
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: "Usuario registrado exitosamente", data }
}`}
        />

        <h3 className="subsection-title">1.3. Enviar correo de recuperación</h3>
        <CodeBlock
          code={`export async function sendRecoveryEmail(formData: { email: string }) {
  const supabase = await createClient()
  const { error, data } = await supabase.auth.resetPasswordForEmail(formData.email)

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: "Correo de recuperación enviado exitosamente", data }
}`}
        />

        <h3 className="subsection-title">1.4. Actualizar contraseña</h3>
        <CodeBlock
          code={`export async function updatePassword(formData: { password: string }) {
  const supabase = await createClient()
  const { error, data } = await supabase.auth.updateUser({
    password: formData.password
  })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: 'Contraseña actualizada exitosamente', data }
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">👤</span>
          2. Acciones de usuario (get-user, update-avatar, update-profile)
        </h2>

        <h3 className="subsection-title">2.1. Obtener usuario (<code>actions/auth/get-user.ts</code>)</h3>
        <CodeBlock
          code={`"use server"
import { createClient } from "@/lib/supabase/server"
import { User } from "@/interfaces/user";

export const getUser = async (): Promise<User | null> => {
  try {
    const supabase = await createClient()
    const { data: { user: session } } = await supabase.auth.getUser()

    if (!session) return null

    const userId = session.id;

    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select("*")
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return null
    }

    return userData;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null
  }
}`}
        />

        <h3 className="subsection-title">2.2. Actualizar avatar (<code>actions/auth/update-avatar.ts</code>)</h3>
        <CodeBlock
          code={`'use server'
import { createClient } from '@/lib/supabase/server'

export async function updateAvatar(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('file') as File;
  const userId = formData.get('userId') as string;

  const fileExt = file.name.split('.').pop()
  const filePath = \`\${userId}.\${fileExt}\`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    throw new Error(\`Error al subir imagen: \${uploadError.message}\`)
  }

  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrlData.publicUrl, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (updateError) {
    throw new Error(\`Error al actualizar perfil: \${updateError.message}\`)
  }

  return { publicUrl: publicUrlData.publicUrl }
}`}
        />

        <h3 className="subsection-title">2.3. Actualizar perfil (<code>actions/auth/update-profile.ts</code>)</h3>
        <CodeBlock
          code={`'use server'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(values: {
  id: string
  name: string
  phone?: string | null
  country_code?: string | null
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('profiles').upsert({
    id: values.id,
    name: values.name,
    phone: values.phone,
    country_code: values.country_code,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error('Hubo un error al actualizar el perfil.')
  }

  return { success: true }
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          3. Endpoints API
        </h2>

        <h3 className="subsection-title">3.1. Callback de autenticación (<code>app/api/auth/callback/route.ts</code>)</h3>
        <CodeBlock
          code={`import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams, origin } = requestUrl

  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(\`\${origin}\${next}\`)
    }
  }

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      if (type === 'email') {
        return NextResponse.redirect(\`\${origin}/dashboard\`)
      }
      if (type === 'recovery') {
        return NextResponse.redirect(\`\${origin}/update-password\`)
      }
      return NextResponse.redirect(\`\${origin}\${next}\`)
    }
  }

  return NextResponse.redirect(\`\${origin}/?error=Falló_la_autenticación\`)
}`}
        />

        <h3 className="subsection-title">3.2. Cierre de sesión (<code>app/api/auth/signout/route.ts</code>)</h3>
        <CodeBlock
          code={`import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL("/", req.url), { status: 302 });
}`}
        />
      </section>
    </>
  );
}