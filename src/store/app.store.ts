import { create } from 'zustand';

/**
 * Lightweight global application store for UI-level state that
 * doesn't belong in URL/router params or server state (TanStack Query).
 */
interface AppState {
  /** Whether the sidebar / nav-drawer is collapsed */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  /** Currently selected theme */
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  darkMode: true,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
}));
