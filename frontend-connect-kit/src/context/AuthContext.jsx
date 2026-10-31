import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../lib/services';
import { tokenStore } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!tokenStore.get()); // token है तो पहले profile check होगी

  useEffect(() => {
    if (!tokenStore.get()) return undefined;
    let alive = true;
    authService.me().then((u) => alive && setUser(u)).catch(() => {}).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  // Token expire होने पर api.js यह event भेजता है
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener('ft:auth-expired', onExpired);
    return () => window.removeEventListener('ft:auth-expired', onExpired);
  }, []);

  const login = useCallback(async (email, password) => { const u = await authService.login(email, password); setUser(u); return u; }, []);
  const register = useCallback(async (form) => { const u = await authService.register(form); setUser(u); return u; }, []);
  const logout = useCallback(() => { authService.logout(); setUser(null); }, []);

  const value = useMemo(
    () => ({ user, loading, isLoggedIn: !!user, isAdmin: user?.role === 'admin', login, register, logout }),
    [user, loading, login, register, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
