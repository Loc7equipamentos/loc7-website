import { useState, useEffect } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { useLocation } from 'wouter';

import AdminDashboard from './AdminDashboard';
import AdminCadastros from './AdminCadastros';

type UserRole = 'owner' | 'admin' | 'registration_analyst' | 'sales' | 'product_manager';

export default function AdminProtected() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('admin');

  const [location] = useLocation();

  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  /*
   * Roteamento interno do admin
   * /admin-panel              -> AdminDashboard (produtos)
   * /admin-panel/cadastros    -> AdminCadastros
   */
  const currentPage = location.startsWith('/admin-panel/cadastros')
    ? 'cadastros'
    : 'dashboard';

  useEffect(() => {
    const debug = {
      passwordConfigured: !!correctPassword,
      passwordValue: correctPassword ? '***' : 'NOT_SET',
      localStorageValue: localStorage.getItem('admin-auth'),
      localStorageRole: localStorage.getItem('admin-role'),
      currentLocation: location,
      currentPage,
      timestamp: new Date().toISOString(),
    };

    if (import.meta.env.DEV) {
      console.log('[AdminProtected] Mount check:', debug);
      setDebugInfo(JSON.stringify(debug, null, 2));
    }

    if (!correctPassword) {
      if (import.meta.env.DEV) {
        console.warn('[AdminProtected] PASSWORD NOT CONFIGURED - Access denied');
      }

      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const savedAuth = localStorage.getItem('admin-auth');
    const savedRole = (localStorage.getItem('admin-role') as UserRole) || 'admin';

    // TEMP: token simplificado
    // FUTURO: substituir por Supabase Auth + JWT + RLS
    if (savedAuth === 'true') {
      if (import.meta.env.DEV) {
        console.log('[AdminProtected] Valid token found in localStorage');
      }

      setIsAuthenticated(true);
      setUserRole(savedRole);
    } else {
      if (import.meta.env.DEV) {
        console.log('[AdminProtected] No valid token - showing login');
      }

      setIsAuthenticated(false);
    }

    setLoading(false);
  }, [correctPassword, location, currentPage]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!correctPassword) {
      setError('Admin indisponível — senha não configurada');

      if (import.meta.env.DEV) {
        console.error('[AdminProtected] Login attempt with no password configured');
      }

      return;
    }

    if (password.trim() === '') {
      setError('Digite a senha');
      return;
    }

    if (password === correctPassword) {
      if (import.meta.env.DEV) {
        console.log('[AdminProtected] Login successful');
      }

      const defaultRole: UserRole = 'admin';

      localStorage.setItem('admin-auth', 'true');
      localStorage.setItem('admin-role', defaultRole);

      setIsAuthenticated(true);
      setUserRole(defaultRole);
      setPassword('');
      setError('');
    } else {
      if (import.meta.env.DEV) {
        console.warn('[AdminProtected] Login failed - incorrect password');
      }

      setError('Senha incorreta');
      setPassword('');
    }
  };

  const handleLogout = () => {
    if (import.meta.env.DEV) {
      console.log('[AdminProtected] Logout');
    }

    localStorage.removeItem('admin-auth');
    localStorage.removeItem('admin-role');

    setIsAuthenticated(false);
    setUserRole('admin');
    setPassword('');

    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!correctPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-8 shadow-2xl">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-red-900/50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-red-200 text-center mb-2">
              Admin Indisponível
            </h1>

            <p className="text-red-300 text-center text-sm">
              Senha não configurada no servidor. Contate o administrador.
            </p>

            {import.meta.env.DEV && (
              <div className="mt-6 p-3 bg-gray-900/50 rounded border border-gray-700 text-gray-400 text-xs font-mono overflow-auto max-h-40">
                <pre>{debugInfo}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-2xl">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Painel Protegido
            </h1>

            <p className="text-gray-400 text-center text-sm mb-8">
              Digite a senha para acessar
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-white focus:border-white transition-colors"
                autoFocus
              />

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Entrar
              </button>
            </form>

            <p className="text-gray-500 text-xs text-center mt-6">
              Acesso restrito. Apenas administradores.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'cadastros') {
    return <AdminCadastros onLogout={handleLogout} userRole={userRole} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
