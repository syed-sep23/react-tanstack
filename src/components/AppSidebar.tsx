import { Menu, MenuItem, MenuDivider, Icon } from '@blueprintjs/core';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useAppStore } from '@/store/app.store';

interface NavItem {
  icon: React.ComponentProps<typeof Icon>['icon'];
  text: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'dashboard', text: 'Dashboard', path: '/dashboard' },
  { icon: 'shield', text: 'Policies', path: '/policy' },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);

  const currentPath = routerState.location.pathname;

  return (
    <aside
      className={`app-sidebar ${collapsed ? 'app-sidebar--collapsed' : ''}`}
    >
      <Menu large className="app-sidebar__menu">
        {NAV_ITEMS.map((item) => (
          <MenuItem
            key={item.path}
            icon={item.icon}
            text={collapsed ? undefined : item.text}
            active={currentPath.startsWith(item.path)}
            onClick={() => navigate({ to: item.path })}
            className="app-sidebar__item"
          />
        ))}
        <MenuDivider />
        <MenuItem
          icon="cog"
          text={collapsed ? undefined : 'Settings'}
          className="app-sidebar__item"
          disabled
        />
      </Menu>
    </aside>
  );
}
