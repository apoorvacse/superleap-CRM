'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  showNewButton?: boolean;
  children?: React.ReactNode;
}

export function TopBar({ title, subtitle, showNewButton = false, children }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="font-display text-xl font-bold text-text-primary tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {children}
          {showNewButton && (
            <Link
              href="/leads/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-all duration-150 shadow-lg shadow-accent/20"
            >
              <Plus className="w-4 h-4" />
              New Lead
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
