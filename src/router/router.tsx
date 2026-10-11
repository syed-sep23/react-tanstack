import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
} from '@tanstack/react-router';
import { AppLayout } from '@/components/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { PolicyLayout } from '@/pages/PolicyListPage';
import { PolicyDetailPage } from '@/pages/PolicyDetailPage';

// ──────────────────────────────────────────────
// Route Definitions (code-based routing)
// ──────────────────────────────────────────────

/** Root route – renders the shared app shell */
const rootRoute = createRootRoute({
  component: AppLayout,
});

/** Index route – redirects to /dashboard */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' });
  },
});

/** Dashboard route */
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

/** Policy layout route – /policy */
const policyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/policy',
  component: PolicyLayout,
});

/** Policy detail route – /policy/$policyId */
export const policyDetailRoute = createRoute({
  getParentRoute: () => policyRoute,
  path: '/$policyId',
  component: PolicyDetailPage,
});

// ──────────────────────────────────────────────
// Route Tree & Router
// ──────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  policyRoute.addChildren([policyDetailRoute]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent', // preload on hover/focus for instant nav
});

// Register the router type for full type-safety across the app
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
