'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/lib/theme-provider';
import { Moon, Sun, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const stackNames: Record<string, string> = {
  'nextjs-auth0': 'Next.js + Auth0',
  'nextjs-better-auth': 'Next.js + Better Auth',
  'nextjs-clerk': 'Next.js + Clerk',
  'nextjs-drizzle-turso': 'Next.js + Drizzle + Turso',
  'nextjs-firebase': 'Next.js + Firebase',
  'nextjs-lucia': 'Next.js + Lucia Auth',
  'nextjs-mongodb': 'Next.js + MongoDB',
  'nextjs-supabase': 'Next.js + Supabase',
};

export function Header() {
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();

  const pathParts = pathname.split('/').filter(Boolean);
  const currentStack = pathParts[0] === 'stacks' ? pathParts[1] : null;
  const stackName = currentStack ? stackNames[currentStack] : null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <BookOpen className="text-primary" size={22} />
            <span>AuthStacks</span>
          </Link>
          {stackName && (
            <>
              <ChevronRight size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{stackName}</span>
            </>
          )}
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Stacks
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full p-0"
            aria-label="Cambiar tema"
          >
            {mounted ? (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />) : <Moon size={18} />}
          </Button>
        </nav>
      </div>
    </header>
  );
}