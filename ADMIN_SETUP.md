# Painel Admin - LOC7 Equipamentos

## 🚀 Acesso ao Painel

O painel admin está disponível em:
```
https://seu-dominio.com/admin-panel
```

## 📋 Funcionalidades

✅ **Dashboard** - Visualizar estatísticas gerais
✅ **Produtos** - Criar, editar e deletar equipamentos
✅ **Categorias** - Gerenciar categorias de produtos
✅ **Upload de Imagens** - Fazer upload direto para Supabase Storage

## 🔧 Setup Inicial

### 1. Configurar Supabase

1. Acesse [Supabase Console](https://app.supabase.com)
2. Crie um novo projeto ou use o existente
3. Vá para **SQL Editor**
4. Cole o conteúdo de `SUPABASE_SETUP.sql`
5. Execute o script

### 2. Configurar Storage

1. No Supabase, vá para **Storage**
2. Crie um bucket chamado `products`
3. Defina como **Public**
4. Configure as políticas de acesso

### 3. Variáveis de Ambiente

Adicione ao `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 📊 Estrutura de Dados

### Tabela: categories
```sql
- id (UUID)
- name (VARCHAR)
- icon (VARCHAR) - opcional
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabela: products
```sql
- id (UUID)
- name (VARCHAR)
- category (VARCHAR) - referencia categories.name
- price (DECIMAL)
- description (TEXT)
- image_url (VARCHAR)
- badge (VARCHAR) - ex: FULLFRAME, LED, etc
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🎯 Como Usar

### Adicionar Produto

1. Vá para **Produtos**
2. Preencha o formulário:
   - Nome
   - Categoria
   - Preço
   - Badge (opcional)
   - Descrição
   - Imagem (upload automático)
3. Clique em **Adicionar Produto**

### Editar Produto

1. Na tabela de produtos, clique no ícone **Editar** (lápis azul)
2. Modifique os campos desejados
3. Clique em **Salvar Alterações**

### Deletar Produto

1. Na tabela de produtos, clique no ícone **Deletar** (lixeira vermelha)
2. Confirme a exclusão

### Adicionar Categoria

1. Vá para **Categorias**
2. Digite o nome da categoria
3. Clique em **Adicionar**

## 🔐 Segurança

⚠️ **IMPORTANTE**: O painel admin atualmente está **público**. Para produção, você deve:

1. Implementar autenticação (Manus OAuth ou Supabase Auth)
2. Criar políticas RLS (Row Level Security) no Supabase
3. Proteger a rota `/admin-panel` com middleware de autenticação

### Exemplo de Proteção:

```typescript
// Adicionar ao App.tsx
import { useAuth } from "@/_core/hooks/useAuth";

function ProtectedAdminRoute() {
  const { user, loading } = useAuth();
  
  if (loading) return <Loader />;
  if (!user || user.role !== 'admin') return <NotFound />;
  
  return <AdminDashboard />;
}
```

## 🚀 Deploy no Vercel

1. Push o código para GitHub
2. Conecte o repositório ao Vercel
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático

## 📱 Responsividade

O painel é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🎨 Tema

O painel usa tema claro com cores:
- Primária: Azul (#2563EB)
- Secundária: Cinza
- Destaque: Vermelho para ações destrutivas

## 💡 Dicas

- As imagens são automaticamente redimensionadas no upload
- Os produtos aparecem no site em tempo real (via Supabase Realtime)
- Use badges para destacar características (ex: FULLFRAME, LED, etc)
- Categorias aparecem automaticamente no dropdown de produtos

## 🐛 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"
- Verifique se `.env.local` tem as variáveis corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Não consegue fazer upload de imagem"
- Verifique se o bucket `products` existe no Supabase
- Verifique as políticas de acesso ao storage

### Produtos não aparecem no site
- Verifique se o Supabase Realtime está ativado
- Recarregue a página do catálogo

## 📞 Suporte

Para problemas com Supabase, consulte:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
