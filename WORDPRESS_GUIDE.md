# Loc 7 Equipamentos — Guia de Implementação WordPress

## Visão Geral

Este documento descreve como implementar o site da Loc 7 Equipamentos em WordPress, replicando o design e funcionalidades desenvolvidas no protótipo React/Tailwind.

---

## Stack Recomendada para WordPress

| Componente | Solução Recomendada |
|---|---|
| Theme Base | GeneratePress Pro ou Blocksy Pro |
| Page Builder | Elementor Pro ou Bricks Builder |
| WooCommerce | Para catálogo de produtos |
| SEO | Yoast SEO Premium ou RankMath Pro |
| Cache | WP Rocket |
| CDN | Cloudflare |
| Formulários | WPForms Pro ou Gravity Forms |
| CRM | HubSpot for WordPress ou Bitrix24 |

---

## Integrações Essenciais

### 1. Google Analytics 4
```html
<!-- Adicionar no <head> via functions.php ou plugin -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```
**Plugin recomendado:** Site Kit by Google (instala GA4, Search Console e Maps automaticamente)

### 2. Google Search Console
- Verificar propriedade via Site Kit ou meta tag
- Submeter sitemap: `https://loc7equipamentos.com.br/sitemap.xml`
- Configurar via Yoast SEO (gera sitemap automaticamente)

### 3. Google Maps
```php
// Adicionar no functions.php
function loc7_google_maps_script() {
    wp_enqueue_script(
        'google-maps',
        'https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_API&callback=initMap',
        [],
        null,
        true
    );
}
add_action('wp_enqueue_scripts', 'loc7_google_maps_script');
```

### 4. Meta Pixel (Facebook/Instagram)
```html
<!-- Adicionar no <head> -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'SEU_PIXEL_ID');
fbq('track', 'PageView');
</script>
```
**Plugin recomendado:** PixelYourSite Pro

### 5. WhatsApp API + Botão Flutuante
```php
// Plugin: WP Social Chat ou implementação manual
// Adicionar no footer via functions.php
function loc7_whatsapp_button() {
    echo '<a href="https://wa.me/5511999999999?text=Olá! Gostaria de solicitar um orçamento." 
         class="whatsapp-float" target="_blank" rel="noopener">
         <img src="' . get_template_directory_uri() . '/img/whatsapp-icon.svg" alt="WhatsApp">
         </a>';
}
add_action('wp_footer', 'loc7_whatsapp_button');
```
**Plugin recomendado:** WP Social Chat (gratuito) ou Chaty Pro

### 6. HubSpot CRM
- Instalar plugin oficial: **HubSpot — CRM, Email Marketing, Live Chat, Forms & Analytics**
- Conectar conta HubSpot
- Configurar formulários para sincronizar leads automaticamente
- Configurar pipeline de vendas para orçamentos

### 7. Chatbot com IA
**Opção 1 — Tidio (recomendado):**
- Instalar plugin Tidio Live Chat
- Configurar fluxos de chatbot com IA
- Integrar com HubSpot para captura de leads

**Opção 2 — Implementação própria com OpenAI:**
```php
// Endpoint customizado para chatbot
add_action('rest_api_init', function() {
    register_rest_route('loc7/v1', '/chat', [
        'methods' => 'POST',
        'callback' => 'loc7_chat_handler',
        'permission_callback' => '__return_true',
    ]);
});

function loc7_chat_handler($request) {
    $message = sanitize_text_field($request->get_param('message'));
    
    $response = wp_remote_post('https://api.openai.com/v1/chat/completions', [
        'headers' => [
            'Authorization' => 'Bearer ' . get_option('loc7_openai_key'),
            'Content-Type' => 'application/json',
        ],
        'body' => json_encode([
            'model' => 'gpt-4',
            'messages' => [
                ['role' => 'system', 'content' => 'Você é o assistente da Loc 7 Equipamentos, uma locadora audiovisual em São Paulo. Ajude clientes com recomendações de equipamentos e orçamentos.'],
                ['role' => 'user', 'content' => $message],
            ],
        ]),
    ]);
    
    return json_decode(wp_remote_retrieve_body($response), true);
}
```

### 8. YouTube/TikTok Embeds
- Usar shortcode nativo do WordPress para YouTube: `[embed]URL[/embed]`
- Para TikTok: Plugin **TikTok Embed** ou código manual
- Para feeds dinâmicos: **Smash Balloon YouTube Feed Pro**

