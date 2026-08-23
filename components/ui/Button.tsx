'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'danger';
  size?: 'default' | 'sm';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' && 'bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90',
        variant === 'ghost' && 'px-4 py-2 hover:bg-accent hover:text-accent-foreground',
        variant === 'danger' && 'bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        className,
      )}
      {...props}
    >
      {loading && <LoaderCircle size={16} className="animate-spin" />}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
