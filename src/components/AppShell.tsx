import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../store/AppProvider';
import { BottomNav } from './BottomNav';
import { CreateMenu } from './CreateMenu';
import { ConfirmHost, ToastHost } from './Overlays';

export function AppShell() {
  const location = useLocation();
  const { setCreateOpen } = useApp();

  useEffect(() => {
    setCreateOpen(false);
  }, [location.pathname, setCreateOpen]);

  return (
    <div className="app-shell">
      <Outlet />
      <CreateMenu />
      <BottomNav />
      <ToastHost />
      <ConfirmHost />
    </div>
  );
}
