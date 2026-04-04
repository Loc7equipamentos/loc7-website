import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
        setEmail('');
        // Redirecionar após 3 segundos
        setTimeout(() => setLocation('/admin-login'), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao enviar email de recuperação');
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
          <p className="text-gray-400">Recuperar Senha</p>
        </div>

        {success ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Email Enviado!</h2>
            <p className="text-gray-400 mb-6">
              Verifique seu email para instruções de recuperação de senha.
            </p>
            <p className="text-gray-500 text-sm">
              Redirecionando para login em 3 segundos...
            </p>
          </div>
        ) : (
          <>
            {/* Erro */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Informação */}
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <p className="text-blue-300 text-sm">
                Digite seu email de admin e enviaremos um link para recuperar sua senha.
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {/* Botão */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </Button>

              {/* Voltar */}
              <Button
                type="button"
                onClick={() => setLocation('/admin-login')}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition"
              >
                Voltar para Login
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
