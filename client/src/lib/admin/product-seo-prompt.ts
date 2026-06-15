import {
  buildProductName,
  stripBrandFromName,
  buildProductDisplayName,
} from '@/lib/admin/product-utils';
import {
  uniqueSeoLines,
  getSeoSourceText,
  buildSemanticSeoTagsFromText,
  getCategorySpecificSeoBrief,
} from '@/lib/admin/seo-utils';

export type ProductSeoPromptSource = {
  name?: string | null;
  brand?: string | null;
  category?: string | null;
  operational_type?: string | null;
  subcategory?: string | null;
  specs?: string | null;
  technical_specs?: string | null;
  model?: string | null;
};

export function buildAutomaticSeoTags({
  source,
  selectedFilters,
  publicSubcategory,
  lensMountSeoTags = [],
}: {
  source: ProductSeoPromptSource;
  selectedFilters: string[];
  publicSubcategory?: string | null;
  lensMountSeoTags?: string[];
}) {
  const name = source.name?.trim() || '';
  const brand = source.brand?.trim() || '';
  const model = source.model?.trim() || '';
  const category = source.category?.trim() || '';
  const operationalType = source.operational_type?.trim() || '';
  const productWithoutBrand = stripBrandFromName(name, brand);
  const productReference =
    name ||
    buildProductName(brand, model) ||
    [brand, productWithoutBrand].filter(Boolean).join(' ');

  const prefixedProduct = buildProductDisplayName(
    operationalType,
    category,
    productReference
  );

  const sourceForSeo = {
    ...source,
    subcategory: publicSubcategory || source.subcategory,
  };

  const sourceText = getSeoSourceText(sourceForSeo, selectedFilters);
  const semanticTags = buildSemanticSeoTagsFromText(sourceText, category);
  const primaryFilters = selectedFilters.slice(0, 4);

  return uniqueSeoLines([
    productReference,
    prefixedProduct,
    productReference ? `Locação ${productReference}` : '',
    productReference ? `Aluguel ${productReference}` : '',
    productReference && publicSubcategory ? `${productReference} ${publicSubcategory}` : '',
    ...lensMountSeoTags,
    ...semanticTags,
    productReference ? `${productReference} São Paulo` : '',
    productReference ? `${productReference} para produtoras` : '',
    ...primaryFilters.map((filter) =>
      productReference ? `${productReference} ${filter}` : filter
    ),
    operationalType && brand ? `${operationalType} ${brand}` : '',
    category && brand ? `${category} ${brand}` : '',
  ]).slice(0, 12);
}

export function buildChatGptSeoPrompt({
  source,
  selectedFilters,
  automaticTags,
}: {
  source: ProductSeoPromptSource;
  selectedFilters: string[];
  automaticTags: string[];
}) {
  const categoryBrief = getCategorySpecificSeoBrief(source.category);

  return `Você é especialista em SEO para locação de equipamentos audiovisuais profissionais no Brasil, com foco em intenção real de busca no Google e comportamento de clientes profissionais do mercado audiovisual.

Gere até 8 tags/frases SEO curtas para o produto abaixo.

O objetivo NÃO é repetir nome, marca, modelo, categoria, tipo operacional, filtros ou ficha técnica.
O objetivo é sugerir buscas complementares que uma pessoa real faria para encontrar esse tipo de equipamento para locação.

Use a categoria do produto como regra principal de comportamento de busca. Não use um raciocínio genérico.

${categoryBrief}

Regras obrigatórias:
- Gere somente tags complementares às tags automáticas já geradas.
- Não repita marca, modelo, categoria, tipo operacional ou especificações já informadas.
- Não repita nenhuma das tags automáticas já geradas.
- Não invente características técnicas.
- Não use frases genéricas demais, como equipamento profissional ou audiovisual profissional isoladamente.
- Não use frases longas.
- Priorize frases com intenção de compra/locação, aplicação prática, tipo de produção ou perfil de cliente.
- Priorize termos que alguém realmente pesquisaria no Google.
- Use linguagem natural de busca, sem exagero publicitário.
- Use português do Brasil.
- Retorne somente uma lista, uma sugestão por linha, sem numeração e sem explicações.

Produto:
${source.name || '-'}

Marca:
${source.brand || '-'}

Categoria:
${source.category || '-'}

Tipo operacional:
${source.operational_type || '-'}

Filtro visível / família:
${source.subcategory || '-'}

Filtros e atributos já informados:
${selectedFilters.length > 0 ? selectedFilters.join(', ') : '-'}

Highlights:
${source.specs || '-'}

Especificações técnicas:
${source.technical_specs || '-'}

Tags automáticas já geradas:
${automaticTags.length > 0 ? automaticTags.join('
') : '-'}

Gere somente as 8 melhores tags complementares, diferentes das automáticas, focadas no comportamento real de busca desta categoria.`;
}
