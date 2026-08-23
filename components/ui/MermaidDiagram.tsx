'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@/lib/theme-provider';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, mounted } = useTheme();
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    if (!mounted) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
    });

    const renderChart = async () => {
      if (!containerRef.current) return;
      try {
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
        setSvg(svg);
      } catch (error) {
        console.error('Error rendering mermaid:', error);
      }
    };

    renderChart();
  }, [chart, theme, mounted]);

  if (!mounted) {
    return <div className="my-4 h-32 animate-pulse rounded-lg bg-muted" />;
  }

  return (
    <div
      ref={containerRef}
      className={`my-4 flex justify-center overflow-x-auto rounded-lg border border-border bg-card p-4 ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
