import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('factory_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('factory_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const data = await loginUser(email, password);
      const userData = {
        email: data.email || email,
        name: data.name || email.split('@')[0],
        role: data.role || role || 'Viewer',
        avatar: (data.name || email).charAt(0).toUpperCase(),
        token: data.token,
      };
      setUser(userData);
      localStorage.setItem('factory_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('Login API error:', err);
      throw new Error(err.response?.data?.message || err.message || 'Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('factory_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
