import Link from "next/link";
import { notFound } from "next/navigation";
import { getStackBySlug } from "@/lib/content";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight, Clock, Layers } from "lucide-react";

export default async function StackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stack = getStackBySlug(slug);
  if (!stack) notFound();

  const difficultyColors = {
    Principiante: "bg-green-500/20 text-green-400 border-green-500/30",
    Intermedio: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Avanzado: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{stack.metadata.icon}</span>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{stack.metadata.name}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{stack.metadata.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant="outline" className={difficultyColors[stack.metadata.difficulty]}>
                {stack.metadata.difficulty}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Layers size={16} />
                {stack.steps.length} pasos
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={16} />
                ~{stack.steps.length * 10} min
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/stacks/${slug}/${stack.steps[0]?.slug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Comenzar guía
          <ChevronRight size={18} />
        </Link>
      </div>

      <div className="grid gap-4">
        {stack.steps.map((step, index) => (
          <Link
            key={step.slug}
            href={`/stacks/${slug}/${step.slug}`}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {index + 1}
            </span>
            <div className="flex-1">
              <h2 className="font-semibold group-hover:text-primary">{step.title}</h2>
            </div>
            <ChevronRight size={20} className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}