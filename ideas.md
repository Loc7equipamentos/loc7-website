# Ideias de Design — Loc 7 Equipamentos

## Contexto
Site para locadora de equipamentos audiovisuais em São Paulo. Referência visual: filmhouse.com.br — dark theme, estética industrial/cinema, tipografia bold, contraste alto com acentos vermelhos.

---

<response>
<text>
## Ideia 1: "Cinema Noir Industrial"

**Design Movement:** Neo-Brutalism encontra Cinema Noir

**Core Principles:**
1. Contraste absoluto: preto profundo como base, branco puro para texto, vermelho sangue como único acento
2. Tipografia como elemento visual dominante — letras grandes, condensadas, com peso máximo
3. Assimetria intencional: layouts que quebram a grade, criando tensão visual cinematográfica
4. Textura sobre superfície: grain sutil, bordas irregulares, sombras pesadas

**Color Philosophy:**
- Background: #0A0A0A (preto profundo, quase carbono)
- Foreground: #F5F5F5 (branco suave, não puro)
- Accent: #E31010 (vermelho cinema, vibrante)
- Secondary: #1A1A1A (preto suave para cards)
- Muted: #888888 (cinza para textos secundários)
Intenção emocional: urgência, profissionalismo, poder. A paleta evoca a sala de projeção, o set de filmagem às 3h da manhã.

**Layout Paradigm:**
- Hero em tela cheia com texto em diagonal ou inclinado
- Grid de produtos assimétrico: cards de tamanhos variados
- Seções com bordas cortadas (clip-path diagonal)
- Navegação horizontal com linha vermelha de destaque

**Signature Elements:**
1. Número de série: cada produto tem um código estilo "LOC7-001" em fonte monospace
2. Linha vermelha divisória: fina linha horizontal vermelha separa seções
3. Badges de categoria com fundo vermelho sólido, texto branco uppercase

**Interaction Philosophy:**
Hover revela informações ocultas com transição de deslizamento. Clique produz feedback visual imediato com flash vermelho sutil.

**Animation:**
- Entrada de elementos: fade-in + translate-y de baixo para cima (300ms ease-out)
- Hover em cards: scale(1.02) + sombra vermelha sutil
- Transição de página: fade rápido (200ms)
- Carrossel: deslizamento horizontal com momentum

**Typography System:**
- Display: Oswald (condensed, bold) — títulos de seção e hero
- Body: DM Sans (clean, modern) — textos e descrições
- Mono: JetBrains Mono — preços e códigos de produto
- Hierarquia: 72px hero / 48px seção / 24px card / 16px body / 12px label
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Ideia 2: "Precision Engineering"

**Design Movement:** Swiss International Style meets High-Tech Industrial

**Core Principles:**
1. Grid matemático rigoroso: tudo alinhado a uma grade de 8px
2. Tipografia como arquitetura: fontes geométricas, espaçamento preciso
3. Minimalismo funcional: cada elemento tem propósito, nada é decorativo
4. Contraste de escala: elementos minúsculos ao lado de elementos gigantes

**Color Philosophy:**
- Background: #080808 (preto absoluto)
- Foreground: #FFFFFF
- Accent: #FF2D20 (vermelho técnico)
- Secondary: #141414
- Highlight: #FFD700 (amarelo âmbar — como o LED de câmera gravando)
Intenção: precisão técnica, confiabilidade, expertise profissional

**Layout Paradigm:**
- Sidebar de navegação vertical à esquerda (desktop)
- Conteúdo principal em 2/3 da tela
- Números de linha ao lado das seções (estilo código)
- Tabelas de especificações técnicas proeminentes

**Signature Elements:**
1. Indicador "REC" pulsante no header
2. Linhas de grade visíveis como elemento decorativo
3. Ícones técnicos em estilo wireframe

**Interaction Philosophy:**
Interface responde como equipamento profissional: precisa, sem animações desnecessárias, feedback imediato.

**Animation:**
- Transições rápidas (150ms) — profissional, sem floreios
- Hover: mudança de cor instantânea + underline deslizante
- Loading: barra de progresso estilo câmera gravando

**Typography System:**
- Display: Space Grotesk (geométrico, técnico)
- Body: IBM Plex Sans (legibilidade técnica)
- Mono: IBM Plex Mono — especificações e preços
</text>
<probability>0.06</probability>
</response>

<response>
<text>
## Ideia 3: "Dark Cinematic Luxury"

**Design Movement:** Luxury Editorial meets Dark Cinema

**Core Principles:**
1. Elegância sombria: preto como luxo, não como ausência de cor
2. Tipografia editorial: mix de serif e sans-serif para sofisticação
3. Espaço negativo generoso: o vazio é parte do design
4. Imagens como protagonistas: produtos em destaque máximo

**Color Philosophy:**
- Background: #0D0D0D
- Foreground: #EFEFEF
- Accent: #C8102E (vermelho borgonha — mais sofisticado que vermelho puro)
- Gold: #C9A84C (dourado para elementos premium)
- Secondary: #1C1C1C
Intenção: premium, aspiracional, confiança de marca estabelecida

**Layout Paradigm:**
- Hero com texto centralizado e imagem em parallax
- Seções alternando fundo preto e cinza escuro
- Cards com bordas douradas em produtos premium
- Footer elegante com logo grande

**Signature Elements:**
1. Linha dourada fina em elementos premium
2. Tipografia serif em citações e depoimentos
3. Overlay de gradiente nas imagens de produtos

**Interaction Philosophy:**
Experiência premium: transições suaves, animações elegantes, feedback sutil.

**Animation:**
- Entrada: fade-in suave (500ms ease-in-out)
- Parallax no hero
- Hover em cards: borda dourada aparece gradualmente
- Scroll reveal para seções

**Typography System:**
- Display: Playfair Display (serif elegante) — hero e títulos principais
- Body: Lato (clean, legível) — textos gerais
- Accent: Cormorant Garamond — citações e destaques
</text>
<probability>0.07</probability>
</response>

---

## Decisão Final: Ideia 1 — "Cinema Noir Industrial"

Esta abordagem é a mais fiel ao site de referência (filmhouse.com.br) e ao contexto da marca. O estilo Neo-Brutalism com Cinema Noir captura a essência de uma locadora audiovisual profissional: dark, bold, direto ao ponto. A tipografia condensada e os acentos vermelhos criam identidade visual forte e memorável.

**Fontes escolhidas:** Oswald (display) + DM Sans (body) + JetBrains Mono (preços)
**Paleta:** #0A0A0A / #F5F5F5 / #E31010 / #1A1A1A / #888888
