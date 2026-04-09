# 🚀 Deploy no Vercel + GitHub

## Passo 1: Preparar o GitHub

### 1.1 Criar repositório no GitHub
```bash
# Acesse https://github.com/new e crie um novo repositório
# Nome sugerido: loc7-website
# Descrição: Locadora de Equipamentos Audiovisuais
```

### 1.2 Fazer push do projeto para GitHub
```bash
cd loc7-website
git init
git add .
git commit -m "Initial commit: Loc7 website com Vite + React"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/loc7-website.git
git push -u origin main
```

---

## Passo 2: Deploy no Vercel

### 2.1 Conectar Vercel ao GitHub
1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Conecte sua conta GitHub
5. Selecione o repositório `loc7-website`

### 2.2 Configurar Build Settings
- **Framework Preset:** Vite
- **Build Command:** `pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

### 2.3 Variáveis de Ambiente (se necessário)
Se o projeto usa variáveis de ambiente, adicione em "Environment Variables":
- `VITE_APP_TITLE` (opcional)
- Outras variáveis conforme necessário

### 2.4 Deploy
Clique em "Deploy" e aguarde o build completar.

---

## Passo 3: Verificar Deploy

Após o deploy:
1. Acesse a URL fornecida pelo Vercel (ex: `https://loc7-website.vercel.app`)
2. Verifique se todas as páginas carregam corretamente
3. Teste funcionalidades principais:
   - Navegação entre páginas
   - Catálogo de produtos
   - Carrinho de orçamento
   - Formulário de cadastro
   - Links WhatsApp

---

## Passo 4: Domínio Customizado (Opcional)

### 4.1 Adicionar domínio no Vercel
1. No dashboard do Vercel, vá para "Settings" → "Domains"
2. Clique em "Add Domain"
3. Digite seu domínio (ex: `loc7.com.br`)

### 4.2 Configurar DNS
Siga as instruções do Vercel para apontar seu domínio para o Vercel.

---

## Troubleshooting

### Build falha com erro de módulos
**Solução:** Limpe o cache e reinstale
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Página em branco após deploy
**Solução:** Verifique se o `vite.config.ts` está correto
```bash
cat vite.config.ts
```

### Formspree não funciona
**Solução:** Verifique se o endpoint está correto em `Cadastro.tsx`:
```typescript
const response = await fetch("https://formspree.io/f/mreojwrr", {
  method: "POST",
  body: formData,
})
```

---

## Estrutura do Projeto

```
loc7-website/
├── client/                 # Frontend React + Vite
│   ├── src/
│   │   ├── pages/         # Páginas (Home, Cadastro, etc.)
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── contexts/      # React Contexts (Cart, Theme)
│   │   ├── data/          # Dados estáticos (produtos, etc.)
│   │   └── index.css      # Estilos globais
│   └── index.html         # HTML principal
├── package.json           # Dependências
├── vite.config.ts         # Configuração Vite
├── vercel.json            # Configuração Vercel
└── tsconfig.json          # Configuração TypeScript
```

---

## Comandos Úteis

```bash
# Desenvolvimento local
pnpm run dev

# Build para produção
pnpm run build

# Preview do build
pnpm run preview

# Verificar tipos TypeScript
pnpm run check

# Formatar código
pnpm run format
```

---

## Suporte

Se encontrar problemas:
1. Verifique os logs do Vercel (Dashboard → Deployments)
2. Verifique o console do navegador (F12)
3. Consulte a documentação do Vite: https://vitejs.dev

---

**Pronto para deploy!** 🎉