### 9. LinkedIn Lead Generation
- Instalar **LinkedIn Insight Tag** via plugin ou manualmente
- Configurar formulários de geração de leads no LinkedIn Campaign Manager
- Sincronizar com HubSpot via Zapier ou integração nativa

---

## Estrutura de Páginas WordPress

```
Páginas:
├── Home (template: page-home.php)
├── Catálogo (WooCommerce Shop)
│   ├── Câmeras (categoria)
│   ├── Lentes (categoria)
│   ├── Iluminação (categoria)
│   ├── Áudio (categoria)
│   ├── Monitores (categoria)
│   ├── Movimento (categoria)
│   └── Wireless (categoria)
├── Blog (posts WordPress)
├── Portfólio (Custom Post Type)
├── Sobre
└── Contato
```

---

## Custom Post Types

### Portfólio
```php
function loc7_register_portfolio_cpt() {
    register_post_type('portfolio', [
        'labels' => ['name' => 'Portfólio', 'singular_name' => 'Case'],
        'public' => true,
        'has_archive' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'rewrite' => ['slug' => 'portfolio'],
    ]);
}
add_action('init', 'loc7_register_portfolio_cpt');
```

---

## WooCommerce para Catálogo

### Configuração de Produtos
- Tipo de produto: **Produto Simples** com campo personalizado "Preço por Dia"
- Atributos: Marca, Tipo de Mount, Categoria
- Variações: Por período (1 dia, 3 dias, 7 dias)
- Botão customizado: "Solicitar Orçamento WhatsApp" (substituir "Adicionar ao Carrinho")

### Customização do Botão WhatsApp
```php
// Substituir botão de compra por WhatsApp
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);
add_action('woocommerce_single_product_summary', 'loc7_whatsapp_quote_button', 30);

function loc7_whatsapp_quote_button() {
    global $product;
    $name = $product->get_name();
    $url = 'https://wa.me/5511999999999?text=' . urlencode("Olá! Tenho interesse em alugar: $name");
    echo '<a href="' . esc_url($url) . '" target="_blank" class="button loc7-whatsapp-btn">
          📱 Solicitar Orçamento WhatsApp
          </a>';
}
```

---

## Schema Markup para SEO

### Produto (WooCommerce)
```php
function loc7_product_schema() {
    if (!is_product()) return;
    global $product;
    
    $schema = [
        '@context' => 'https://schema.org',
        '@type' => 'Product',
        'name' => $product->get_name(),
        'description' => $product->get_description(),
        'image' => wp_get_attachment_url($product->get_image_id()),
        'offers' => [
            '@type' => 'Offer',
            'price' => $product->get_price(),
            'priceCurrency' => 'BRL',
            'availability' => 'https://schema.org/InStock',
            'seller' => [
                '@type' => 'Organization',
                'name' => 'Loc 7 Equipamentos',
            ],
        ],
    ];
    
    echo '<script type="application/ld+json">' . json_encode($schema) . '</script>';
}
add_action('wp_head', 'loc7_product_schema');
```

---

## Segurança e Performance

| Aspecto | Plugin/Solução |
|---|---|
| Segurança | Wordfence Security |
| Backup | UpdraftPlus |
| Cache | WP Rocket |
| Otimização de Imagens | Imagify ou ShortPixel |
| CDN | Cloudflare (gratuito) |
| SSL | Let's Encrypt (via hospedagem) |

---

## Hospedagem Recomendada

Para um site com WooCommerce e integrações pesadas, recomenda-se:

- **Kinsta** (melhor performance, mais caro)
- **WP Engine** (ótimo suporte WordPress)
- **Hostinger Business** (melhor custo-benefício no Brasil)
- **Locaweb** (opção nacional com suporte em PT-BR)

Requisitos mínimos:
- PHP 8.1+
- MySQL 8.0+
- 4GB RAM
- SSD Storage
- SSL gratuito

---

## Checklist de Lançamento

- [ ] Instalar WordPress e tema base
- [ ] Configurar WooCommerce com produtos
- [ ] Implementar todas as integrações (GA4, Meta Pixel, WhatsApp)
- [ ] Configurar HubSpot CRM
- [ ] Instalar e configurar chatbot
- [ ] Configurar SEO (Yoast/RankMath)
- [ ] Submeter sitemap ao Google Search Console
- [ ] Testar formulários e integrações
- [ ] Configurar backup automático
- [ ] Teste de velocidade (PageSpeed Insights > 80)
- [ ] Teste mobile responsivo
- [ ] Configurar domínio e SSL
- [ ] Lançamento e monitoramento

---

*Documento gerado para o projeto Loc 7 Equipamentos — Manus AI*
