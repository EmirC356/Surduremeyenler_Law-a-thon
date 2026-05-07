'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Scale, 
  ChevronRight, 
  ChevronLeft,
  LayoutDashboard, 
  FileSearch, 
  Target, 
  CreditCard,
  Shield,
  Home
} from 'lucide-react';
import type { ElementType } from 'react';
import { NAV_ITEMS } from '../lib/navigation';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, ElementType> = {
  LayoutDashboard,
  FileSearch,
  Target,
  CreditCard,
  Home,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) setCollapsed(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "no-print flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out",
        "bg-sidebar-background border-r border-sidebar-border",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <Link href="/" className="block">
        <div className={cn(
          "flex items-center gap-3 px-4 py-4 border-b border-sidebar-border transition-all duration-300",
          collapsed && "justify-center px-2"
        )}>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
            <Scale size={18} className="text-primary" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-base font-semibold text-sidebar-foreground tracking-tight">
                Lawathon
              </div>
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Legal Intelligence
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3 top-7 z-10 flex items-center justify-center",
          "w-6 h-6 rounded-full border border-sidebar-border bg-sidebar-background",
          "text-muted-foreground hover:text-foreground hover:bg-accent",
          "transition-colors duration-200 shadow-sm"
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav label */}
      {!collapsed && (
        <div className="px-4 pt-6 pb-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Navigasyon
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav className={cn(
        "flex flex-col gap-1 px-2 flex-1",
        collapsed ? "pt-6" : "pt-0"
      )}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route;
          const Icon = ICON_MAP[item.icon] ?? Scale;
          const isDisabled = !item.enabled;

          if (isDisabled) {
            return (
              <div
                key={item.route}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-40 cursor-not-allowed",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon size={18} className="text-muted-foreground shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </span>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.route}
              href={item.route}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent",
                isActive && "bg-sidebar-accent",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                size={18}
                className={cn(
                  "shrink-0 transition-colors duration-200",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground group-hover:text-sidebar-foreground"
                )}
              />
              {!collapsed && (
                <div className="flex flex-col flex-1 min-w-0">
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      isActive 
                        ? "text-sidebar-foreground" 
                        : "text-muted-foreground group-hover:text-sidebar-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                  {item.sublabel && (
                    <span className="text-[11px] text-muted-foreground/70 truncate">
                      {item.sublabel}
                    </span>
                  )}
                </div>
              )}
              {!collapsed && isActive && (
                <ChevronRight size={14} className="text-primary shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: SSL indicator */}
      <div className={cn(
        "px-4 py-4 border-t border-sidebar-border",
        collapsed && "px-2"
      )}>
        <div className={cn(
          "flex items-center gap-2",
          collapsed && "justify-center"
        )}>
          <Shield size={13} className="text-muted-foreground shrink-0" />
          {!collapsed && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">
                256-bit SSL
              </span>
            </>
          )}
        </div>
        {!collapsed && (
          <div className="text-[10px] text-muted-foreground/60 mt-1.5">
            Paris Anl. Mad. 6 · EU 2024/825
          </div>
        )}
      </div>
    </aside>
  );
}
