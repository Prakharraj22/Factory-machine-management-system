import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ToastNotification';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import SessionTimeoutModal from './components/SessionTimeoutModal';

const TIMEOUT_MS = 30 * 60 * 1000;   // 30 minutes inactivity
const WARNING_AT_S = 5 * 60;          // Show warning 5 min before expiry

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = ['/login', '/forgot-password', '/session-expired', '/unauthorized'].includes(location.pathname);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  // ── Session timeout tracker ─────────────────────────────
  const resetTimer = useCallback(() => {
    if (!user) return;
    const expiry = Date.now() + TIMEOUT_MS;
    sessionStorage.setItem('session_expiry', expiry.toString());
    setShowTimeoutModal(false);
  }, [user]);

  useEffect(() => {
    if (!user || isLoginPage) return;

    resetTimer();

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    const handler = () => resetTimer();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));

    const check = setInterval(() => {
      const expiry = parseInt(sessionStorage.getItem('session_expiry') || '0', 10);
      const remaining = expiry - Date.now();

      if (remaining <= 0) {
        clearInterval(check);
        logout();
        navigate('/session-expired');
      } else if (remaining <= WARNING_AT_S * 1000 && !showTimeoutModal) {
        setShowTimeoutModal(true);
      }
    }, 10000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      clearInterval(check);
    };
  }, [user, isLoginPage, resetTimer, logout, navigate, showTimeoutModal]);

  if (isLoginPage) return <AppRoutes />;

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 transition-colors duration-300">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div
        className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'}`}
      >
        <Navbar onMenuToggle={toggleSidebar} />
        <main className="p-4 lg:p-6">
          <AppRoutes />
        </main>
      </div>

      {showTimeoutModal && (
        <SessionTimeoutModal
          warningAt={WARNING_AT_S}
          onExtend={resetTimer}
          onLogout={() => { logout(); navigate('/session-expired'); }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppLayout />
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
