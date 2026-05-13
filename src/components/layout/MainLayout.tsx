'use client';

import { useSidebarStore } from '@/stores/useSidebarStore';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className={cn(
          "flex-1 transition-all duration-200 ease-in-out",
          mounted && collapsed ? "ml-[60px]" : "ml-[240px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}
