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
    id: "baas",
    title: "📦 Soluciones Todo-en-Uno (BaaS)",
    subtitle:
      "El proveedor gestiona auth, sesiones y UI por ti. Menos código, más rápido de lanzar.",
    stacks: ["nextjs-auth0", "nextjs-clerk", "nextjs-supabase", "nextjs-firebase"],
  },
  {
    id: "librerias",
    title: "🧩 Librerías flexibles",
    subtitle:
      "Código abierto que corre en tu servidor: tú eliges la base de datos y construyes los formularios.",
    stacks: ["nextjs-better-auth", "nextjs-lucia"],
  },
  {
    id: "manual",
    title: "🛠️ Control total (implementación manual)",
    subtitle:
      "Escribes el auth a mano sobre tu base de datos: máxima flexibilidad, máxima responsabilidad.",
    stacks: ["nextjs-mongodb", "nextjs-drizzle-turso"],
  },
  {
    id: "deploy",
    title: "🚀 Stacks con despliegue automático",
    subtitle:
      "La plataforma detecta tu stack, aprovisiona la infraestructura y despliega con un comando.",
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
        <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
          🔐 Elige tu stack de autenticación: compara soluciones todo-en-uno,
          librerías flexibles o implementación manual, y sigue la guía paso a paso.
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
