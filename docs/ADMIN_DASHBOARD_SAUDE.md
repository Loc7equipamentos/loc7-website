# ADMIN DASHBOARD — PLANO DE SAÚDE ESTRUTURAL

## Objetivo

Tornar o AdminDashboard saudável, escalável e documentado sem quebrar funcionalidades existentes.

O objetivo NÃO é reescrever o painel.

O objetivo NÃO é trocar arquitetura.

O objetivo NÃO é reduzir drasticamente o tamanho do arquivo.

O objetivo é extrair responsabilidades gradualmente, validar cada etapa e reduzir risco operacional.

---

# Estado Atual

Arquivo principal:

client/src/pages/AdminDashboard.tsx

Status:

- Funcional
- Em produção
- Validado
- Arquivo crítico do projeto

Tamanho aproximado:

- ~4742 linhas

Responsabilidades atuais:

- Produtos
- Categorias
- Marcas
- Subcategorias
- Arquitetura de filtros
- SEO
- Uploads
- Fiscal
- Cadastros
- Usuários administrativos
- Mounts
- Destaques

Diagnóstico:

O arquivo não está quebrado.

O problema atual é concentração excessiva de responsabilidades.

---

# Regras Congeladas

NUNCA:

- Reescrever AdminDashboard do zero
- Trocar arquitetura
- Substituir por versão resumida
- Aceitar arquivos com placeholders
- Aceitar arquivos incompletos

Toda alteração deve:

- Ser cirúrgica
- Ser validada por deploy Vercel
- Preservar funcionamento existente
- Ser feita em pequenas etapas

---

# Extrações Concluídas

## Fase 1

Arquivo criado:

client/src/lib/admin/product-utils.ts

Funções extraídas:

- normalizeFilterName
- buildProductName
- stripBrandFromName
- getDisplayNamePrefix
- buildProductDisplayName
- isLensCategory
- normalizeLensMountLabel

Status:

✅ Concluído
✅ Validado

---

# Próximas Extrações Planejadas

Ordem sugerida:

## Fase 2

SEO Helpers

Objetivo:

Mover funções puras relacionadas a:

- seo_tags
- normalização SEO
- geração de textos SEO

Sem alterar comportamento.

---

## Fase 3

Fiscal Helpers

Objetivo:

Mover funções puras relacionadas a:

- NCM
- classificação fiscal
- sugestões fiscais

Sem alterar comportamento.

---

## Fase 4

Upload Helpers

Objetivo:

Centralizar lógica de:

- imagens
- uploads
- manipulação de arquivos

Sem alterar comportamento.

---

## Fase 5

Filter Helpers

Objetivo:

Centralizar lógica de:

- grupos
- opções
- relacionamentos
- arquitetura

Sem alterar comportamento.

---

# Auditorias Pendentes

## Auditoria 01

Filtro Visível x Ordem Oficial

Problema identificado:

O dropdown "Filtro Visível" no AdminDashboard utiliza ordem alfabética.

O catálogo utiliza display_order.

Resultado:

Inconsistência entre painel administrativo e catálogo.

Status:

Pendente.

---

## Auditoria 02

Mounts Estruturais

Objetivo:

Definir papel do mount no catálogo.

Casos identificados:

### Grupo A

Mount define SKU

Exemplos:

- Blackmagic PYXIS PL
- Blackmagic PYXIS EF
- Blackmagic PYXIS L

### Grupo B

Mount não define SKU

Exemplos:

- Canon C300 MKII
- URSA Broadcast G2
- DZO Arles

Questões futuras:

- SEO
- Busca
- Navegação
- URLs
- Cards

Status:

Somente documentar.

Não implementar mudanças neste momento.

---

# Critério de Aprovação

Uma extração só é considerada concluída quando:

1. Código gerado
2. Commit realizado
3. Deploy Vercel concluído
4. Validação manual concluída
5. Registro atualizado neste documento

---

# Objetivo Final

Chegar a um AdminDashboard:

- saudável
- documentado
- auditável
- escalável

Sem reescrita.

