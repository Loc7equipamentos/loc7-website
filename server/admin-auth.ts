import { Express } from 'express';
import crypto from 'crypto';

// Simulado - em produção, usar banco de dados
const adminUsers = new Map<string, { email: string; passwordHash: string }>();

// Inicializar com admin padrão
const defaultAdminPassword = 'admin123';
const defaultAdminEmail = 'loc7@loc7equipamentos.com.br';
const defaultPasswordHash = hashPassword(defaultAdminPassword);

adminUsers.set(defaultAdminEmail, {
  email: defaultAdminEmail,
  passwordHash: defaultPasswordHash,
});

// Tokens ativos (em produção, usar JWT com expiração)
const activeTokens = new Set<string>();

/**
 * Hash de senha (simples - em produção usar bcrypt)
 */
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Gerar token
 */
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verificar token
 */
function verifyToken(token: string): boolean {
  return activeTokens.has(token);
}

/**
 * Middleware de autenticação
 */
export function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  next();
}

/**
 * Setup de rotas de autenticação
 */
export function setupAdminAuthRoutes(app: Express) {
  // POST /api/admin/login - Login
  app.post('/api/admin/login', (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const user = adminUsers.get(email);

      if (!user || user.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Gerar token
      const token = generateToken();
      activeTokens.add(token);

      // Expirar token em 24 horas (simples)
      setTimeout(() => activeTokens.delete(token), 24 * 60 * 60 * 1000);

      res.json({
        success: true,
        token,
        user: { email },
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  });

  // POST /api/admin/logout - Logout
  app.post('/api/admin/logout', (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (token) {
        activeTokens.delete(token);
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      res.status(500).json({ error: 'Erro ao fazer logout' });
    }
  });

  // POST /api/admin/change-password - Mudar senha
  app.post('/api/admin/change-password', authMiddleware, (req, res) => {
    try {
      const { email, currentPassword, newPassword } = req.body;

      if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      const user = adminUsers.get(email);

      if (!user || user.passwordHash !== hashPassword(currentPassword)) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }

      // Atualizar senha
      user.passwordHash = hashPassword(newPassword);
      adminUsers.set(email, user);

      res.json({ success: true, message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao mudar senha:', error);
      res.status(500).json({ error: 'Erro ao mudar senha' });
    }
  });

  // GET /api/admin/me - Obter dados do admin atual
  app.get('/api/admin/me', authMiddleware, (req, res) => {
    try {
      // Em produção, extrair email do token JWT
      const email = 'loc7@loc7equipamentos.com.br';

      const user = adminUsers.get(email);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({
        email: user.email,
      });
    } catch (error) {
      console.error('Erro ao obter dados do admin:', error);
      res.status(500).json({ error: 'Erro ao obter dados' });
    }
  });
}
