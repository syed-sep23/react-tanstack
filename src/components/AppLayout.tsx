import { Outlet } from '@tanstack/react-router';
import { useAppStore } from '@/store/app.store';
import { AppNavbar } from './AppNavbar';
import { AppSidebar } from './AppSidebar';

/**
 * Root layout rendered by the root route.
 * Contains the navbar, sidebar, and a main content area
 * where child routes render via `<Outlet />`.
 */
export function AppLayout() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <div className="app-layout">
      <AppNavbar />
      <div className="app-layout__body">
        <AppSidebar />
        <main
          className={`app-layout__content ${
            collapsed ? 'app-layout__content--expanded' : ''
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
