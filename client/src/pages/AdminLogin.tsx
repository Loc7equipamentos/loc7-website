import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Salvar token no localStorage
        localStorage.setItem('adminToken', data.token);
        // Redirecionar para dashboard
        setLocation('/admin');
      } else {
        const data = await response.json();
        setError(data.error || 'Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">LOC 7</h1>
          <p className="text-gray-400">Painel Admin</p>
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@loc7equipamentos.com.br"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Botão */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? 'Conectando...' : 'Entrar'}
          </Button>

          {/* Link Esqueci Senha */}
          <div className="text-center mt-4">
            <a
              href="/admin-forgot-password"
              className="text-blue-400 hover:text-blue-300 text-sm transition"
            >
              Esqueci minha senha
            </a>
          </div>
        </form>

        {/* Informações */}
        <div className="mt-8 p-4 bg-gray-700/50 rounded-lg">
          <p className="text-gray-400 text-sm">
            <strong>Credenciais padrão:</strong>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Email: <code className="bg-gray-800 px-2 py-1 rounded">loc7@loc7equipamentos.com.br</code>
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Senha: <code className="bg-gray-800 px-2 py-1 rounded">admin123</code>
          </p>
          <p className="text-gray-500 text-xs mt-3">
            ⚠️ Altere a senha após o primeiro login!
          </p>
        </div>
      </Card>
    </div>
  );
}
