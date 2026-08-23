"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

export interface Step {
  slug: string;
  title: string;
  order?: number;
}

interface SidebarProps {
  steps: Step[];
  basePath: string;
}

export function Sidebar({ steps, basePath }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="w-72 flex-shrink-0 border-r border-border bg-card/50 backdrop-blur">
      <div className="h-full overflow-y-auto p-4 md:sticky md:top-16 md:h-[calc(100vh-8rem)]">
        <h3 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Contenido
        </h3>
        <ul className="space-y-1">
          {steps.map((step, index) => {
            const href = `${basePath}/${step.slug}`;
            const isActive = pathname === href;
            return (
              <li key={step.slug}>
                <Link
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-accent-foreground/10"
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="flex-1 truncate">{step.title}</span>
                  {isActive && <CheckCircle2 size={16} className="shrink-0" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}