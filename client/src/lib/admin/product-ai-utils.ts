import { normalizeFilterName } from '@/lib/admin/product-utils';
import { normalizeSeoTags, uniqueSeoLines } from '@/lib/admin/seo-utils';
import {
  buildAutomaticSeoTags,
  buildChatGptSeoPrompt,
  type ProductSeoPromptSource,
} from '@/lib/admin/product-seo-prompt';

export type ProductAiSeoPayloadParams = {
  source: ProductSeoPromptSource;
  selectedFilters: string[];
  publicSubcategory?: string | null;
  lensMountSeoTags?: string[];
  currentManualTagsText?: string | null;
};

export type ProductAiSeoPayload = {
  automaticTags: string[];
  mergedTags: string;
  prompt: string;
};

export function buildProductAiSeoPayload({
  source,
  selectedFilters,
  publicSubcategory,
  lensMountSeoTags = [],
  currentManualTagsText = '',
}: ProductAiSeoPayloadParams): ProductAiSeoPayload {
  const brand = source.brand?.trim() || '';
  const selectedFiltersWithoutBrand = selectedFilters.filter(
    (filter) => normalizeFilterName(filter) !== normalizeFilterName(brand)
  );

  const automaticTags = buildAutomaticSeoTags({
    source,
    selectedFilters: selectedFiltersWithoutBrand,
    publicSubcategory,
    lensMountSeoTags,
  });

  const currentManualTags = normalizeSeoTags(currentManualTagsText || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  const mergedTags = uniqueSeoLines([...automaticTags, ...currentManualTags])
    .slice(0, 20)
    .join('\n');

  const prompt = buildChatGptSeoPrompt({
    source,
    selectedFilters: selectedFiltersWithoutBrand,
    automaticTags,
  });

  return {
    automaticTags,
    mergedTags,
    prompt,
  };
}

export async function copyPromptAndOpenChatGpt(prompt: string) {
  try {
    await navigator.clipboard.writeText(prompt);
    window.open('https://chatgpt.com', '_blank', 'noopener,noreferrer');
    return true;
  } catch {
    window.open('https://chatgpt.com', '_blank', 'noopener,noreferrer');
    return false;
  }
}
