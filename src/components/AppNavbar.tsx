import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Button,
  Alignment,
  Tag,
} from '@blueprintjs/core';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/auth.store';
import { useAppStore } from '@/store/app.store';

export function AppNavbar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const darkMode = useAppStore((s) => s.darkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <Navbar className="app-navbar" fixedToTop>
      <NavbarGroup align={Alignment.LEFT}>
        <Button
          icon="menu"
          minimal
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        />
        <NavbarDivider />
        <NavbarHeading className="app-navbar__heading">
          Central Entitlement Service
        </NavbarHeading>
      </NavbarGroup>

      <NavbarGroup align={Alignment.RIGHT}>
        {user && (
          <Tag
            icon="user"
            minimal
            round
            intent="primary"
            className="app-navbar__user-tag"
          >
            {user.displayName}
          </Tag>
        )}
        <NavbarDivider />
        <Button
          icon={darkMode ? 'flash' : 'moon'}
          minimal
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
        />
        <Button
          icon="log-out"
          minimal
          text="Logout"
          onClick={handleLogout}
          aria-label="Logout"
        />
      </NavbarGroup>
    </Navbar>
  );
}
