export default function Admin() {
  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Painel Admin</h1>

        <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Bem-vindo ao Painel Admin</h2>
            <p className="text-[oklch(0.7_0_0)] mb-6">
              Este é um painel de administração para gerenciar os produtos e categorias da Loc 7 Equipamentos.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-[oklch(0.15_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">📦 Produtos</h3>
                <p className="text-[oklch(0.7_0_0)] text-sm mb-4">Gerenciar produtos do catálogo</p>
                <button className="w-full px-4 py-2 bg-[oklch(0.45_0.25_25)] text-white rounded font-semibold hover:bg-[oklch(0.5_0.25_25)] transition">
                  Acessar
                </button>
              </div>

              <div className="bg-[oklch(0.15_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">📂 Categorias</h3>
                <p className="text-[oklch(0.7_0_0)] text-sm mb-4">Gerenciar categorias de equipamentos</p>
                <button className="w-full px-4 py-2 bg-[oklch(0.45_0.25_25)] text-white rounded font-semibold hover:bg-[oklch(0.5_0.25_25)] transition">
                  Acessar
                </button>
              </div>

              <div className="bg-[oklch(0.15_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-2">📊 Relatórios</h3>
                <p className="text-[oklch(0.7_0_0)] text-sm mb-4">Ver estatísticas e relatórios</p>
                <button className="w-full px-4 py-2 bg-[oklch(0.45_0.25_25)] text-white rounded font-semibold hover:bg-[oklch(0.5_0.25_25)] transition">
                  Acessar
                </button>
              </div>
            </div>

            <div className="mt-12 p-6 bg-[oklch(0.15_0_0)] border border-[oklch(0.2_0_0)] rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">📝 Informações</h3>
              <ul className="text-left text-[oklch(0.7_0_0)] space-y-2">
                <li>✅ Total de Produtos: <span className="text-white font-semibold">24</span></li>
                <li>✅ Total de Categorias: <span className="text-white font-semibold">9</span></li>
                <li>✅ Equipamentos em Estoque: <span className="text-white font-semibold">24</span></li>
                <li>✅ Última Atualização: <span className="text-white font-semibold">Hoje</span></li>
              </ul>
            </div>

            <div className="mt-8 p-4 bg-[oklch(0.15_0_0)] border border-[oklch(0.45_0.25_25)] rounded-lg">
              <p className="text-[oklch(0.45_0.25_25)] font-semibold">💡 Dica</p>
              <p className="text-[oklch(0.7_0_0)] text-sm mt-2">
                Use o WhatsApp para receber notificações de novos pedidos e mensagens de clientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
