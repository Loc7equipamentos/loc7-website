# LOC7 Equipamentos - Site + Painel Admin

Plataforma completa de locação de equipamentos audiovisuais com site público e painel administrativo integrado.

## 🎯 Características

### Site Público
- ✅ Homepage com hero section
- ✅ Catálogo de equipamentos com filtros
- ✅ Busca por categoria, marca e preço
- ✅ Página de detalhes do produto
- ✅ Carrinho de orçamento
- ✅ Integração WhatsApp
- ✅ Formulário de contato
- ✅ Blog e portfolio
- ✅ Responsivo (mobile, tablet, desktop)

### Painel Admin
- ✅ Dashboard com estatísticas
- ✅ CRUD completo de produtos
- ✅ Gerenciamento de categorias
- ✅ Upload de imagens (Supabase Storage)
- ✅ Edição em tempo real
- ✅ Interface intuitiva e limpa

### Integração
- ✅ Supabase para banco de dados
- ✅ Realtime updates no site
- ✅ Autenticação pronta para expansão
- ✅ Storage de imagens escalável

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+ ou 20+
- pnpm (recomendado) ou npm
- Conta Supabase

### Instalação Local

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/loc7-website.git
cd loc7-website

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase

# Iniciar servidor de desenvolvimento
pnpm run dev
```

### Acessar Aplicação

- **Site**: http://localhost:5173
- **Painel Admin**: http://localhost:5173/admin-panel

## 📁 Estrutura do Projeto

```
loc7-website/
├── client/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── admin.html (legado)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── WhatsAppFloat.tsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Catalogo.tsx
│   │   │   ├── AdminDashboard.tsx (novo)
│   │   │   ├── AdminPanel.tsx (legado)
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── supabase.ts (cliente Supabase)
│   │   ├── contexts/
│   │   │   ├── CartContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── App.tsx (rotas)
│   │   └── main.tsx
│   └── index.html
├── SUPABASE_SETUP.sql (script de setup)
├── ADMIN_SETUP.md (guia do painel)
├── DEPLOYMENT.md (deploy Vercel)
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## 🔧 Configuração Supabase

### 1. Criar Projeto Supabase

1. Acesse [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie a URL e chave anônima

### 2. Executar Script SQL

1. No Supabase Console, vá para **SQL Editor**
2. Cole o conteúdo de `SUPABASE_SETUP.sql`
3. Execute o script

Isso criará:
- Tabela `categories`
- Tabela `products`
- Bucket `products` para storage
- Políticas de acesso

### 3. Configurar Variáveis de Ambiente

Crie `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 📊 Usando o Painel Admin

### Acessar
```
http://seu-dominio.com/admin-panel
```

### Funcionalidades

#### Dashboard
- Visualizar total de produtos
- Visualizar total de categorias
- Ver valor total em estoque

#### Produtos
- **Adicionar**: Preencha o formulário e clique "Adicionar Produto"
- **Editar**: Clique no ícone de lápis na tabela
- **Deletar**: Clique no ícone de lixeira (com confirmação)
- **Upload de Imagem**: Arraste ou clique para fazer upload

#### Categorias
- **Adicionar**: Digite o nome e clique "Adicionar"
- **Deletar**: Clique no ícone de lixeira no card

## 🎨 Customização

### Cores e Tema

Edite `client/src/index.css`:

```css
@theme {
  --color-primary: oklch(0.45 0.25 25);
  --color-background: oklch(0.08 0 0);
  --color-text: oklch(0.9 0 0);
}
```

### Fontes

Edite `client/index.html` para adicionar Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap" rel="stylesheet">
```

### Componentes

Todos os componentes usam Tailwind CSS e podem ser customizados em `client/src/components/`.

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

Ou conecte seu repositório GitHub ao Vercel Dashboard.

Veja `DEPLOYMENT.md` para instruções detalhadas.

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Node.js/Vite:
- Netlify
- Railway
- Render
- AWS Amplify

## 📱 Responsividade

O site é totalmente responsivo:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

Teste em diferentes tamanhos de tela usando DevTools.

## 🔐 Segurança

### Painel Admin

⚠️ **IMPORTANTE**: O painel admin está atualmente público. Para produção:

1. Implemente autenticação (Manus OAuth ou Supabase Auth)
2. Configure Row Level Security (RLS) no Supabase
3. Proteja a rota `/admin-panel` com middleware

Veja `ADMIN_SETUP.md` para exemplo de proteção.

### Variáveis de Ambiente

- Nunca commite `.env` no GitHub
- Use `.env.local` para desenvolvimento
- Configure variáveis no Vercel Dashboard para produção

## 🧪 Testes

```bash
# Testar build
pnpm run build

# Preview do build
pnpm run preview

# Verificar tipos TypeScript
pnpm run check
```

## 📚 Documentação

- `ADMIN_SETUP.md` - Guia completo do painel admin
- `DEPLOYMENT.md` - Instruções de deploy
- `SUPABASE_SETUP.sql` - Script de configuração do banco

## 🐛 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"
```bash
# Verifique se .env.local existe
ls -la .env.local

# Reinicie o servidor
pnpm run dev
```

### Erro: "Não consegue conectar ao Supabase"
- Verifique a URL e chave no `.env.local`
- Teste a conexão no Supabase Console
- Verifique se o projeto Supabase está ativo

### Produtos não aparecem no site
- Verifique se existem produtos no Supabase
- Recarregue a página
- Verifique os logs do navegador (F12)

## 📞 Suporte

- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Docs](https://react.dev)

## 📄 Licença

Projeto privado - Loc 7 Equipamentos

## 👤 Autor

Desenvolvido para Loc 7 Equipamentos

---

**Versão**: 1.0.0  
**Última atualização**: Abril 2026
