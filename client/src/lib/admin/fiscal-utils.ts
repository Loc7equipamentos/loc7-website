import { supabase } from '@/lib/supabase';
import { buildProductDisplayName, buildProductName } from '@/lib/admin/product-utils';

export type ProductFiscalProfile = {
  id?: string;
  product_id?: string;
  fiscal_code: string;
  fiscal_description: string;
  ncm: string;
  gtin: string;
  weight_kg: number | null;
  asset_value: number | null;
  ncm_source: string;
  ncm_source_url: string;
  ncm_basis: string;
  ncm_confidence: string;
  fiscal_status: string;
  notes: string;
  auto_generated?: boolean;
  reviewed?: boolean;
  reviewed_at?: string | null;
};

export const getEmptyFiscalProfile = (): ProductFiscalProfile => ({
  fiscal_code: '',
  fiscal_description: '',
  ncm: '',
  gtin: '',
  weight_kg: null,
  asset_value: null,
  ncm_source: '',
  ncm_source_url: '',
  ncm_basis: '',
  ncm_confidence: 'pending',
  fiscal_status: 'pending',
  notes: '',
  auto_generated: false,
  reviewed: false,
  reviewed_at: null,
});

export const normalizeFiscalProfile = (
  data: Partial<ProductFiscalProfile> | null
): ProductFiscalProfile => ({
  ...getEmptyFiscalProfile(),
  ...(data || {}),
  fiscal_code: data?.fiscal_code || '',
  fiscal_description: data?.fiscal_description || '',
  ncm: data?.ncm || '',
  gtin: data?.gtin || '',
  weight_kg: data?.weight_kg ?? null,
  asset_value: data?.asset_value ?? null,
  ncm_source: data?.ncm_source || '',
  ncm_source_url: data?.ncm_source_url || '',
  ncm_basis: data?.ncm_basis || '',
  ncm_confidence: data?.ncm_confidence || 'pending',
  fiscal_status: data?.fiscal_status || 'pending',
  notes: data?.notes || '',
  auto_generated: data?.auto_generated || false,
  reviewed: data?.reviewed || false,
  reviewed_at: data?.reviewed_at || null,
});

export const fetchProductFiscalProfile = async (productId: string) => {
  const { data, error } = await supabase
    .from('product_fiscal_profiles')
    .select('*')
    .eq('product_id', productId)
    .maybeSingle();

  if (error) throw error;

  return normalizeFiscalProfile((data as ProductFiscalProfile | null) || null);
};

export const hasFiscalProfileData = (profile: ProductFiscalProfile) => {
  return Boolean(
    profile.fiscal_code.trim() ||
      profile.fiscal_description.trim() ||
      profile.ncm.trim() ||
      profile.gtin.trim() ||
      profile.weight_kg !== null ||
      profile.asset_value !== null ||
      profile.ncm_source.trim() ||
      profile.ncm_source_url.trim() ||
      profile.ncm_basis.trim() ||
      profile.notes.trim() ||
      profile.fiscal_status !== 'pending' ||
      profile.ncm_confidence !== 'pending' ||
      profile.reviewed
  );
};

export const saveFiscalProfile = async (
  productId: string,
  profile: ProductFiscalProfile
) => {
  const payload = {
    product_id: productId,
    fiscal_code: profile.fiscal_code.trim() || null,
    fiscal_description: profile.fiscal_description.trim() || null,
    ncm: profile.ncm.trim() || null,
    gtin: profile.gtin.trim() || null,
    weight_kg: profile.weight_kg,
    asset_value: profile.asset_value,
    ncm_source: profile.ncm_source.trim() || null,
    ncm_source_url: profile.ncm_source_url.trim() || null,
    ncm_basis: profile.ncm_basis.trim() || null,
    ncm_confidence: profile.ncm_confidence || 'pending',
    fiscal_status: profile.fiscal_status || 'pending',
    notes: profile.notes.trim() || null,
    auto_generated: profile.auto_generated || false,
    reviewed: profile.reviewed || false,
    reviewed_at: profile.reviewed ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('product_fiscal_profiles')
    .upsert(payload, { onConflict: 'product_id' });

  if (error) throw error;
};

export const buildNcmResearchText = (source: {
  name?: string | null;
  brand?: string | null;
  model?: string | null;
  category?: string | null;
  operational_type?: string | null;
  subcategory?: string | null;
  specs?: string | null;
  technical_specs?: string | null;
  includes?: string | null;
}) => {
  return [
    source.brand,
    source.model,
    source.name,
    source.category,
    source.operational_type,
    source.subcategory,
    source.specs,
    source.technical_specs,
    source.includes,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const openNcmResearch = (researchText: string) => {
  const query = `NCM ${researchText} classificação fiscal Receita Federal Classif Siscomex`;
  window.open(
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    '_blank',
    'noopener,noreferrer'
  );
};

export const buildSuggestedFiscalProfile = (
  currentProfile: ProductFiscalProfile,
  source: {
    name?: string | null;
    brand?: string | null;
    model?: string | null;
    category?: string | null;
    operational_type?: string | null;
    subcategory?: string | null;
    specs?: string | null;
    technical_specs?: string | null;
    includes?: string | null;
  }
): ProductFiscalProfile => {
  const researchText = buildNcmResearchText(source);

  return {
    ...currentProfile,
    fiscal_description:
      currentProfile.fiscal_description ||
      buildProductDisplayName(
        source.operational_type,
        source.category || '',
        source.name || buildProductName(source.brand || '', source.model || '')
      ),
    ncm_source: currentProfile.ncm_source || 'Pesquisa assistida - Classif/Siscomex',
    ncm_basis: `Pesquisa assistida gerada a partir dos dados do produto: ${researchText}`,
    ncm_confidence: 'pending',
    fiscal_status: 'suggested',
    auto_generated: true,
    reviewed: false,
    reviewed_at: null,
  };
};
