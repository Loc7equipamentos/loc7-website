import { Express } from 'express';

// Simulado - em produção, isso viria do banco de dados
const cadastrosStore: Map<string, any> = new Map();

export function setupAdminRoutes(app: Express) {
  // GET /api/cadastros - Listar cadastros com filtros
  app.get('/api/cadastros', (req, res) => {
    try {
      const { tipo, status } = req.query;

      let cadastros = Array.from(cadastrosStore.values());

      // Filtrar por tipo
      if (tipo && tipo !== 'todos') {
        cadastros = cadastros.filter((c: any) => c.tipo === tipo);
      }

      // Filtrar por status
      if (status && status !== 'todos') {
        cadastros = cadastros.filter((c: any) => c.status === status);
      }

      // Ordenar por data (mais recentes primeiro)
      cadastros.sort((a: any, b: any) => 
        new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime()
      );

      res.json(cadastros);
    } catch (error) {
      console.error('Erro ao listar cadastros:', error);
      res.status(500).json({ error: 'Erro ao listar cadastros' });
    }
  });

  // GET /api/cadastros/:id - Obter cadastro específico
  app.get('/api/cadastros/:id', (req, res) => {
    try {
      const cadastro = cadastrosStore.get(req.params.id);

      if (!cadastro) {
        return res.status(404).json({ error: 'Cadastro não encontrado' });
      }

      res.json(cadastro);
    } catch (error) {
      console.error('Erro ao obter cadastro:', error);
      res.status(500).json({ error: 'Erro ao obter cadastro' });
    }
  });

  // PATCH /api/cadastros/:id/status - Atualizar status
  app.patch('/api/cadastros/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      const cadastro = cadastrosStore.get(req.params.id);

      if (!cadastro) {
        return res.status(404).json({ error: 'Cadastro não encontrado' });
      }

      cadastro.status = status;
      cadastro.statusUpdatedAt = new Date().toISOString();
      cadastrosStore.set(req.params.id, cadastro);

      res.json(cadastro);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  });

  // DELETE /api/cadastros/:id - Deletar cadastro
  app.delete('/api/cadastros/:id', (req, res) => {
    try {
      const deleted = cadastrosStore.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Cadastro não encontrado' });
      }

      res.json({ success: true, message: 'Cadastro deletado' });
    } catch (error) {
      console.error('Erro ao deletar cadastro:', error);
      res.status(500).json({ error: 'Erro ao deletar cadastro' });
    }
  });

  // POST /api/cadastros - Criar novo cadastro (chamado internamente)
  app.post('/api/cadastros', (req, res) => {
    try {
      const { id, tipo, nome, email, telefone, dataCadastro, pdfUrl } = req.body;

      const cadastro = {
        id,
        tipo,
        nome,
        email,
        telefone,
        dataCadastro,
        pdfUrl,
        status: 'novo',
        statusUpdatedAt: new Date().toISOString(),
      };

      cadastrosStore.set(id, cadastro);

      res.json(cadastro);
    } catch (error) {
      console.error('Erro ao criar cadastro:', error);
      res.status(500).json({ error: 'Erro ao criar cadastro' });
    }
  });

  // GET /api/cadastros/stats - Estatísticas
  app.get('/api/cadastros/stats', (req, res) => {
    try {
      const cadastros = Array.from(cadastrosStore.values());

      const stats = {
        total: cadastros.length,
        novo: cadastros.filter((c: any) => c.status === 'novo').length,
        processado: cadastros.filter((c: any) => c.status === 'processado').length,
        aprovado: cadastros.filter((c: any) => c.status === 'aprovado').length,
        rejeitado: cadastros.filter((c: any) => c.status === 'rejeitado').length,
        pf: cadastros.filter((c: any) => c.tipo === 'pf').length,
        pj: cadastros.filter((c: any) => c.tipo === 'pj').length,
      };

      res.json(stats);
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  });
}

// Função auxiliar para adicionar cadastro ao store (chamada após submissão)
export function addCadastroToStore(
  tipo: 'pf' | 'pj',
  nome: string,
  email: string,
  telefone: string,
  pdfUrl: string
) {
  const id = `${tipo}-${Date.now()}`;
  const cadastro = {
    id,
    tipo,
    nome,
    email,
    telefone,
    dataCadastro: new Date().toISOString(),
    pdfUrl,
    status: 'novo',
    statusUpdatedAt: new Date().toISOString(),
  };

  cadastrosStore.set(id, cadastro);
  return cadastro;
}
