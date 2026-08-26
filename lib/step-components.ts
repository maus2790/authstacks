import type { ComponentType } from "react";

type StepModule = { default: ComponentType };
type StepLoader = () => Promise<StepModule>;

/**
 * Registro estático de los componentes de cada paso de guía.
 *
 * Usa imports dinámicos LITERALES (rutas completas y analizables por el
 * bundler) en lugar de plantillas como `import(\`@/content/.../${slug}\`)`,
 * para que Next.js pueda trazar el grafo de módulos y pre-renderizar
 * (`generateStaticParams`) todas las rutas /stacks/[slug]/[step] en build.
 */
export const stepComponents: Record<string, Record<string, StepLoader>> = {
  "nextjs-auth0": {
    "01-inicio": () => import("@/content/stacks/nextjs-auth0/01-inicio"),
    "02-configuracion": () => import("@/content/stacks/nextjs-auth0/02-configuracion"),
    "03-auth-actions": () => import("@/content/stacks/nextjs-auth0/03-auth-actions"),
    "04-frontend": () => import("@/content/stacks/nextjs-auth0/04-frontend"),
    "05-dashboard-perfil": () => import("@/content/stacks/nextjs-auth0/05-dashboard-perfil"),
    "06-google-oauth": () => import("@/content/stacks/nextjs-auth0/06-google-oauth"),
    "07-personalizacion": () => import("@/content/stacks/nextjs-auth0/07-personalizacion"),
  },
  "nextjs-better-auth": {
    "01-inicio": () => import("@/content/stacks/nextjs-better-auth/01-inicio"),
    "02-configuracion": () => import("@/content/stacks/nextjs-better-auth/02-configuracion"),
    "03-auth-actions": () => import("@/content/stacks/nextjs-better-auth/03-auth-actions"),
    "04-frontend": () => import("@/content/stacks/nextjs-better-auth/04-frontend"),
    "05-dashboard-perfil": () => import("@/content/stacks/nextjs-better-auth/05-dashboard-perfil"),
    "06-google-oauth": () => import("@/content/stacks/nextjs-better-auth/06-google-oauth"),
  },
  "nextjs-clerk": {
    "01-inicio": () => import("@/content/stacks/nextjs-clerk/01-inicio"),
    "02-configuracion": () => import("@/content/stacks/nextjs-clerk/02-configuracion"),
    "03-auth-actions": () => import("@/content/stacks/nextjs-clerk/03-auth-actions"),
    "04-frontend": () => import("@/content/stacks/nextjs-clerk/04-frontend"),
    "05-dashboard-perfil": () => import("@/content/stacks/nextjs-clerk/05-dashboard-perfil"),
    "06-google-oauth": () => import("@/content/stacks/nextjs-clerk/06-google-oauth"),
  },
  "nextjs-drizzle-turso": {
    "01-inicio": () => import("@/content/stacks/nextjs-drizzle-turso/01-inicio"),
    "02-configuracion": () => import("@/content/stacks/nextjs-drizzle-turso/02-configuracion"),
    "03-base-datos": () => import("@/content/stacks/nextjs-drizzle-turso/03-base-datos"),
    "04-logica-backend": () => import("@/content/stacks/nextjs-drizzle-turso/04-logica-backend"),
    "05-frontend": () => import("@/content/stacks/nextjs-drizzle-turso/05-frontend"),
    "06-dashboard-extra": () => import("@/content/stacks/nextjs-drizzle-turso/06-dashboard-extra"),
    "07-google-login": () => import("@/content/stacks/nextjs-drizzle-turso/07-google-login"),
  },
  "nextjs-firebase": {
    "01-inicio": () => import("@/content/stacks/nextjs-firebase/01-inicio"),
    "02-configuracion": () => import("@/content/stacks/nextjs-firebase/02-configuracion"),
    "03-auth-actions": () => import("@/content/stacks/nextjs-firebase/03-auth-actions"),
    "04-frontend": () => import("@/content/stacks/nextjs-firebase/04-frontend"),
    "05-dashboard-perfil": () => import("@/content/stacks/nextjs-firebase/05-dashboard-perfil"),
    "06-google-oauth": () => import("@/content/stacks/nextjs-firebase/06-google-oauth"),
  },
  "nextjs-lucia": {
    "01-inicio": () => import("@/content/stacks/nextjs-lucia/01-inicio"),
    "02-configuracion": () => import("@/content/stacks/nextjs-lucia/02-configuracion"),
    "03-auth-actions": () => import("@/content/stacks/nextjs-lucia/03-auth-actions"),
    "04-frontend": () => import("@/content/stacks/nextjs-lucia/04-frontend"),
    "05-dashboard-perfil": () => import("@/content/stacks/nextjs-lucia/05-dashboard-perfil"),
    "06-google-oauth": () => import("@/content/stacks/nextjs-lucia/06-google-oauth"),
  },
  "nextjs-mongodb": {
    "01-inicio": () => import("@/content/stacks/nextjs-mongodb/01-inicio"),
    "02-configuracion": () => import("@/content/stacks/nextjs-mongodb/02-configuracion"),
    "03-auth-actions": () => import("@/content/stacks/nextjs-mongodb/03-auth-actions"),
    "04-frontend": () => import("@/content/stacks/nextjs-mongodb/04-frontend"),
    "05-dashboard-perfil": () => import("@/content/stacks/nextjs-mongodb/05-dashboard-perfil"),
    "06-google-oauth": () => import("@/content/stacks/nextjs-mongodb/06-google-oauth"),
  },
  "nextjs-supabase": {
    "01-inicio": () => import("@/content/stacks/nextjs-supabase/01-inicio"),
    "02-configuracion": () => import("@/content/stacks/nextjs-supabase/02-configuracion"),
    "03-auth-actions": () => import("@/content/stacks/nextjs-supabase/03-auth-actions"),
    "04-frontend": () => import("@/content/stacks/nextjs-supabase/04-frontend"),
    "05-dashboard-perfil": () => import("@/content/stacks/nextjs-supabase/05-dashboard-perfil"),
    "06-google-oauth": () => import("@/content/stacks/nextjs-supabase/06-google-oauth"),
  },
  "void-drizzle-better-auth": {
    "01-inicio": () => import("@/content/stacks/void-drizzle-better-auth/01-inicio"),
    "02-configuracion": () => import("@/content/stacks/void-drizzle-better-auth/02-configuracion"),
    "03-auth-server": () => import("@/content/stacks/void-drizzle-better-auth/03-auth-server"),
    "04-frontend": () => import("@/content/stacks/void-drizzle-better-auth/04-frontend"),
    "05-proteccion-rutas": () => import("@/content/stacks/void-drizzle-better-auth/05-proteccion-rutas"),
    "06-google-oauth": () => import("@/content/stacks/void-drizzle-better-auth/06-google-oauth"),
  },
};
