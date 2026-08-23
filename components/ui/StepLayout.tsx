"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function StepLayout({ sidebar, children }: StepLayoutProps) {
  // En móvil (<768px) el sidebar inicia cerrado; en desktop, abierto
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  const pathname = usePathname();

  // Al navegar a otro paso, cerrar el sidebar automáticamente solo en móvil
  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, [pathname]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] bg-background text-foreground">
      {/* Sidebar: overlay fijo en móvil, columna sticky en desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 mt-16 overflow-hidden bg-background shadow-xl transition-[width,transform] duration-300 md:sticky md:top-16 md:z-auto md:mt-0 md:h-[calc(100vh-8rem)] md:flex-shrink-0 md:bg-transparent md:shadow-none",
          collapsed ? "w-0 md:w-0" : "w-72"
        )}
      >
        <div
          className={cn(
            "h-full transition-transform duration-300",
            collapsed && "-translate-x-full"
          )}
        >
          {sidebar}
        </div>
      </div>

      {/* Backdrop en móvil cuando el sidebar está abierto */}
      {!collapsed && (
        <button
          aria-label="Cerrar sidebar"
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 z-30 mt-16 bg-black/50 md:hidden"
        />
      )}

      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Mostrar sidebar" : "Ocultar sidebar"}
        title={collapsed ? "Mostrar sidebar" : "Ocultar sidebar"}
        className="sticky top-20 z-10 -ml-3 h-fit self-start rounded-r-md border border-l-0 border-border bg-card p-1.5 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">{children}</div>
    </div>
  );
}
