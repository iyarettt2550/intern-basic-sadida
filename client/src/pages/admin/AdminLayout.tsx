import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { getCookie, removeCookie, getAdminToken, getAdminAuthHeaders } from '../../utils/cookies';
import { API_BASE } from '../../utils/productStore';

export const AdminLayout: React.FC = () => {
  const token = getAdminToken();
  const stored = getCookie('sadida_admin') || (typeof localStorage !== 'undefined' ? localStorage.getItem('sadida_admin') : null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(token && stored));

  let initialUser: { usersName?: string; role?: string } = {};
  if (stored) {
    try {
      initialUser = JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const verifySession = async () => {
      const currentToken = getAdminToken();
      if (!currentToken) {
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }

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
          setIsAuthenticated(false);
          removeCookie('sadida_admin_token');
          removeCookie('sadida_admin');
          try {
            localStorage.removeItem('sadida_admin_token');
            localStorage.removeItem('sadida_admin');
          } catch {}
        }
      } catch (err) {
        // If network error, allow temporary offline grace if token exists
        console.warn('Auth check network warning:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifySession();
  }, []);

  if (!token && !checkingAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAuthenticated && !checkingAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar userName={user.usersName} userRole={user.role} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
