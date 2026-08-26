'use client';

import { useState } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { cn } from '@/lib/utils';

interface OsCommandTabsProps {
  windowsCode: string;
  linuxCode: string;
  windowsLabel?: string;
  linuxLabel?: string;
  language?: string;
  className?: string;
}

export function OsCommandTabs({
  windowsCode,
  linuxCode,
  windowsLabel = '🪟 Windows (PowerShell)',
  linuxLabel = '🐧 Linux / macOS',
  language = 'bash',
  className,
}: OsCommandTabsProps) {
  const [os, setOs] = useState<'windows' | 'linux'>('windows');

  return (
    <div className={cn('os-tabs-container', className)}>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setOs('windows')}
          className={cn(
            'px-3 py-1.5 rounded-md text-sm font-medium border transition-colors',
            os === 'windows'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-muted text-muted-foreground border-border hover:text-foreground'
          )}
        >
          {windowsLabel}
        </button>
        <button
          type="button"
          onClick={() => setOs('linux')}
          className={cn(
            'px-3 py-1.5 rounded-md text-sm font-medium border transition-colors',
            os === 'linux'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-muted text-muted-foreground border-border hover:text-foreground'
          )}
        >
          {linuxLabel}
        </button>
      </div>
      <CodeBlock
        language={language}
        code={os === 'windows' ? windowsCode : linuxCode}
      />
    </div>
  );
}
