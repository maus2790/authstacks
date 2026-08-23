'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  prevStep?: { slug: string; title: string } | null;
  nextStep?: { slug: string; title: string } | null;
  basePath: string;
}

export function StepNavigation({ prevStep, nextStep, basePath }: StepNavigationProps) {
  return (
    <nav className="mt-12 flex items-center justify-between border-t border-border pt-6">
      {prevStep ? (
        <Link
          href={`${basePath}/${prevStep.slug}`}
          className="flex items-center gap-2 rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ChevronLeft size={18} />
          <div className="text-left">
            <div className="text-xs text-muted-foreground">Anterior</div>
            <div className="font-medium">{prevStep.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {nextStep ? (
        <Link
          href={`${basePath}/${nextStep.slug}`}
          className="flex items-center gap-2 rounded-md px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Siguiente</div>
            <div className="font-medium">{nextStep.title}</div>
          </div>
          <ChevronRight size={18} />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
