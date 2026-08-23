'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeExplanationProps {
  title?: string;
  children: React.ReactNode;
}

export function CodeExplanation({ title = '¿Qué hace este código?', children }: CodeExplanationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-4 rounded-lg border border-border bg-muted/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted"
      >
        <span className="flex items-center gap-2">
          <HelpCircle size={16} className="text-primary" />
          {title}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <div
        className={cn(
          'grid transition-all',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
