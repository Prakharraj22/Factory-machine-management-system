import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Bell, Sun, Moon, Menu, ChevronDown, User, Settings, LogOut,
  Search, AlertCircle, AlertTriangle, Info, CheckCircle, Cpu,
  Clock, Wifi,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Machine M102 Critical Alert', message: 'Failure probability exceeded 92% — Immediate inspection required', time: '2 min ago', read: false, type: 'critical' },
  { id: 2, title: 'Maintenance Completed', message: 'Machine M103 scheduled maintenance finished successfully', time: '18 min ago', read: false, type: 'success' },
  { id: 3, title: 'Temperature Threshold Exceeded', message: 'Machine M110 running at 95°C — threshold is 90°C', time: '1 hr ago', read: true, type: 'warning' },
  { id: 4, title: 'ML Model Update Available', message: 'Predictive model v2.5 ready for deployment', time: '3 hrs ago', read: true, type: 'info' },
  { id: 5, title: 'Stamping Press J10 Alert', message: 'High vibration levels detected — Health score 58%', time: '5 hrs ago', read: true, type: 'warning' },
];

const notifIcons = {
  critical: { Icon: AlertCircle, color: 'text-danger-400', dot: 'bg-danger-500' },
  warning:  { Icon: AlertTriangle, color: 'text-warning-400', dot: 'bg-warning-500' },
  info:     { Icon: Info, color: 'text-primary-400', dot: 'bg-primary-500' },
  success:  { Icon: CheckCircle, color: 'text-success-400', dot: 'bg-success-500' },
};

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hidden xl:flex flex-col items-end text-right">
      <span className="text-sm font-bold text-dark-800 dark:text-white font-mono tracking-tight">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <span className="text-[10px] text-dark-400">
        {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
      </span>
    </div>
  );
}

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
    };
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') { setShowSearch(false); setShowNotifications(false); setShowProfile(false); }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-dark-900/90 backdrop-blur-xl border-b border-dark-200 dark:border-dark-800">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">

        {/* ─ Left ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5 text-dark-600 dark:text-dark-300" />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse shadow-sm shadow-success-500/50" />
              <span className="text-[10px] font-semibold text-success-500 uppercase tracking-wider">Live</span>
            </div>
            <div className="h-4 w-px bg-dark-200 dark:bg-dark-700" />
            <div className="hidden md:block">
              <p className="text-sm font-bold text-dark-900 dark:text-white">Smart Factory Monitoring</p>
              <p className="text-[10px] text-dark-400">Industrial Predictive Maintenance Platform</p>
            </div>
          </div>
        </div>

        {/* ─ Right ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5">
          <LiveClock />
          <div className="hidden xl:flex items-center mx-1 h-6 w-px bg-dark-200 dark:bg-dark-700" />

          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-400 hover:text-dark-700 dark:hover:text-white text-xs transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden lg:block">Search...</span>
              <kbd className="hidden lg:block px-1.5 py-0.5 rounded text-[9px] font-bold bg-dark-200 dark:bg-dark-700 text-dark-400">⌘K</kbd>
            </button>

            {showSearch && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 shadow-2xl overflow-hidden animate-scale-in">
                <div className="flex items-center gap-2 px-3 py-3 border-b border-dark-100 dark:border-dark-700">
                  <Search className="h-4 w-4 text-dark-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search machines, alerts, reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-sm bg-transparent text-dark-800 dark:text-white placeholder-dark-400 outline-none"
                  />
                </div>
                <div className="p-2">
                  <p className="px-2 py-1.5 text-[10px] font-semibold text-dark-400 uppercase tracking-wider">Quick Links</p>
                  {[
                    { label: 'Dashboard', path: '/', icon: '⚡' },
                    { label: 'Predictions', path: '/predictions', icon: '🧠' },
                    { label: 'Analytics', path: '/analytics', icon: '📊' },
                    { label: 'Admin Panel', path: '/admin', icon: '🛡️' },
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setShowSearch(false); }}
                      className="flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors text-left"
                    >
                      <span>{item.icon}</span>
                      <span className="text-sm text-dark-700 dark:text-dark-200">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-all duration-300"
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {dark ? (
              <Sun className="h-4.5 w-4.5 text-warning-400" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-dark-500" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative p-2.5 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-all duration-200"
            >
              <Bell className="h-4.5 w-4.5 text-dark-500 dark:text-dark-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-danger-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse shadow-sm shadow-danger-500/50">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-88 max-w-[calc(100vw-1rem)] rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 shadow-2xl overflow-hidden animate-scale-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-dark-200 dark:border-dark-700">
                  <div>
                    <h3 className="text-sm font-bold text-dark-800 dark:text-white">Notifications</h3>
                    <p className="text-[10px] text-dark-400">{unreadCount} unread</p>
                  </div>
                  <button onClick={markAllRead} className="text-xs text-primary-500 hover:text-primary-400 font-semibold transition-colors">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-dark-100 dark:divide-dark-700/50">
                  {notifications.map((n) => {
                    const nc = notifIcons[n.type] || notifIcons.info;
                    return (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3.5 hover:bg-dark-50 dark:hover:bg-dark-700/40 transition-colors cursor-pointer ${
                          !n.read ? 'bg-primary-50/60 dark:bg-primary-500/5' : ''
                        }`}
                      >
                        <div className={`mt-0.5 shrink-0 ${nc.color}`}>
                          <nc.Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-dark-800 dark:text-white">{n.title}</p>
                            {!n.read && <div className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${nc.dot}`} />}
                          </div>
                          <p className="text-[11px] text-dark-500 dark:text-dark-400 mt-0.5 leading-relaxed">{n.message}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Clock className="h-2.5 w-2.5 text-dark-400" />
                            <p className="text-[10px] text-dark-400">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 py-2.5 border-t border-dark-200 dark:border-dark-700">
                  <button className="w-full text-xs text-center text-primary-500 hover:text-primary-400 font-semibold transition-colors">
                    View All Alerts →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-all duration-200"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                {user?.avatar || user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-dark-800 dark:text-white">{user?.name || 'User'}</p>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  user?.role === 'Admin' ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20' :
                  user?.role === 'Engineer' ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20' :
                  'bg-success-500/15 text-success-400 border border-success-500/20'
                }`}>
                  {user?.role || 'Viewer'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-dark-400 hidden md:block" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 shadow-2xl overflow-hidden animate-scale-in">
                <div className="px-4 py-4 border-b border-dark-200 dark:border-dark-700 bg-gradient-to-br from-primary-50 dark:from-primary-500/5 to-transparent">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-md mb-2">
                    {user?.avatar || user?.name?.charAt(0) || 'U'}
                  </div>
                  <p className="text-sm font-bold text-dark-800 dark:text-white">{user?.name}</p>
                  <p className="text-[11px] text-dark-400 mt-0.5">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors">
                    <User className="h-3.5 w-3.5" /> My Profile
                  </button>
                  <button className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors">
                    <Settings className="h-3.5 w-3.5" /> Settings
                  </button>
                  <div className="my-1 mx-4 h-px bg-dark-100 dark:bg-dark-700" />
                  <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
