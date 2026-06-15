import type { SupabaseClient } from '@supabase/supabase-js';

type FilterOption = {
  id: string;
  group_id: string;
  name: string;
  display_order: number | null;
  is_active?: boolean | null;
};

type FilterGroup = {
  id: string;
  category_id: string;
  name: string;
  display_order: number | null;
  is_active?: boolean | null;
  category?: {
    name: string;
  };
  options?: FilterOption[];
};

type ProductFilterOptionRow = {
  product_id: string;
  filter_option_id: string;
};

type BuildProductFilterOptionIdsParams = {
  supabase: SupabaseClient;
  categoryName: string;
  brandName: string;
  optionIds: string[];
  filterGroups: FilterGroup[];
  isBrandFilterGroup: (group?: FilterGroup | null) => boolean;
  normalizeFilterName: (value?: string | null) => string;
  reloadFilterArchitecture: () => Promise<void>;
};

export const getBrandGroupForCategoryName = (
  filterGroups: FilterGroup[],
  categoryName: string,
  isBrandFilterGroup: (group?: FilterGroup | null) => boolean
) => {
  if (!categoryName) return null;

  return (
    filterGroups.find(
      (group) =>
        group.category?.name === categoryName && isBrandFilterGroup(group)
    ) || null
  );
};

export const ensureBrandFilterOptionId = async ({
  supabase,
  categoryName,
  brandName,
  filterGroups,
  isBrandFilterGroup,
  normalizeFilterName,
  reloadFilterArchitecture,
}: Omit<BuildProductFilterOptionIdsParams, 'optionIds'>) => {
  const cleanBrandName = brandName.trim();
  if (!categoryName || !cleanBrandName) return null;

  const brandGroup = getBrandGroupForCategoryName(
    filterGroups,
    categoryName,
    isBrandFilterGroup
  );

  if (!brandGroup) return null;

  const existingOption = (brandGroup.options || []).find(
    (option) => normalizeFilterName(option.name) === normalizeFilterName(cleanBrandName)
  );

  if (existingOption) return existingOption.id;

  const nextOrder =
    Math.max(
      0,
      ...(brandGroup.options || []).map((option) => option.display_order ?? 0)
    ) + 1;

  const { data, error } = await supabase
    .from('filter_options')
    .insert([
      {
        group_id: brandGroup.id,
        name: cleanBrandName,
        display_order: nextOrder,
      },
    ])
    .select('id')
    .single();

  if (error) throw error;

  await reloadFilterArchitecture();

  return data?.id || null;
};

export const buildProductFilterOptionIdsToSaveWithBrandSync = async ({
  supabase,
  categoryName,
  brandName,
  optionIds,
  filterGroups,
  isBrandFilterGroup,
  normalizeFilterName,
  reloadFilterArchitecture,
}: BuildProductFilterOptionIdsParams) => {
  const brandGroup = getBrandGroupForCategoryName(
    filterGroups,
    categoryName,
    isBrandFilterGroup
  );

  const brandOptionIds = new Set(
    (brandGroup?.options || []).map((option) => option.id)
  );

  const optionIdsWithoutBrand = optionIds.filter(
    (optionId) => !brandOptionIds.has(optionId)
  );

  const brandOptionId = await ensureBrandFilterOptionId({
    supabase,
    categoryName,
    brandName,
    filterGroups,
    isBrandFilterGroup,
    normalizeFilterName,
    reloadFilterArchitecture,
  });

  return Array.from(
    new Set([
      ...optionIdsWithoutBrand,
      ...(brandOptionId ? [brandOptionId] : []),
    ])
  );
};

export const fetchProductFilterOptionIdsFromSupabase = async (
  supabase: SupabaseClient,
  productId: string
) => {
  const { data, error } = await supabase
    .from('product_filter_options')
    .select('filter_option_id')
    .eq('product_id', productId);

  if (error) throw error;

  return ((data as ProductFilterOptionRow[]) || [])
    .map((item) => item.filter_option_id)
    .filter(Boolean);
};

export const saveProductFilterOptionsToSupabase = async (
  supabase: SupabaseClient,
  productId: string,
  optionIds: string[]
) => {
  const uniqueOptionIds = Array.from(new Set(optionIds.filter(Boolean)));

  const { error: deleteError } = await supabase
    .from('product_filter_options')
    .delete()
    .eq('product_id', productId);

  if (deleteError) throw deleteError;

  if (uniqueOptionIds.length === 0) return;

  const rows = uniqueOptionIds.map((optionId) => ({
    product_id: productId,
    filter_option_id: optionId,
  }));

  const { error: insertError } = await supabase
    .from('product_filter_options')
    .insert(rows);

  if (insertError) throw insertError;

  const savedOptionIds = await fetchProductFilterOptionIdsFromSupabase(
    supabase,
    productId
  );

  if (savedOptionIds.length !== uniqueOptionIds.length) {
    throw new Error(
      'Produto salvo, mas os filtros relacionados não foram confirmados no banco. Verifique as policies da tabela product_filter_options.'
    );
  }
};
