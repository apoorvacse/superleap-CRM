import { create } from 'zustand';

interface SidebarState {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (value: boolean) => void;
}

// Read initial state from localStorage (client-side only)
function getInitialCollapsed(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem('superleap-sidebar-collapsed');
    return stored ? stored === 'true' : true;
  } catch {
    return true;
  }
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: getInitialCollapsed(),
  toggleCollapsed: () =>
    set((state) => {
      const next = !state.collapsed;
      try {
        localStorage.setItem('superleap-sidebar-collapsed', String(next));
      } catch {}
      return { collapsed: next };
    }),
  setCollapsed: (value: boolean) => {
    try {
      localStorage.setItem('superleap-sidebar-collapsed', String(value));
    } catch {}
    set({ collapsed: value });
  },
}));
