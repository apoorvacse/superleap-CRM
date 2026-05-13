'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutList, Kanban, Plus, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/leads', label: 'Leads', icon: LayoutList },
  { href: '/board', label: 'Board', icon: Kanban },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering default expanded state if not mounted
  const isCollapsed = mounted ? collapsed : false;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 bg-[#0E0E14] border-r border-border/50 flex flex-col z-40 transition-all duration-200 ease-in-out",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapsed}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-text-muted transition-colors z-50 shadow-sm"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Logo */}
      <div className={cn("h-16 flex items-center border-b border-border/50", isCollapsed ? "justify-center" : "px-5 gap-2.5")}>
        <div className="w-8 h-8 shrink-0 rounded-lg bg-accent flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!isCollapsed && (
          <span className="font-display font-bold text-lg text-text-primary tracking-tight overflow-hidden whitespace-nowrap">
            Superleap
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 py-4 space-y-1", isCollapsed ? "px-2" : "px-3")}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          
          const link = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-hover',
                isCollapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-3 py-2.5'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger render={link} />
                <TooltipContent side="right" sideOffset={12}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return link;
        })}
      </nav>

      {/* Quick Add Button */}
      <div className={cn("pb-4", isCollapsed ? "px-2" : "px-3")}>
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger render={
              <Link
                href="/leads/new"
                className="flex items-center justify-center w-full aspect-square bg-accent hover:bg-accent-hover text-white rounded-lg transition-all duration-150"
              >
                <Plus className="w-4 h-4" />
              </Link>
            } />
            <TooltipContent side="right" sideOffset={12}>
              New Lead
            </TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href="/leads/new"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            New Lead
          </Link>
        )}
      </div>

      {/* Footer */}
      <div className={cn("py-4 border-t border-border/50", isCollapsed ? "px-0 flex justify-center" : "px-5")}>
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger render={
              <div className="w-6 h-6 flex items-center justify-center text-xs font-mono text-text-muted cursor-default">
                v1
              </div>
            } />
            <TooltipContent side="right" sideOffset={12}>
              Superleap CRM v1.0
            </TooltipContent>
          </Tooltip>
        ) : (
          <p className="text-xs text-text-muted overflow-hidden whitespace-nowrap">
            Superleap CRM v1.0
          </p>
        )}
      </div>
    </aside>
  );
}
