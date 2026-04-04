import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Trash2, Filter, Search } from 'lucide-react';

interface Cadastro {
  id: string;
  tipo: 'pf' | 'pj';
  nome: string;
  email: string;
  telefone: string;
  dataCadastro: string;
  pdfUrl: string;
  status: 'novo' | 'processado' | 'aprovado' | 'rejeitado';
}

export default function AdminDashboard() {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'pf' | 'pj'>('todos');
  const [statusFiltro, setStatusFiltro] = useState<'todos' | 'novo' | 'processado' | 'aprovado' | 'rejeitado'>('novo');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCadastros();
  }, [filtro, statusFiltro]);

  const carregarCadastros = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtro !== 'todos') params.append('tipo', filtro);
      if (statusFiltro !== 'todos') params.append('status', statusFiltro);

      const response = await fetch(`/api/cadastros?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCadastros(data);
      }
    } catch (error) {
      console.error('Erro ao carregar cadastros:', error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id: string, novoStatus: string) => {
    try {
      const response = await fetch(`/api/cadastros/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (response.ok) {
        carregarCadastros();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const deletarCadastro = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este cadastro?')) {
      try {
        const response = await fetch(`/api/cadastros/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          carregarCadastros();
        }
      } catch (error) {
        console.error('Erro ao deletar cadastro:', error);
      }
    }
  };

  const cadastrosFiltrados = cadastros.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.email.toLowerCase().includes(busca.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo':
        return 'bg-blue-100 text-blue-800';
      case 'processado':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    return tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Painel Admin</h1>
          <p className="text-gray-400">Gerenciar cadastros de clientes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 p-6 text-white">
            <p className="text-sm opacity-80">Total de Cadastros</p>
            <p className="text-3xl font-bold">{cadastros.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0 p-6 text-white">
            <p className="text-sm opacity-80">Novos</p>
            <p className="text-3xl font-bold">{cadastros.filter(c => c.status === 'novo').length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 p-6 text-white">
            <p className="text-sm opacity-80">Aprovados</p>
            <p className="text-3xl font-bold">{cadastros.filter(c => c.status === 'aprovado').length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 p-6 text-white">
            <p className="text-sm opacity-80">Rejeitados</p>
            <p className="text-3xl font-bold">{cadastros.filter(c => c.status === 'rejeitado').length}</p>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-gray-800 border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filtro Tipo */}
            <select
              value={filtro}
              onChange={(e) => setFiltro(e.target.value as any)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="todos">Todos os Tipos</option>
              <option value="pf">Pessoa Física</option>
              <option value="pj">Pessoa Jurídica</option>
            </select>

            {/* Filtro Status */}
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value as any)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="novo">Novo</option>
              <option value="processado">Processado</option>
              <option value="aprovado">Aprovado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>

            {/* Botão Atualizar */}
            <Button
              onClick={carregarCadastros}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </Card>

        {/* Tabela */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">
            <p>Carregando cadastros...</p>
          </div>
        ) : cadastrosFiltrados.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>Nenhum cadastro encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Nome</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Tipo</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Email</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Telefone</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Data</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Status</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {cadastrosFiltrados.map((cadastro) => (
                  <tr key={cadastro.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                    <td className="py-4 px-6 text-white">{cadastro.nome}</td>
                    <td className="py-4 px-6 text-gray-300">{getTipoLabel(cadastro.tipo)}</td>
                    <td className="py-4 px-6 text-gray-300">{cadastro.email}</td>
                    <td className="py-4 px-6 text-gray-300">{cadastro.telefone}</td>
                    <td className="py-4 px-6 text-gray-300">{new Date(cadastro.dataCadastro).toLocaleDateString('pt-BR')}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(cadastro.status)}`}>
                        {cadastro.status.charAt(0).toUpperCase() + cadastro.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {/* Ver PDF */}
                        <a
                          href={cadastro.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                          title="Ver PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </a>

                        {/* Download PDF */}
                        <a
                          href={cadastro.pdfUrl}
                          download
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </a>

                        {/* Menu Status */}
                        <select
                          value={cadastro.status}
                          onChange={(e) => atualizarStatus(cadastro.id, e.target.value)}
                          className="px-2 py-1 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option value="novo">Novo</option>
                          <option value="processado">Processado</option>
                          <option value="aprovado">Aprovado</option>
                          <option value="rejeitado">Rejeitado</option>
                        </select>

                        {/* Deletar */}
                        <button
                          onClick={() => deletarCadastro(cadastro.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
