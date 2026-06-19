import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BarChart3, BrainCircuit, DollarSign,
  ShieldCheck, LogOut, ChevronLeft, ChevronRight,
  FileText, Cpu, Bell, Settings,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Monitoring',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { path: '/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/predictions', label: 'Predictions', icon: BrainCircuit },
    ],
  },
  {
    label: 'Operations',
    items: [
      { path: '/cost', label: 'Cost Optimization', icon: DollarSign },
      { path: '/reports', label: 'Reports', icon: FileText },
    ],
  },
  {
    label: 'System',
    items: [
      { path: '/admin', label: 'Admin Panel', icon: ShieldCheck, adminOnly: true },
    ],
  },
];

function NavItem({ item, collapsed, user }) {
  if (item.adminOnly && user?.role !== 'Admin') return null;

  return (
    <NavLink
      to={item.path}
      end={item.exact}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
          isActive
            ? 'nav-active'
            : 'text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800/80 hover:text-dark-800 dark:hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
          {!collapsed && <span className="truncate text-sm">{item.label}</span>}
          {isActive && !collapsed && (
            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-400" />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={onToggle} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen flex flex-col bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[72px]' : 'w-64'
        } ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}
      >
        {/* ─ Logo ─────────────────────────────────────────────── */}
        <div className={`flex items-center h-16 border-b border-dark-200 dark:border-dark-800 shrink-0 ${collapsed ? 'px-3 justify-center' : 'px-4 gap-3'}`}>
          {/* Hex icon */}
          <div className="relative shrink-0 h-9 w-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-cyan-600 shadow-lg shadow-primary-500/30" />
            <Cpu className="relative h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-dark-900 dark:text-white tracking-tight">
                  Factory<span className="gradient-text-cyan">IQ</span>
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary-500/15 text-primary-400 border border-primary-500/20 uppercase tracking-wide">
                  Enterprise
                </span>
              </div>
              <p className="text-[10px] text-dark-400 truncate">Predictive Maintenance</p>
            </div>
          )}
        </div>

        {/* ─ Navigation ─────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-hide">
          {NAV_GROUPS.map((group) => {
            const visibleItems = group.items.filter(
              (item) => !item.adminOnly || user?.role === 'Admin'
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label}>
                {!collapsed && (
                  <p className="px-3 mb-1.5 text-[10px] font-bold text-dark-400 uppercase tracking-widest">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {visibleItems.map((item) => (
                    <NavItem key={item.path} item={item} collapsed={collapsed} user={user} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* ─ User + Logout ─────────────────────────────────────── */}
        <div className="px-3 py-4 border-t border-dark-200 dark:border-dark-800 shrink-0 space-y-1">
          {!collapsed && user && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-dark-50 dark:bg-dark-800/60 mb-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0">
                {user.avatar || user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-dark-800 dark:text-white truncate">{user.name}</p>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  user.role === 'Admin'
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/20'
                    : user.role === 'Engineer'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/20'
                    : 'bg-success-500/20 text-success-400 border border-success-500/20'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-500 dark:text-dark-400 hover:bg-danger-50 dark:hover:bg-danger-500/10 hover:text-danger-600 dark:hover:text-danger-400 transition-all duration-200 w-full"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* ─ Collapse Toggle ─────────────────────────────────── */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 shadow-md hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-dark-500" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-dark-500" />
          )}
        </button>
      </aside>
    </>
  );
}
