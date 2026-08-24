'use client';

import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import dracula from 'react-syntax-highlighter/dist/esm/styles/prism/dracula';
import { cn } from '@/lib/utils';

SyntaxHighlighter.registerLanguage('bash', bash);

interface CommandBlockProps {
  command: string;
  className?: string;
}

export function CommandBlock({ command, className }: CommandBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('code-block-wrapper terminal-block', className)}>
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Terminal size={16} />
          <span className="text-xs font-mono">Terminal</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-muted-foreground/10 text-muted-foreground transition-colors hover:bg-muted-foreground/20 hover:text-foreground"
          aria-label="Copiar comando"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language="bash"
        style={dracula}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.875rem',
        }}
      >
        {`$ ${command}`}
      </SyntaxHighlighter>
    </div>
  );
}
