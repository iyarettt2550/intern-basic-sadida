import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Globe, MessageSquare, LogOut } from 'lucide-react';

interface AdminSidebarProps {
  userName?: string;
  userRole?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ userName, userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('sadida_admin');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'จัดการสินค้า', icon: Package },
    { path: '/admin/website', label: 'จัดการหน้าเว็บ', icon: Globe },
    { path: '/admin/contacts', label: 'ข้อความติดต่อ', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r-2 border-black flex flex-col">
      {/* Brand section */}
      <div className="p-6 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000000]">
            <span className="text-white font-black text-sm font-['Space_Grotesk']">S</span>
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter text-black font-['Space_Grotesk'] leading-none">
              SADIDA
            </h2>
            <span className="text-[10px] text-neutral-500 tracking-widest uppercase font-bold">
              Admin Panel
            </span>
          </div>
        </div>
        {userName && (
          <div className="mt-3 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg">
            <p className="text-xs font-bold text-black truncate">{userName}</p>
            <p className="text-[10px] text-neutral-500">{userRole || 'Admin'}</p>
          </div>
        )}
      </div>

      {/* Menu items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 border-2 ${
                isActive
                  ? 'bg-black text-white border-black shadow-[3px_3px_0px_#000000]'
                  : 'bg-white text-black border-transparent hover:border-black hover:bg-neutral-50'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t-2 border-black">
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-black bg-white border-2 border-black hover:bg-red-50 hover:border-red-500 hover:text-red-600 shadow-[3px_3px_0px_#000000] hover:shadow-[3px_3px_0px_#ef4444] transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
