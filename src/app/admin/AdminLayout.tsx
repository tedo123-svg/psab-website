import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAdmin } from '../contexts/AdminContext';
import {
  LayoutDashboard, Newspaper, FolderKanban, BookOpen,
  MessageSquare, LogOut, Menu, Bell, Wrench, Images
} from 'lucide-react';
import { useState } from 'react';
import logo from '../components/logo.png';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hero', label: 'Hero Slides', icon: Images, end: false },
  { to: '/admin/news', label: 'News', icon: Newspaper, end: false },
  { to: '/admin/services', label: 'Services', icon: Wrench, end: false },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban, end: false },
  { to: '/admin/resources', label: 'Resources', icon: BookOpen, end: false },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare, end: false },
];

export function AdminLayout() {
  const { logout, unreadCount } = useAdmin();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const Sidebar = () => (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          <div>
            <p className="font-bold text-sm leading-tight">Lemi Kura PSAO</p>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
              {item.label === 'Messages' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex flex-col flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            {unreadCount > 0 && (
              <NavLink to="/admin/messages" className="relative p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </NavLink>
            )}
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
