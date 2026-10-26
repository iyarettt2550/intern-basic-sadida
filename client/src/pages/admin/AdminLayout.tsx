import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

export const AdminLayout: React.FC = () => {
  const stored = localStorage.getItem('sadida_admin');

  if (!stored) {
    return <Navigate to="/admin/login" replace />;
  }

  let user: { usersName?: string; role?: string } = {};
  try {
    user = JSON.parse(stored);
  } catch {
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
