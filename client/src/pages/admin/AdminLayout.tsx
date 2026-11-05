import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { getCookie, getAdminToken, getAdminAuthHeaders, clearAdminAuthSession } from '../../utils/cookies';
import { API_BASE } from '../../utils/productStore';

export const AdminLayout: React.FC = () => {
  const token = getAdminToken();
  const stored = getCookie('sadida_admin') || (typeof localStorage !== 'undefined' ? localStorage.getItem('sadida_admin') : null);

  // If no token or stored session info exists, reject immediately
  const hasCredentials = Boolean(token && stored);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(hasCredentials);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ usersName?: string; role?: string }>({});

  useEffect(() => {
    const currentToken = getAdminToken();
    const currentStored = getCookie('sadida_admin') || (typeof localStorage !== 'undefined' ? localStorage.getItem('sadida_admin') : null);

    if (!currentToken || !currentStored) {
      clearAdminAuthSession();
      setIsAuthenticated(false);
      setCheckingAuth(false);
      return;
    }

    const verifySession = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            ...getAdminAuthHeaders(),
            Accept: 'application/json',
          },
        });
        const data = await res.json();
        if (data.success && data.data) {
          setIsAuthenticated(true);
          setUser({
            usersName: data.data.usersName,
            role: data.data.role,
          });
        } else {
          clearAdminAuthSession();
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.warn('Auth check warning:', err);
        clearAdminAuthSession();
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifySession();
  }, []);

  // 1. If no credentials exist, immediately redirect to /admin/login (prevents any leak)
  if (!hasCredentials) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. While checking with the server, show loading screen (never render admin content)
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-['Prompt']">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-neutral-500 font-mono tracking-wider">VERIFYING ADMIN SESSION...</p>
        </div>
      </div>
    );
  }

  // 3. If server rejects the session, redirect to /admin/login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // 4. Authenticated: render admin panel
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <AdminSidebar userName={user.usersName} userRole={user.role} />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
