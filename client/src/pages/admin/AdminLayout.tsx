import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { getCookie, removeCookie } from '../../utils/cookies';

export const AdminLayout: React.FC = () => {
  const stored = getCookie('sadida_admin') || localStorage.getItem('sadida_admin');

  if (!stored) {
    return <Navigate to="/admin/login" replace />;
  }

  let user: { usersName?: string; role?: string } = {};
  try {
    user = JSON.parse(stored);
  } catch {
    removeCookie('sadida_admin');
    localStorage.removeItem('sadida_admin');
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
