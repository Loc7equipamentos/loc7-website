// client/src/lib/admin/product-utils.ts

export const normalizeFilterName = (value?: string | null): string => {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

export const buildProductName = (brand: string, model: string): string => {
  return [brand?.trim(), model?.trim()]
    .filter(Boolean)
    .join(' ')
    .trim();
};

export const stripBrandFromName = (name: string, brand: string): string => {
  const cleanName = name.trim();
  const cleanBrand = brand.trim();

  if (!cleanName || !cleanBrand) return cleanName;

  const normalizedName = normalizeFilterName(cleanName);
  const normalizedBrand = normalizeFilterName(cleanBrand);

  if (normalizedName === normalizedBrand) return '';

  if (normalizedName.startsWith(`${normalizedBrand} `)) {
    return cleanName.slice(cleanBrand.length).trim();
  }

  return cleanName;
};

export const getDisplayNamePrefix = (categoryName: string): string => {
  const normalizedCategory = normalizeFilterName(categoryName);

  const prefixByCategory: Record<string, string> = {
    adaptadores: 'Adaptador',
    acessorios: 'Acessório',
    audio: 'Áudio',
    baterias: 'Bateria',
    cameras: 'Câmera',
    computadores: 'Computador',
    'computadores e tablets': 'Computador / Tablet',
    comunicadores: 'Comunicador',
    conversores: 'Conversor',
    'conversores e distribuidores': 'Conversor',
    drones: 'Drone',
    estabilizadores: 'Estabilizador',
    estrutura: 'Estrutura',
    filtros: 'Filtro',
    flash: 'Flash',
    'follow focus': 'Follow Focus',
    gravadores: 'Gravador',
    'hds e cartoes': 'HD / Cartão',
    lentes: 'Lente',
    iluminacao: 'Iluminação',
    maquinaria: 'Maquinária',
    mattebox: 'Mattebox',
    monitores: 'Monitor',
    movimento: 'Movimento',
    'perifericos de rack': 'Periférico de Rack',
    smartphones: 'Smartphone',
    switchers: 'Switcher',
    teleprompter: 'Teleprompter',
    transmissores: 'Transmissor',
    tripes: 'Tripé',
  };

  return prefixByCategory[normalizedCategory] || '';
};

export const buildProductDisplayName = (
  operationalType: string | null | undefined,
  categoryName: string,
  productName: string
): string => {
  const cleanProductName = productName.trim();
  const cleanOperationalType = operationalType?.trim() || '';
  const prefix = cleanOperationalType || getDisplayNamePrefix(categoryName);

  if (!prefix || !cleanProductName) return cleanProductName;

  const normalizedProductName = normalizeFilterName(cleanProductName);
  const normalizedPrefix = normalizeFilterName(prefix);

  if (
    normalizedProductName === normalizedPrefix ||
    normalizedProductName.startsWith(`${normalizedPrefix} `)
  ) {
    return cleanProductName;
  }

  return `${prefix} ${cleanProductName}`.trim();
};

export const isLensCategory = (categoryName?: string | null): boolean => {
  return normalizeFilterName(categoryName) === 'lentes';
};

export const normalizeLensMountLabel = (value?: string | null): string => {
  const cleanValue = (value || '').trim();
  const normalizedValue = normalizeFilterName(cleanValue)
    .replace(/-mount/g, '')
    .replace(/ mount/g, '')
    .replace(/montagem /g, '')
    .trim();

  const labelByMount: Record<string, string> = {
    pl: 'PL',
    ef: 'EF',
    rf: 'RF',
    e: 'E',
    l: 'L',
    lpl: 'LPL',
    b4: 'B4',
    mft: 'MFT',
    microfourthirds: 'MFT',
    'micro 4/3': 'MFT',
  };

  return labelByMount[normalizedValue] || cleanValue.replace(/\s*[-/]?\s*mount$/i, '').trim();
};
