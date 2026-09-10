import { getAllStacks } from "@/lib/content";
import { StackCard } from "@/components/ui/StackCard";
import { Stack, StackCategory } from "@/types";

// Orden y presentación de cada categoría
const CATEGORIES: {
  id: StackCategory;
  title: string;
  subtitle: string;
  stacks: string[];
}[] = [
  {
    id: "idaas",
    title: "🔐 IDaaS — Identity as a Service",
    subtitle:
      "Servicios gestionados que resuelven SOLO la identidad: login, MFA, SSO y sesiones. La base de datos y el storage son cosa tuya.",
    stacks: ["nextjs-auth0", "nextjs-clerk"],
  },
  {
    id: "baas",
    title: "☁️ BaaS — Backend as a Service",
    subtitle:
      "Backend completo gestionado: autenticación + base de datos + storage + funciones en un mismo paquete. Los reyes del BaaS.",
    stacks: ["nextjs-supabase", "nextjs-firebase"],
  },
  {
    id: "dbaas",
    title: "🗄️ DBaaS — Database as a Service",
    subtitle:
      "Solo base de datos gestionada en la nube (sin auth ni storage): tú construyes el backend y el login a mano sobre ella.",
    stacks: ["nextjs-mongodb", "nextjs-drizzle-turso"],
  },
  {
    id: "librerias",
    title: "🧩 Librerías (self-hosted)",
    subtitle:
      "Código abierto que corre en TU servidor: tú eliges la base de datos y construyes los formularios. Sin depender de un proveedor.",
    stacks: ["nextjs-better-auth", "nextjs-lucia"],
  },
  {
    id: "deploy",
    title: "🚀 Despliegue automático",
    subtitle:
      "La plataforma detecta tu stack, aprovisiona la infraestructura y publica en Vercel, Netlify o Cloudflare Pages con un comando.",
    stacks: ["void-drizzle-better-auth"],
  },
];

export default async function HomePage() {
  const stacks = getAllStacks();
  const stacksBySlug = new Map(stacks.map((s) => [s.metadata.slug, s]));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <header className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          AuthStacks
        </h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-3xl mx-auto">
          🔐 Elige tu stack de autenticación comparando <strong>modelos de servicio</strong>:
          IDaaS (solo identidad gestionada), BaaS (backend completo), DBaaS (solo base de datos),
          librerías self-hosted o despliegue automático. Cada guía es paso a paso y copiable.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-16 space-y-16">
        {CATEGORIES.map((category) => {
          const categoryStacks: Stack[] = category.stacks
            .map((slug) => stacksBySlug.get(slug))
            .filter((s): s is Stack => Boolean(s));

          return (
            <section key={category.id}>
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  {category.title}
                </h2>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                  {category.subtitle}
                </p>
              </div>

              <div
                className={`grid grid-cols-1 gap-6 ${
                  categoryStacks.length <= 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {categoryStacks.map((stack) => (
                  <StackCard
                    key={stack.metadata.slug}
                    metadata={stack.metadata}
                    stepsCount={stack.steps.length}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