Sem perda de funcionalidades.

Sem retrabalho.

# Atualização Junho/2026

(conteúdo que te enviei)

# ADMIN DASHBOARD — SAÚDE ESTRUTURAL

## Objetivo

Reduzir responsabilidades do arquivo:

```text
client/src/pages/AdminDashboard.tsx
```

sem alterar comportamento, sem refatoração agressiva e sem risco operacional.

---

# Regras da Fase de Saúde

* Não reescrever o AdminDashboard.
* Não trocar arquitetura.
* Não alterar fluxo de negócio.
* Não alterar Supabase.
* Não alterar catálogo.
* Não alterar filtros validados.
* Não alterar mounts.
* Não alterar SEO validado.
* Uma extração por vez.
* Um arquivo por vez.
* Um commit por vez.
* Uma validação Vercel por vez.

---

# Estado Inicial

AdminDashboard:

```text
~4742 linhas
```

Responsabilidades acumuladas:

* Produtos
* SEO
* Fiscal
* Filtros
* Categorias
* Subcategorias
* Marcas
* Uploads
* Destaques
* Relacionamentos produto/filtro

Diagnóstico:

Arquivo funcional.

Não estava quebrado.

Problema principal era acúmulo de responsabilidades.

---

# Extrações Concluídas

## Fase 1 — Product Utils

Arquivo criado:

```text
client/src/lib/admin/product-utils.ts
```

Funções extraídas:

* normalizeFilterName
* buildProductName
* stripBrandFromName
* getDisplayNamePrefix
* buildProductDisplayName
* isLensCategory
* normalizeLensMountLabel

Status:

✅ Validado
✅ Deploy validado

---

## Fase 2 — SEO Utils

Arquivo criado:

```text
client/src/lib/admin/seo-utils.ts
```

Responsabilidades movidas:

* normalização SEO
* geração SEO automática
* tags semânticas
* prompts ChatGPT
* helpers de SEO

Status:

✅ Validado
✅ Deploy validado

---

## Fase 3 — Fiscal Utils

Arquivo criado:

```text
client/src/lib/admin/fiscal-utils.ts
```

Responsabilidades movidas:

* ProductFiscalProfile
* NCM
* pesquisa fiscal
* sugestões NCM
* persistência fiscal
* normalização fiscal

Status:

✅ Validado
✅ Deploy validado

---

## Fase 4 — Filter Utils

Arquivo criado:

```text
client/src/lib/admin/filter-utils.ts
```

Responsabilidades movidas:

* sortFilterOptionsByDisplayOrder
* moveFilterGroupOrder
* moveFilterOptionOrder

Status:

✅ Validado
✅ Deploy validado

---

# Estado Atual

Arquivos auxiliares existentes:

```text
client/src/lib/admin/product-utils.ts
client/src/lib/admin/seo-utils.ts
client/src/lib/admin/fiscal-utils.ts
client/src/lib/admin/filter-utils.ts
```

Todos integrados ao:

```text
client/src/pages/AdminDashboard.tsx
```

Todos validados em produção.

---

# Decisão Estratégica Importante

Não continuar extrações em sequência sem auditoria.

Após quatro extrações consecutivas:

```text
product-utils
seo-utils
fiscal-utils
filter-utils
```

o projeto entra em fase de estabilização.

Objetivo:

* revisar comportamento
* validar painel
* validar catálogo
* validar filtros
* validar SEO
* validar mounts

antes de novas remoções.

---

# Pendências Futuras (não iniciadas)

Possíveis extrações futuras:

1. upload-utils
2. category-utils
3. brand-utils
4. filter-architecture-utils

Status:

🚫 NÃO INICIADAS

Nenhuma autorizada até nova auditoria.

---

# Situação Atual do Projeto

AdminDashboard saudável.

Sem regressões conhecidas.

SEO preservado.

Fiscal preservado.

Arquitetura de filtros preservada.

Estratégia de múltiplos mounts preservada.

Projeto apto para continuar evolução sem retrabalho.

Data da atualização:

Junho/2026

