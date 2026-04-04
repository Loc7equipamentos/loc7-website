import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function Admin() {
  const { user, loading: authLoading, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Fetch registrations
  const { data, isLoading, error } = trpc.registrations.list.useQuery(
    {
      limit: pageSize,
      offset: page * pageSize,
    },
    {
      enabled: isAuthenticated && user?.role === 'admin',
    }
  );

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.45_0.25_25)]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="bg-red-900/20 border border-red-500 p-6 max-w-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-red-400 font-semibold mb-2">Acesso Negado</h3>
                <p className="text-red-300 text-sm">
                  Você não tem permissão para acessar esta página. Apenas administradores podem visualizar registros.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const handleExportCSV = () => {
    if (!data?.registrations) return;

    const headers = ['ID', 'Tipo', 'Nome', 'Email', 'Telefone', 'CPF/CNPJ', 'Data de Cadastro'];
    const rows = data.registrations.map((reg: any) => [
      reg.id,
      reg.type === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
      reg.fullName,
      reg.email,
      reg.phone,
      reg.cpf || reg.cnpj || '-',
      new Date(reg.createdAt).toLocaleDateString('pt-BR'),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `registros-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Registros de Cadastro
            </h1>
            <p className="text-[oklch(0.6_0_0)]">
              Total: {data?.count || 0} registros
            </p>
          </div>
          <Button
            onClick={handleExportCSV}
            disabled={!data?.registrations || isLoading}
            className="loc7-btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Card className="bg-red-900/20 border border-red-500 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-400 font-medium">Erro ao carregar registros</p>
                <p className="text-red-300 text-sm mt-1">{error.message}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.45_0.25_25)]" />
          </div>
        )}

        {/* Table */}
        {!isLoading && data?.registrations && (
          <>
            <Card className="bg-[oklch(0.1_0_0)] border-[oklch(0.2_0_0)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[oklch(0.2_0_0)]">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Tipo</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nome</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Telefone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">CPF/CNPJ</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.registrations.length > 0 ? (
                      data.registrations.map((reg: any, idx: number) => (
                        <tr
                          key={reg.id}
                          className={`border-b border-[oklch(0.15_0_0)] hover:bg-[oklch(0.12_0_0)] transition-colors ${
                            idx % 2 === 0 ? 'bg-[oklch(0.08_0_0)]' : ''
                          }`}
                        >
                          <td className="px-6 py-4 text-sm text-[oklch(0.7_0_0)]">{reg.id}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              reg.type === 'pessoa_fisica'
                                ? 'bg-blue-900/30 text-blue-400'
                                : 'bg-purple-900/30 text-purple-400'
                            }`}>
                              {reg.type === 'pessoa_fisica' ? 'PF' : 'PJ'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-white font-medium">{reg.fullName}</td>
                          <td className="px-6 py-4 text-sm text-[oklch(0.7_0_0)]">{reg.email}</td>
                          <td className="px-6 py-4 text-sm text-[oklch(0.7_0_0)]">{reg.phone}</td>
                          <td className="px-6 py-4 text-sm text-[oklch(0.7_0_0)]">
                            {reg.cpf || reg.cnpj || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-[oklch(0.7_0_0)]">
                            {new Date(reg.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-[oklch(0.5_0_0)]">
                          Nenhum registro encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            {data.count > pageSize && (
              <div className="flex items-center justify-between">
                <p className="text-[oklch(0.6_0_0)] text-sm">
                  Mostrando {page * pageSize + 1} a {Math.min((page + 1) * pageSize, data.count)} de {data.count}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    variant="outline"
                    className="text-white border-[oklch(0.2_0_0)] hover:bg-[oklch(0.12_0_0)]"
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={() => setPage(page + 1)}
                    disabled={(page + 1) * pageSize >= data.count}
                    variant="outline"
                    className="text-white border-[oklch(0.2_0_0)] hover:bg-[oklch(0.12_0_0)]"
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && data?.registrations && data.registrations.length === 0 && (
          <Card className="bg-[oklch(0.1_0_0)] border-[oklch(0.2_0_0)] p-12 text-center">
            <CheckCircle className="w-12 h-12 text-[oklch(0.45_0.25_25)] mx-auto mb-4 opacity-50" />
            <p className="text-[oklch(0.6_0_0)] text-lg">Nenhum registro de cadastro ainda</p>
            <p className="text-[oklch(0.5_0_0)] text-sm mt-2">Os registros aparecerão aqui quando clientes se cadastrarem</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
