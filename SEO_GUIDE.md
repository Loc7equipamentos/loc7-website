# Guia SEO e Integrações — Loc 7 Equipamentos

## 📊 SEO Técnico Implementado

### ✅ Estrutura Base
- **Meta Tags:** Title, description, keywords otimizados
- **Robots.txt:** Configurado para permitir indexação
- **Sitemap.xml:** Mapa do site para Google
- **Canonical URL:** Implementado
- **Open Graph:** Tags para redes sociais
- **Schema.org:** LocalBusiness estruturado

### ✅ Dados Estruturados (Schema Markup)
```json
{
  "@type": "LocalBusiness",
  "name": "Loc 7 Equipamentos",
  "telephone": "+55-11-99723-7850",
  "email": "loc7@loc7equipamentos.com.br",
  "address": {
    "streetAddress": "Av. Imperatriz Leopoldina, 957, Sala 1611",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "postalCode": "05305-011",
    "addressCountry": "BR"
  },
  "openingHours": "Mo-Fr 08:00-18:00, Sa 09:00-12:00"
}
```

---

## 🔗 Próximas Integrações Recomendadas

### 1. Google Analytics 4
**Objetivo:** Monitorar tráfego, comportamento de usuários, conversões

**Passos:**
1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie uma propriedade para seu site
3. Copie o ID de medição (G-XXXXXXXXXX)
4. O site já está configurado para receber dados (via VITE_ANALYTICS_WEBSITE_ID)

**Métricas importantes:**
- Visitantes únicos
- Tempo de sessão
- Taxa de rejeição
- Conversões (cliques em WhatsApp, formulários)

---

### 2. Google Search Console
**Objetivo:** Monitorar indexação, palavras-chave, erros de rastreamento

**Passos:**
1. Acesse [Google Search Console](https://search.google.com/search-console)
2. Adicione seu domínio (dev.loc7.com.br)
3. Verifique propriedade via DNS ou arquivo HTML
4. Envie o sitemap.xml manualmente
5. Monitore relatórios de:
   - Cobertura (páginas indexadas)
   - Desempenho (palavras-chave, CTR, posição média)
   - Erros de rastreamento

**Palavras-chave alvo:**
- locadora audiovisual são paulo
- aluguel câmera profissional
- aluguel lentes cinema
- equipamentos filmagem sp
- locação iluminação cinema

---

### 3. Google My Business
**Objetivo:** Aparecer no Google Maps e resultados locais

**Passos:**
1. Acesse [Google My Business](https://www.google.com/business/)
2. Crie/reclame seu negócio
3. Adicione informações:
   - Nome: Loc 7 Equipamentos
   - Endereço: Av. Imperatriz Leopoldina, 957, Sala 1611, São Paulo, SP 05305-011
   - Telefone: 11 99723-7850
   - Horários: Seg-Sex 08h-18h | Sab 09h-12h
   - Categoria: Locadora de Equipamentos Audiovisuais
4. Adicione fotos de equipamentos
5. Responda perguntas de clientes
6. Colete avaliações

**Impacto:** Aumenta visibilidade local e confiança

---

### 4. Meta Pixel (Facebook/Instagram)
**Objetivo:** Rastrear conversões e fazer remarketing

**Passos:**
1. Acesse [Meta Pixel](https://www.facebook.com/pixels/)
2. Crie um pixel
3. Copie o código do pixel
4. Implemente no site (já preparado para receber)
5. Configure eventos:
   - ViewContent (visualização de produto)
   - AddToCart (adição ao carrinho)
   - Purchase (conversão)
   - Contact (envio de formulário)

**Benefícios:**
- Remarketing em Facebook/Instagram
- Otimização de campanhas
- Análise de ROI

---

### 5. Google Analytics 4 + Conversões
**Configurar eventos de conversão:**

```javascript
// Clique em WhatsApp
gtag('event', 'contact', {
  'event_category': 'engagement',
  'event_label': 'whatsapp_click'
});

// Visualização de produto
gtag('event', 'view_item', {
  'event_category': 'ecommerce',
  'items': [{
    'item_id': 'camera_001',
    'item_name': 'Sony FX9',
    'price': 600
  }]
});
```

---

## 📝 Otimização de Conteúdo

### Headlines Otimizadas
- ✅ H1: "Equipamentos de Cinema Profissionais para Locação em São Paulo"
- ✅ H2: "Câmeras, Lentes e Iluminação de Qualidade"
- ✅ Incluir palavras-chave naturalmente

### Alt Text em Imagens
```html
<img src="camera.jpg" alt="Sony FX9 4K - Câmera profissional para aluguel em São Paulo" />
```

### URLs Amigáveis
- ✅ `/catalogo/cameras` (em vez de `/cat?id=1`)
- ✅ `/catalogo/lentes` (em vez de `/prod?type=2`)

### Velocidade de Página
- Imagens otimizadas (CDN)
- Lazy loading
- Minificação de CSS/JS
- Cache do navegador

---

## 🎯 Estratégia de Palavras-Chave

### Palavras-chave Primárias
1. **Locadora audiovisual São Paulo**
2. **Aluguel câmera profissional**
3. **Equipamentos filmagem SP**
4. **Locação lentes cinema**
5. **Iluminação cinema aluguel**

### Palavras-chave Secundárias
- Aluguel RED Komodo
- Aluguel Sony FX9
- Aluguel Aputure
- Câmera 4K aluguel
- Equipamentos audiovisuais profissionais

### Estratégia de Conteúdo
1. **Blog posts** sobre equipamentos
2. **Guias** de escolha de câmeras
3. **Case studies** de clientes
4. **FAQ** sobre locação
5. **Comparações** de equipamentos

---

## 📈 Checklist de SEO

- [x] Meta tags otimizadas
- [x] Schema.org LocalBusiness
- [x] Robots.txt
- [x] Sitemap.xml
- [x] Open Graph
- [x] Canonical URLs
- [ ] Google Analytics 4 integrado
- [ ] Google Search Console conectado
- [ ] Google My Business verificado
- [ ] Meta Pixel implementado
- [ ] Conteúdo otimizado com palavras-chave
- [ ] Backlinks de qualidade
- [ ] Avaliações/Reviews
- [ ] Mobile-first indexing verificado
- [ ] Velocidade de página otimizada

---

## 🚀 Próximas Ações

1. **Semana 1:** Integrar Google Analytics e Search Console
2. **Semana 2:** Criar Google My Business e coletar reviews
3. **Semana 3:** Implementar Meta Pixel
4. **Semana 4:** Criar conteúdo otimizado (blog posts, guias)
5. **Mês 2:** Monitorar rankings e ajustar estratégia

---

## 📞 Suporte

Para dúvidas sobre SEO ou integrações, consulte:
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Meta for Developers](https://developers.facebook.com/)
