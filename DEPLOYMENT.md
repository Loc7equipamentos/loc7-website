# Deploy no Vercel - LOC7 Equipamentos

## 📋 Pré-requisitos

- [ ] Repositório GitHub com o código
- [ ] Conta Vercel
- [ ] Projeto Supabase configurado
- [ ] Variáveis de ambiente prontas

## 🚀 Passos para Deploy

### 1. Preparar o Repositório

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/loc7-website.git
cd loc7-website

# Instalar dependências
pnpm install

# Build local para testar
pnpm run build
```

### 2. Conectar ao Vercel

#### Opção A: Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

#### Opção B: Via Dashboard
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em **Add New** → **Project**
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente (veja abaixo)
5. Clique em **Deploy**

### 3. Configurar Variáveis de Ambiente

No Vercel Dashboard:

1. Vá para **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = sua_chave_anonima
```

### 4. Configurar Build

No Vercel Dashboard → **Settings** → **Build & Development Settings**:

- **Framework Preset**: Vite
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### 5. Verificar Deployment

Após o deploy:

1. Acesse a URL fornecida pelo Vercel
2. Teste o site principal
3. Acesse `/admin-panel` para testar o painel admin
4. Teste CRUD de produtos

## 🔄 Deployments Automáticos

Após a primeira configuração, qualquer push para `main` (ou branch configurada) fará deploy automático.

### Desabilitar Auto-Deploy

Se necessário, vá para **Settings** → **Git** e desabilite **Auto-Deploy**.

## 📊 Monitoramento

No Vercel Dashboard você pode:

- Ver logs de build
- Monitorar performance
- Verificar analytics
- Gerenciar domínios customizados

## 🔐 Segurança

### Variáveis Sensíveis

⚠️ **NUNCA** commite `.env` ou variáveis sensíveis no GitHub.

As variáveis de ambiente do Vercel são:
- Criptografadas
- Não aparecem em logs públicos
- Injetadas apenas no build

### Proteger o Painel Admin

Para produção, implemente autenticação:

```typescript
// Adicionar proteção à rota /admin-panel
import { useAuth } from "@/_core/hooks/useAuth";

function AdminRoute() {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;
  if (!user?.role === 'admin') return <NotFound />;
  
  return <AdminDashboard />;
}
```

## 🌐 Domínio Customizado

1. No Vercel Dashboard → **Settings** → **Domains**
2. Adicione seu domínio
3. Configure os registros DNS conforme instruído
4. Aguarde a propagação (pode levar até 48h)

## 📱 Rollback

Se algo der errado:

1. No Vercel Dashboard → **Deployments**
2. Encontre a versão anterior
3. Clique em **Promote to Production**

## 🐛 Troubleshooting

### Erro: "Build failed"
- Verifique os logs de build
- Certifique-se que `pnpm install` funciona localmente
- Verifique se todas as dependências estão no `package.json`

### Erro: "Variáveis de ambiente não encontradas"
- Verifique se as variáveis estão configuradas no Vercel
- Reinicie o deployment
- Verifique os nomes das variáveis (case-sensitive)

### Painel admin não funciona
- Verifique se Supabase está acessível
- Teste as credenciais do Supabase
- Verifique os logs no console do navegador

### Imagens não carregam
- Verifique se o bucket `products` existe no Supabase
- Verifique as políticas de acesso ao storage
- Teste o upload de imagem no painel admin

## 📞 Suporte

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)
- [Supabase Docs](https://supabase.com/docs)

## ✅ Checklist Final

- [ ] Repositório GitHub criado e atualizado
- [ ] Vercel conectado ao GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Build bem-sucedido
- [ ] Site acessível em produção
- [ ] Painel admin funcional
- [ ] Supabase conectado e funcionando
- [ ] Domínio customizado configurado (opcional)
- [ ] SSL/TLS ativado (automático no Vercel)
- [ ] Backups do Supabase configurados
