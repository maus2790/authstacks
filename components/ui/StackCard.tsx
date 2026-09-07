import Link from "next/link";
import { StackMetadata } from "@/types";
import { CheckCircle2, ChevronRight, Star, XCircle } from "lucide-react";

interface StackCardProps {
  metadata: StackMetadata;
  stepsCount: number;
}

export function StackCard({ metadata, stepsCount }: StackCardProps) {
  const difficultyColors = {
    Principiante: "bg-green-500/20 text-green-400 border-green-500/30",
    Intermedio: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Avanzado: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const difficultyStars = {
    Principiante: 1,
    Intermedio: 2,
    Avanzado: 3,
  };

  return (
    <Link
      href={`/stacks/${metadata.slug}`}
      className="stack-card group block bg-card border-border"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{metadata.icon}</span>
            <div>
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {metadata.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: difficultyStars[metadata.difficulty] }).map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </div>
          <span
            className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${difficultyColors[metadata.difficulty]}`}
          >
            {metadata.difficulty}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {metadata.summary}
        </p>

        <div className="space-y-2">
          <div>
            <p className="text-xs font-semibold text-green-500 flex items-center gap-1 mb-1">
              <CheckCircle2 size={13} /> Ventajas
            </p>
            <ul className="space-y-1">
              {metadata.pros.slice(0, 3).map((pro) => (
                <li key={pro} className="text-xs text-muted-foreground leading-relaxed flex gap-1.5">
                  <span className="text-green-500 shrink-0">•</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-red-500 flex items-center gap-1 mb-1">
              <XCircle size={13} /> Limitaciones
            </p>
            <ul className="space-y-1">
              {metadata.cons.slice(0, 3).map((con) => (
                <li key={con} className="text-xs text-muted-foreground leading-relaxed flex gap-1.5">
                  <span className="text-red-500 shrink-0">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {metadata.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            {stepsCount} {stepsCount === 1 ? "paso" : "pasos"}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary/80 transition-colors group-hover:gap-2">
            Ver guía
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
