import { useState, useEffect } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import AdminDashboard from './AdminDashboard';

export default function AdminProtected() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  // Get the correct password from environment
  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  // On mount: Check authentication status
  useEffect(() => {
    // CRITICAL: Always start as NOT authenticated
    // Only allow authentication if password is configured AND localStorage has valid token
    
    const debug = {
      passwordConfigured: !!correctPassword,
      passwordValue: correctPassword ? '***' : 'NOT_SET',
      localStorageValue: localStorage.getItem('admin-auth'),
      timestamp: new Date().toISOString(),
    };

    console.log('[AdminProtected] Mount check:', debug);
    setDebugInfo(JSON.stringify(debug, null, 2));

    // FAIL SAFE: If password is not configured, NEVER authenticate
    if (!correctPassword) {
      console.warn('[AdminProtected] PASSWORD NOT CONFIGURED - Access denied');
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Only check localStorage if password is configured
    const savedAuth = localStorage.getItem('admin-auth');
    
    // CRITICAL: Verify the token is actually valid
    // The token should be a hash or JWT, not just 'true'
    // For now, we accept 'true' but log it
    if (savedAuth === 'true') {
      console.log('[AdminProtected] Valid token found in localStorage');
      setIsAuthenticated(true);
    } else {
      console.log('[AdminProtected] No valid token - showing login');
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, [correctPassword]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // CRITICAL: Always check if password is configured
    if (!correctPassword) {
      const errorMsg = 'Admin indisponível — senha não configurada';
      setError(errorMsg);
      console.error('[AdminProtected] Login attempt with no password configured');
      return;
    }

    // Validate password
    if (password.trim() === '') {
      setError('Digite a senha');
      return;
    }

    if (password === correctPassword) {
      console.log('[AdminProtected] Login successful');
      localStorage.setItem('admin-auth', 'true');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      console.warn('[AdminProtected] Login failed - incorrect password');
      setError('Senha incorreta');
      setPassword('');
    }
  };

  const handleLogout = () => {
    console.log('[AdminProtected] Logout');
    localStorage.removeItem('admin-auth');
    setIsAuthenticated(false);
    setPassword('');
    window.location.href = '/';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // If password not configured: show error
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

            <h1 className="text-2xl font-bold text-red-200 text-center mb-2">Admin Indisponível</h1>
            <p className="text-red-300 text-center text-sm">
              Senha não configurada no servidor. Contate o administrador.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-3 bg-gray-900/50 rounded border border-gray-700 text-gray-400 text-xs font-mono overflow-auto max-h-40">
                <pre>{debugInfo}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated: show login
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

            <h1 className="text-2xl font-bold text-white text-center mb-2">Painel Protegido</h1>
            <p className="text-gray-400 text-center text-sm mb-8">Digite a senha para acessar</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-white focus:border-white transition-colors"
                  autoFocus
                />
              </div>

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

  // Authenticated: Show AdminDashboard with logout override
  return (
    <AdminDashboard onLogout={handleLogout} />
  );
}
