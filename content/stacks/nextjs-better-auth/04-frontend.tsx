import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Frontend() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Páginas de Login y Registro</h1>
        <p className="content-subtitle">
          Formularios HTML nativos conectados a las Server Actions
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">💡</span>
          1. Enfoque: formularios nativos + Server Actions
        </h2>
        <p className="section-paragraph">
          No necesitas react-hook-form, zod ni react-hot-toast para esto: un{" "}
          <code>&lt;form&gt;</code> nativo con <code>action</code> de Server Action
          envía los datos al servidor, donde ya validamos en el paso anterior.
          Menos dependencias, menos código, misma seguridad.
        </p>
        <div className="tip">
          <span className="tip-icon">🧠</span>
          <span>
            La validación <strong>real</strong> ocurre en el servidor (Server Action).
            La validación del navegador (<code>required</code>, <code>type="email"</code>)
            es solo para UX.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          2. Página de Login (<code>app/login/page.tsx</code>)
        </h2>
        <p className="section-paragraph">
          Es un <strong>Client Component</strong> que usa <code>useActionState</code>:
          el hook recibe la action (firma <code>(prevState, formData)</code>) y expone
          el estado con el error para mostrarlo en pantalla:
        </p>
        <CodeBlock
          code={`"use client";
import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-6 text-3xl font-bold text-center">Iniciar sesión</h1>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <strong>No uses</strong> <code>{`<form action={loginAction}>`}</code>{" "}
            directo con estas actions: en React 19 la prop <code>action</code> del
            form espera <code>(formData) =&gt; void</code>, y como las actions
            devuelven <code>{"{ error }"}</code>, TypeScript falla.{" "}
            <code>useActionState</code> resuelve ambos: la firma y la visualización
            de errores.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          3. Página de Registro (<code>app/register/page.tsx</code>)
        </h2>
        <CodeBlock
          code={`"use client";
import { useActionState } from "react";
import { registerAction } from "@/actions/auth";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-white/5">
        <h1 className="mb-6 text-3xl font-bold text-center">Crear cuenta</h1>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Tu nombre"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 dark:border-white/10 dark:bg-white/5"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧩</span>
          4. Cómo funciona el patrón de errores
        </h2>
        <p className="section-paragraph">
          Las páginas de los pasos 2 y 3 muestran el patrón completo. Resumen de las
          piezas:
        </p>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>
            La action devuelve <code>{"{ error?: string }"}</code> o{" "}
            <code>undefined</code> (tipo <code>ActionState</code> definido en{" "}
            <code>actions/auth.ts</code>).
          </li>
          <li>
            <code>useActionState(action, undefined)</code> conecta la action con el
            form: el <code>state</code> es el valor devuelto,{" "}
            <code>formAction</code> va en <code>&lt;form action&gt;</code> y{" "}
            <code>pending</code> deshabilita el botón mientras se envía.
          </li>
          <li>
            Si <code>state.error</code> existe, se pinta el mensaje en rojo.
          </li>
          <li>
            Si la action llama a <code>redirect()</code> al éxito, el navegador se
            redirige y el estado de error nunca se muestra.
          </li>
        </ul>
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            Puedes extraer el form a un componente reutilizable (ej:{" "}
            <code>components/auth/LoginForm.tsx</code>) si quieres usarlo en varias
            páginas — la lógica es idéntica a la de las secciones 2 y 3.
          </span>
        </div>
      </section>
    </>
  );
}
