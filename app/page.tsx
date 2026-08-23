import { getAllStacks } from "@/lib/content";
import { StackCard } from "@/components/ui/StackCard";

export default async function HomePage() {
  const stacks = getAllStacks();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <header className="max-w-7xl mx-auto px-4 py-12 md:py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          AuthStacks
        </h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
          Elige tu stack tecnológico y obtén guías paso a paso para implementar autenticación completa en tu aplicación.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stacks.map((stack) => (
            <StackCard key={stack.metadata.slug} metadata={stack.metadata} stepsCount={stack.steps.length} />
          ))}
        </div>
      </main>
    </div>
  );
}