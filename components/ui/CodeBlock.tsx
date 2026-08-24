'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';
import vs from 'react-syntax-highlighter/dist/esm/styles/prism/vs';
import { useTheme } from '@/lib/theme-provider';
import { cn } from '@/lib/utils';

// Registrar solo los lenguajes que usa el contenido (typescript y bash).
// Los lenguajes de refractor registran sus dependencias automáticamente.
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('bash', bash);

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = 'typescript',
  className,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme, mounted } = useTheme();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Seleccionar tema según el modo (usar dark por defecto hasta que se monte)
  const syntaxTheme = mounted && theme === 'light' ? vs : vscDarkPlus;

  return (
    <div className={cn('code-block-wrapper', className)}>
      <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-muted-foreground/10 text-muted-foreground transition-colors hover:bg-muted-foreground/20 hover:text-foreground"
          aria-label="Copiar código"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={syntaxTheme}
        showLineNumbers={showLineNumbers}
        wrapLines={true}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.875rem',
        }}
        codeTagProps={{
          style: {
            backgroundColor: 'transparent',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
