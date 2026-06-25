import { useState, useEffect, useRef } from 'react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { Trash2, Plus, Edit2, X, Upload, Loader, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import {
  normalizeFilterName,
  buildProductName,
  buildProductDisplayName,
  isLensCategory,
  normalizeLensMountLabel,
} from '@/lib/admin/product-utils';
import {
  countSeoTags,
  normalizeSeoTags,
  uniqueSeoLines,
} from '@/lib/admin/seo-utils';
import {
  type ProductFiscalProfile,
  getEmptyFiscalProfile,
  fetchProductFiscalProfile,
  hasFiscalProfileData,
  saveFiscalProfile,
  buildNcmResearchText,
  openNcmResearch,
  buildSuggestedFiscalProfile,
} from '@/lib/admin/fiscal-utils';
import {
  getCombinedImages,
  getImageUploadBaseName,
  uploadProductImages,
} from '@/lib/admin/image-utils';
import {
  buildAutomaticSeoTags,
  buildChatGptSeoPrompt,
} from '@/lib/admin/product-seo-prompt';
import ProductFilterSelector from '@/lib/admin/ProductFilterSelector';
import {
  buildProductFilterOptionIdsToSaveWithBrandSync,
  fetchProductFilterOptionIdsFromSupabase,
  saveProductFilterOptionsToSupabase,
} from '@/lib/admin/filter-relations-utils';
import {
  addFilterGroupToSupabase,
  addFilterOptionToSupabase,
  addTreeFilterToSupabase,
  addTreeFilterValueToSupabase,
  deleteFilterGroupFromSupabase,
  deleteFilterOptionFromSupabase,
  loadFilterArchitectureFromSupabase,
  moveFilterGroupInSupabase,
  moveFilterOptionInSupabase,
} from '@/lib/admin/filter-architecture-utils';

type ProductWithImages = Product & {
  images?: string[] | null;
  includes?: string | null;
  technical_specs?: string | null;
  catalog_order?: number | null;
  is_featured?: boolean | null;
  featured_order?: number | null
  brand?: string | null;
  display_name?: string | null;
  operational_type?: string | null;
  fiscal_ncm?: string | null;
  fiscal_status?: string | null;
  ncm_confidence?: string | null;
  seo_tags?: string | null;
};

type Brand = {
  id: string;
  name: string;
};

type CategoryWithSeo = Category & {
  seo_title?: string | null;
  seo_description?: string | null;
  seo_applications?: string | null;
  seo_brands?: string | null;
  seo_meta_description?: string | null;
};

type OperationalType = {
  id: string;
  name: string;
};

type Subcategory = {
  id: string;
  name: string;
  category_id: string;
  category?: {
    name: string;
  };
};

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

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [categories, setCategories] = useState<CategoryWithSeo[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [operationalTypes, setOperationalTypes] = useState<OperationalType[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
  'products' | 'categories' | 'subcategories' | 'brands'
>('products');

  const [editingProduct, setEditingProduct] = useState<ProductWithImages | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragOverNewProduct, setIsDragOverNewProduct] = useState(false);
  const [isDragOverEditProduct, setIsDragOverEditProduct] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    operational_type: '',
    subcategory: '',
    price: 0,
    description: '',
    specs: '',
    technical_specs: '',
    includes: '',
    image_url: '',
    images: [] as string[],
    brand: '',
    model: '',
    seo_tags: '',
    badge: '',
    catalog_order: null as number | null,
    is_featured: false,
    featured_order: null as number | null,
  });

  const [newProductFiscalProfile, setNewProductFiscalProfile] = useState<ProductFiscalProfile>(getEmptyFiscalProfile());
  const newProductNcmInputRef = useRef<HTMLInputElement | null>(null);
  const editingNcmInputRef = useRef<HTMLInputElement | null>(null);

  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<CategoryWithSeo | null>(null);
  const [showCategorySeoModal, setShowCategorySeoModal] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [newOperationalType, setNewOperationalType] = useState('');
  const [newVisibleFilterName, setNewVisibleFilterName] = useState('');
  const [editingVisibleFilterName, setEditingVisibleFilterName] = useState('');
  const [newSubcategory, setNewSubcategory] = useState({
  category_id: '',
  name: '',
});
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
const [selectedBrandFilter, setSelectedBrandFilter] = useState('');
  const [selectedSubcategoryCategoryFilter, setSelectedSubcategoryCategoryFilter] =
  useState('');
  const [selectedFilterArchitectureCategory, setSelectedFilterArchitectureCategory] =
    useState('');
  const [newFilterGroup, setNewFilterGroup] = useState({
    category_id: '',
    name: '',
    display_order: 0,
  });
  const [newFilterOption, setNewFilterOption] = useState({
    group_id: '',
    name: '',
    display_order: 0,
  });
  const [newTreeFilterName, setNewTreeFilterName] = useState('');
  const [newTreeFilterOrder, setNewTreeFilterOrder] = useState<number | ''>('');
  const [newFilterValueByGroup, setNewFilterValueByGroup] = useState<Record<string, string>>({});
  const [newProductFilterOptionIds, setNewProductFilterOptionIds] = useState<string[]>([]);
  const [editingProductFilterOptionIds, setEditingProductFilterOptionIds] = useState<string[]>([]);
  const [loadingEditingProductFilters, setLoadingEditingProductFilters] = useState(false);
  const [editingFiscalProfile, setEditingFiscalProfile] = useState<ProductFiscalProfile>(getEmptyFiscalProfile());
  const [loadingEditingFiscalProfile, setLoadingEditingFiscalProfile] = useState(false);
  const [savingFiscalProfile, setSavingFiscalProfile] = useState(false);
  const normalizingCatalogOrderRef = useRef(false);
  const [draggedCatalogProductId, setDraggedCatalogProductId] = useState<string | null>(null);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getSelectedFilterNames = (optionIds: string[]) => {
    const selectedIds = new Set(optionIds);

    return filterGroups
      .flatMap((group) => group.options || [])
      .filter((option) => selectedIds.has(option.id))
      .map((option) => option.name)
      .filter(Boolean);
  };

  const isMountFilterGroup = (group?: FilterGroup | null) => {
    const normalizedName = normalizeFilterName(group?.name);
    return normalizedName === 'mount' || normalizedName === 'montagem';
  };

  const getLensMountNames = (optionIds: string[]) => {
    const selectedIds = new Set(optionIds);

    return uniqueSeoLines(
      filterGroups
        .filter((group) => isMountFilterGroup(group))
        .flatMap((group) => group.options || [])
        .filter((option) => selectedIds.has(option.id))
        .map((option) => normalizeLensMountLabel(option.name))
    );
  };

  const buildLensMountDisplay = (optionIds: string[]) => {
    const mountNames = getLensMountNames(optionIds);

    if (mountNames.length === 0) return '';

    return `${mountNames.join(' / ')} Mount`;
  };

  const getPublicSubcategoryForProduct = (
    source: {
      category?: string | null;
      subcategory?: string | null;
    },
    optionIds: string[]
  ) => {
    if (isLensCategory(source.category)) {
      const mountDisplay = buildLensMountDisplay(optionIds);
      if (mountDisplay) return mountDisplay;
    }

    return normalizeSubcategory(source.subcategory) || '';
  };

  const buildLensMountSeoTags = (productReference: string, optionIds: string[]) => {
    const mountNames = getLensMountNames(optionIds);

    if (!productReference || mountNames.length === 0) return [];

    return mountNames.flatMap((mountName) => [
      `Locação ${productReference} ${mountName} Mount`,
      `Aluguel ${productReference} ${mountName} Mount`,
      `${productReference} ${mountName} Mount`,
    ]);
  };

  const generateSeoTagsAndOpenChatGpt = async (
    source: {
      name?: string | null;
      brand?: string | null;
      category?: string | null;
      operational_type?: string | null;
      subcategory?: string | null;
      specs?: string | null;
      technical_specs?: string | null;
    } | null,
    optionIds: string[],
    isEditing: boolean = false
  ) => {
    if (!source) return;

    const sourceForSeo = {
      ...source,
      subcategory: getPublicSubcategoryForProduct(source, optionIds) || source.subcategory,
    };

    const selectedFilters = getSelectedFilterNames(optionIds).filter(
      (filter) => normalizeFilterName(filter) !== normalizeFilterName(sourceForSeo.brand)
    );
    const publicSubcategory = getPublicSubcategoryForProduct(source, optionIds);
    const productReference =
      sourceForSeo.name?.trim() ||
      buildProductName(sourceForSeo.brand || '', (sourceForSeo as { model?: string | null }).model || '');
    const lensMountSeoTags = isLensCategory(sourceForSeo.category)
      ? buildLensMountSeoTags(productReference, optionIds)
      : [];

    const automaticTags = buildAutomaticSeoTags({
      source: sourceForSeo,
      selectedFilters,
      publicSubcategory,
      lensMountSeoTags,
    });
    const currentManualTags = normalizeSeoTags(
      isEditing
        ? (editingProduct as ProductWithImages | null)?.seo_tags || ''
        : newProduct.seo_tags
    )
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    const mergedTags = uniqueSeoLines([...automaticTags, ...currentManualTags])
      .slice(0, 20)
      .join('\n');

    if (isEditing) {
      setEditingProduct((prev) =>
        prev ? { ...prev, seo_tags: mergedTags } : prev
      );
    } else {
      setNewProduct((prev) => ({ ...prev, seo_tags: mergedTags }));
    }

    const prompt = buildChatGptSeoPrompt({
      source: sourceForSeo,
      selectedFilters,
      automaticTags,
    });

    try {
      await navigator.clipboard.writeText(prompt);
      window.open('https://chatgpt.com', '_blank', 'noopener,noreferrer');
      alert('Tags automáticas geradas. Prompt copiado. Cole no ChatGPT para gerar até 8 sugestões complementares.');
    } catch {
      window.open('https://chatgpt.com', '_blank', 'noopener,noreferrer');
      alert('Tags automáticas geradas. Não foi possível copiar o prompt automaticamente.');
    }
  };

  const isBrandFilterGroup = (group?: FilterGroup | null) => {
    const normalizedName = normalizeFilterName(group?.name);
    return normalizedName === 'marca' || normalizedName === 'marcas';
  };

  const isVisibleCategoryFilterGroup = (group?: FilterGroup | null) => {
    return normalizeFilterName(group?.name) === 'categoria';
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBrands();
    loadOperationalTypes();
    loadSubcategories();
    loadFilterArchitecture();
  }, []);

  useEffect(() => {
    if (activeTab === 'products' || activeTab === 'brands') {
      loadBrands();
      loadOperationalTypes();
    }
  }, [activeTab]);

  useEffect(() => {
    if (loading || products.length === 0 || normalizingCatalogOrderRef.current) return;

    const categoriesToNormalize = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter((category): category is string => Boolean(category))
      )
    ).filter((categoryName) =>
      categoryNeedsCatalogOrderNormalization(categoryName, products)
    );

    if (categoriesToNormalize.length === 0) return;

    normalizingCatalogOrderRef.current = true;

    Promise.all(
      categoriesToNormalize.map((categoryName) =>
        normalizeCategoryCatalogOrder(categoryName, products)
      )
    )
      .then(() => loadProducts())
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : 'Erro ao normalizar ordem do catálogo'
        );
      })
      .finally(() => {
        normalizingCatalogOrderRef.current = false;
      });
  }, [products, loading]);

  useEffect(() => {
    setNewProduct((prev) => ({ ...prev, subcategory: '' }));
    setNewProductFilterOptionIds([]);
  }, [newProduct.category]);

  const normalizeSubcategory = (value?: string | null) => {
    return value?.trim() || '';
  };

  const slugify = (value: string) => {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  };

  const generateUniqueSlug = async (name: string, productId?: string) => {
    const baseSlug = slugify(name) || `produto-${Date.now()}`;

    const { data, error } = await supabase
      .from('products')
      .select('id, slug')
      .ilike('slug', `${baseSlug}%`);

    if (error) throw error;

    const conflicts = (data || []).filter((item) => item.id !== productId);

    if (conflicts.length === 0) {
      return baseSlug;
    }

    const existingSlugs = new Set(conflicts.map((item) => item.slug));
    let counter = 2;
    let candidate = `${baseSlug}-${counter}`;

    while (existingSlugs.has(candidate)) {
      counter += 1;
      candidate = `${baseSlug}-${counter}`;
    }

    return candidate;
  };

  const getLegacySubcategoriesForCategory = (categoryName: string) => {
  if (!categoryName) return [];

  const selectedCategory = categories.find(
    (cat) => cat.name === categoryName
  );

  if (!selectedCategory) return [];

  return subcategories
    .filter(
      (subcat) => subcat.category_id === selectedCategory.id
    )
    .map((subcat) => subcat.name)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));
};

  const getFilterGroupsForCategoryName = (categoryName: string) => {
    if (!categoryName) return [];

    return filterGroups
      .filter((group) => group.category?.name === categoryName)
      .sort((a, b) => {
        const orderA = a.display_order ?? 999;
        const orderB = b.display_order ?? 999;

        if (orderA !== orderB) return orderA - orderB;

        return a.name.localeCompare(b.name, 'pt-BR');
      });
  };

  const getVisibleFilterOptionsForCategory = (categoryName: string) => {
    if (!categoryName) return [];

    const categoryGroup = getFilterGroupsForCategoryName(categoryName).find(
      (group) => isVisibleCategoryFilterGroup(group)
    );

    const architectureOptions = (categoryGroup?.options || [])
      .map((option) => option.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));

    if (architectureOptions.length > 0) {
      return architectureOptions;
    }

    return getLegacySubcategoriesForCategory(categoryName);
  };

  const newProductVisibleFilters = getVisibleFilterOptionsForCategory(newProduct.category);
  const editingProductVisibleFilters = editingProduct
    ? getVisibleFilterOptionsForCategory(editingProduct.category)
    : [];

  const newProductFilterGroups = getFilterGroupsForCategoryName(newProduct.category);
  const editingProductFilterGroups = editingProduct
    ? getFilterGroupsForCategoryName(editingProduct.category)
    : [];

  const toggleProductFilterOption = (
    optionId: string,
    isEditing: boolean = false
  ) => {
    const setter = isEditing
      ? setEditingProductFilterOptionIds
      : setNewProductFilterOptionIds;

    setter((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const toggleVisibleCategoryFilterOption = (
    group: FilterGroup,
    option: FilterOption,
    isEditing: boolean = false
  ) => {
    const groupOptionIds = new Set((group.options || []).map((item) => item.id));
    const setter = isEditing
      ? setEditingProductFilterOptionIds
      : setNewProductFilterOptionIds;

    setter((prev) => {
      const alreadySelected = prev.includes(option.id);
      const withoutSameGroup = prev.filter((id) => !groupOptionIds.has(id));

      return alreadySelected ? withoutSameGroup : [...withoutSameGroup, option.id];
    });

    if (isEditing) {
      setEditingProduct((prev) =>
        prev
          ? {
              ...prev,
              subcategory: editingProductFilterOptionIds.includes(option.id) ? '' : option.name,
            }
          : prev
      );
      return;
    }

    setNewProduct((prev) => ({
      ...prev,
      subcategory: newProductFilterOptionIds.includes(option.id) ? '' : option.name,
    }));
  };

  const handleProductFilterOptionToggle = (
    group: FilterGroup,
    option: FilterOption,
    isEditing: boolean = false
  ) => {
    if (isVisibleCategoryFilterGroup(group)) {
      toggleVisibleCategoryFilterOption(group, option, isEditing);
      return;
    }

    toggleProductFilterOption(option.id, isEditing);
  };

  const buildProductFilterOptionIdsToSave = async (
    categoryName: string,
    brandName: string,
    optionIds: string[]
  ) => {
    return buildProductFilterOptionIdsToSaveWithBrandSync({
      supabase,
      categoryName,
      brandName,
      optionIds,
      filterGroups,
      isBrandFilterGroup,
      normalizeFilterName,
      reloadFilterArchitecture: loadFilterArchitecture,
    });
  };

  const fetchProductFilterOptionIds = async (productId: string) => {
    return fetchProductFilterOptionIdsFromSupabase(supabase, productId);
  };

  const saveProductFilterOptions = async (productId: string, optionIds: string[]) => {
    return saveProductFilterOptionsToSupabase(supabase, productId, optionIds);
  };

  const saveProductFiscalProfile = async (productId: string) => {
    await saveFiscalProfile(productId, editingFiscalProfile);
  };

  const suggestNcmForNewProduct = () => {
    const researchText = buildNcmResearchText(newProduct);

    if (!researchText) {
      alert('Preencha pelo menos marca, modelo, categoria ou tipo operacional antes de sugerir o NCM.');
      return;
    }

    setNewProductFiscalProfile((prev) =>
      buildSuggestedFiscalProfile(prev, newProduct)
    );

    openNcmResearch(researchText);
    setTimeout(() => newProductNcmInputRef.current?.focus(), 100);
  };

  const suggestNcmForEditingProduct = () => {
    if (!editingProduct) return;

    const researchText = buildNcmResearchText(editingProduct);

    if (!researchText) {
      alert('Preencha os dados do produto antes de sugerir o NCM.');
      return;
    }

    setEditingFiscalProfile((prev) =>
      buildSuggestedFiscalProfile(prev, editingProduct)
    );

    openNcmResearch(researchText);
    setTimeout(() => editingNcmInputRef.current?.focus(), 100);
  };

  const openEditProduct = async (product: ProductWithImages) => {
    try {
      setError(null);
      setLoadingEditingProductFilters(true);
      setLoadingEditingFiscalProfile(true);

      const [optionIds, fiscalProfile] = await Promise.all([
        fetchProductFilterOptionIds(product.id),
        fetchProductFiscalProfile(product.id),
      ]);

      setEditingProductFilterOptionIds(optionIds);
      setEditingFiscalProfile(fiscalProfile);
      setEditingProduct(product);
      setShowEditModal(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar dados relacionados ao produto'
      );
    } finally {
      setLoadingEditingProductFilters(false);
      setLoadingEditingFiscalProfile(false);
    }
  };

  const moveImage = (
    index: number,
    direction: 'left' | 'right',
    isEditing: boolean = false
  ) => {
    if (isEditing && editingProduct) {
      const allImages = getCombinedImages(editingProduct.image_url, editingProduct.images);
      const newIndex = direction === 'left' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= allImages.length) return;

      [allImages[index], allImages[newIndex]] = [allImages[newIndex], allImages[index]];

      setEditingProduct({
        ...editingProduct,
        image_url: allImages[0] || null,
        images: allImages.slice(1),
      });
      return;
    }

    const allImages = getCombinedImages(newProduct.image_url, newProduct.images);
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= allImages.length) return;

    [allImages[index], allImages[newIndex]] = [allImages[newIndex], allImages[index]];

    setNewProduct((prev) => ({
      ...prev,
      image_url: allImages[0] || '',
      images: allImages.slice(1),
    }));
  };

  const removeImage = (index: number, isEditing: boolean = false) => {
    if (isEditing && editingProduct) {
      const allImages = getCombinedImages(editingProduct.image_url, editingProduct.images);
      allImages.splice(index, 1);

      setEditingProduct({
        ...editingProduct,
        image_url: allImages[0] || null,
        images: allImages.slice(1),
      });
      return;
    }

    const allImages = getCombinedImages(newProduct.image_url, newProduct.images);
    allImages.splice(index, 1);

    setNewProduct((prev) => ({
      ...prev,
      image_url: allImages[0] || '',
      images: allImages.slice(1),
    }));
  };

  const getProductOrderValue = (product: ProductWithImages) => {
    return typeof product.catalog_order === 'number'
      ? product.catalog_order
      : Number.POSITIVE_INFINITY;
  };

  const getProductsSortedForCategoryOrder = (
    categoryName: string,
    sourceProducts: ProductWithImages[] = products
  ) => {
    const originalIndexById = new Map(
      sourceProducts.map((product, index) => [product.id, index])
    );

    return [...sourceProducts]
      .filter((product) => product.category === categoryName)
      .sort((a, b) => {
        const orderA = getProductOrderValue(a);
        const orderB = getProductOrderValue(b);

        if (orderA !== orderB) return orderA - orderB;

        return (originalIndexById.get(a.id) ?? 0) - (originalIndexById.get(b.id) ?? 0);
      });
  };

  const categoryNeedsCatalogOrderNormalization = (
    categoryName: string,
    sourceProducts: ProductWithImages[] = products
  ) => {
    const orderedProducts = getProductsSortedForCategoryOrder(categoryName, sourceProducts);

    if (orderedProducts.length === 0) return false;

    const seenOrders = new Set<number>();

    return orderedProducts.some((product, index) => {
      const expectedOrder = index + 1;
      const currentOrder = product.catalog_order;
      const hasInvalidOrder = typeof currentOrder !== 'number' || currentOrder < 1;
      const isDuplicateOrder = typeof currentOrder === 'number' && seenOrders.has(currentOrder);

      if (typeof currentOrder === 'number') {
        seenOrders.add(currentOrder);
      }

      return hasInvalidOrder || isDuplicateOrder || currentOrder !== expectedOrder;
    });
  };

  const normalizeCategoryCatalogOrder = async (
    categoryName: string,
    sourceProducts: ProductWithImages[] = products
  ) => {
    const orderedProducts = getProductsSortedForCategoryOrder(categoryName, sourceProducts);

    if (orderedProducts.length === 0) return [];

    const updates = orderedProducts
      .map((product, index) => ({ product, catalog_order: index + 1 }))
      .filter(({ product, catalog_order }) => product.catalog_order !== catalog_order);

    if (updates.length > 0) {
      const results = await Promise.all(
        updates.map(({ product, catalog_order }) =>
          supabase
            .from('products')
            .update({ catalog_order })
            .eq('id', product.id)
        )
      );

      const firstError = results.find((result) => result.error)?.error;
      if (firstError) throw firstError;
    }

    return orderedProducts.map((product, index) => ({
      ...product,
      catalog_order: index + 1,
    }));
  };

  const prepareCategoryOrderForNewProduct = async (categoryName: string) => {
    const orderedProducts = getProductsSortedForCategoryOrder(categoryName);

    if (orderedProducts.length === 0) return;

    const results = await Promise.all(
      orderedProducts.map((product, index) =>
        supabase
          .from('products')
          .update({ catalog_order: index + 2 })
          .eq('id', product.id)
      )
    );

    const firstError = results.find((result) => result.error)?.error;
    if (firstError) throw firstError;
  };

  const moveProductInCatalogOrder = async (
    product: ProductWithImages,
    direction: 'up' | 'down'
  ) => {
    if (!product.category) return;

    try {
      setError(null);
      const orderedProducts = await normalizeCategoryCatalogOrder(product.category);
      const currentIndex = orderedProducts.findIndex((item) => item.id === product.id);
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        targetIndex >= orderedProducts.length
      ) {
        return;
      }

      const currentProduct = orderedProducts[currentIndex];
      const targetProduct = orderedProducts[targetIndex];

      const results = await Promise.all([
        supabase
          .from('products')
          .update({ catalog_order: targetProduct.catalog_order })
          .eq('id', currentProduct.id),
        supabase
          .from('products')
          .update({ catalog_order: currentProduct.catalog_order })
          .eq('id', targetProduct.id),
      ]);

      const firstError = results.find((result) => result.error)?.error;
      if (firstError) throw firstError;

      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar ordem do produto');
    }
  };

  const reorderProductByDragAndDrop = async (
    draggedProductId: string,
    targetProduct: ProductWithImages
  ) => {
    const draggedProduct = products.find((product) => product.id === draggedProductId);

    if (!draggedProduct || !targetProduct.category) return;

    if (draggedProduct.category !== targetProduct.category) {
      setError('A ordenação por arrastar funciona apenas dentro da mesma categoria.');
      return;
    }

    if (draggedProduct.id === targetProduct.id) return;

    try {
      setError(null);

      const orderedProducts = await normalizeCategoryCatalogOrder(targetProduct.category);
      const draggedIndex = orderedProducts.findIndex((product) => product.id === draggedProduct.id);
      const targetIndex = orderedProducts.findIndex((product) => product.id === targetProduct.id);

      if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) return;

      const nextOrder = [...orderedProducts];
      const [removedProduct] = nextOrder.splice(draggedIndex, 1);
      nextOrder.splice(targetIndex, 0, removedProduct);

      const results = await Promise.all(
        nextOrder.map((product, index) =>
          supabase
            .from('products')
            .update({ catalog_order: index + 1 })
            .eq('id', product.id)
        )
      );

      const firstError = results.find((result) => result.error)?.error;
      if (firstError) throw firstError;

      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reordenar produto');
    }
  };

  const handleCatalogProductDrop = async (
    e: React.DragEvent<HTMLTableRowElement>,
    targetProduct: ProductWithImages
  ) => {
    e.preventDefault();

    if (!draggedCatalogProductId) return;

    await reorderProductByDragAndDrop(draggedCatalogProductId, targetProduct);
    setDraggedCatalogProductId(null);
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;

      const sortedProducts = ((data as ProductWithImages[]) || []).sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        if (a.is_featured && b.is_featured) {
          const orderA = a.featured_order ?? Infinity;
          const orderB = b.featured_order ?? Infinity;
          return orderA - orderB;
        }
        return 0;
      });

      const productIds = sortedProducts.map((product) => product.id).filter(Boolean);
      let fiscalProfilesByProductId = new Map<string, ProductFiscalProfile>();

      if (productIds.length > 0) {
        const { data: fiscalProfilesData, error: fiscalProfilesError } = await supabase
          .from('product_fiscal_profiles')
          .select('product_id, ncm, fiscal_status, ncm_confidence')
          .in('product_id', productIds);

        if (!fiscalProfilesError && fiscalProfilesData) {
          fiscalProfilesByProductId = new Map(
            (fiscalProfilesData as ProductFiscalProfile[])
              .filter((profile) => profile.product_id)
              .map((profile) => [profile.product_id as string, profile])
          );
        }
      }

      setProducts(
        sortedProducts.map((product) => {
          const fiscalProfile = fiscalProfilesByProductId.get(product.id);

          return {
            ...product,
            fiscal_ncm: fiscalProfile?.ncm || null,
            fiscal_status: fiscalProfile?.fiscal_status || null,
            ncm_confidence: fiscalProfile?.ncm_confidence || null,
          };
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error: err } = await supabase.from('categories').select('*').order('name');

      if (err) throw err;
      setCategories((data as CategoryWithSeo[]) || []);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  const loadBrands = async () => {
    try {
      const { data, error: err } = await supabase.from('brands').select('*').order('name');

      if (err) throw err;
      setBrands((data as Brand[]) || []);
    } catch (err) {
      console.error('Erro ao carregar marcas:', err);
    }
  };

  const loadOperationalTypes = async () => {
    try {
      const { data, error: err } = await supabase
        .from('operational_types')
        .select('*')
        .order('name');

      if (err) throw err;
      setOperationalTypes((data as OperationalType[]) || []);
    } catch (err) {
      console.error('Erro ao carregar tipos operacionais:', err);
    }
  };

  const loadSubcategories = async () => {
  try {
   const { data, error: err } = await supabase
  .from('subcategories')
  .select(`
  *,
  category:categories (
    id,
    name
  )
`)
  .order('name');

    if (err) throw err;


    
    setSubcategories((data as Subcategory[]) || []);
  } catch (err) {
    console.error('Erro ao carregar subcategorias:', err);
  }
};

  const processFiles = async (files: FileList, isEditing: boolean = false) => {
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    const existingImages = isEditing && editingProduct
      ? getCombinedImages(editingProduct.image_url, editingProduct.images)
      : getCombinedImages(newProduct.image_url, newProduct.images);

    const sourceProduct = isEditing && editingProduct ? editingProduct : newProduct;
    const uploadBaseName = getImageUploadBaseName(sourceProduct);

    const { uploadedUrls, errors: uploadErrors } = await uploadProductImages({
      files,
      existingImages,
      uploadBaseName,
    });

    setUploadingImage(false);

    if (uploadErrors.length > 0) {
      const firstError = uploadErrors[0];
      alert(`Erro ao fazer upload: ${firstError}`);
      setError(firstError);
    }

    if (uploadedUrls.length === 0) {
      alert('Nenhuma imagem foi enviada com sucesso');
      return;
    }

    if (isEditing && editingProduct) {
      const currentImages = getCombinedImages(editingProduct.image_url, editingProduct.images);
      const allImages = [...currentImages, ...uploadedUrls];

      setEditingProduct((prev) =>
        prev
          ? {
              ...prev,
              image_url: allImages[0] || null,
              images: allImages.slice(1),
            }
          : prev
      );
    } else {
      const currentImages = getCombinedImages(newProduct.image_url, newProduct.images);
      const allImages = [...currentImages, ...uploadedUrls];

      setNewProduct((prev) => ({
        ...prev,
        image_url: allImages[0] || '',
        images: allImages.slice(1),
      }));
    }

    alert(`${uploadedUrls.length} imagem(ns) padronizada(s) e enviada(s) com sucesso!`);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing: boolean = false
  ) => {
    const files = e.target.files;
    if (!files) return;
    await processFiles(files, isEditing);
    e.target.value = '';
  };

  const handleDragEnter = (e: React.DragEvent, isEditing: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditing) {
      setIsDragOverEditProduct(true);
    } else {
      setIsDragOverNewProduct(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent, isEditing: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditing) {
      setIsDragOverEditProduct(false);
    } else {
      setIsDragOverNewProduct(false);
    }
  };

  const handleDrop = async (e: React.DragEvent, isEditing: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditing) {
      setIsDragOverEditProduct(false);
    } else {
      setIsDragOverNewProduct(false);
    }

    const files = e.dataTransfer.files;
    if (files) {
      await processFiles(files, isEditing);
    }
  };

  const addProduct = async () => {
    if (
      !newProduct.brand.trim() ||
      !newProduct.model.trim() ||
      !newProduct.name.trim() ||
      !newProduct.category ||
      !newProduct.operational_type.trim()
    ) {
      setError('Preencha marca, modelo, nome, categoria e tipo operacional');
      return;
    }

    try {
      const slug = await generateUniqueSlug(newProduct.name);
      await prepareCategoryOrderForNewProduct(newProduct.category);
      const publicSubcategory = getPublicSubcategoryForProduct(
        newProduct,
        newProductFilterOptionIds
      );

      const { data: insertedProduct, error: err } = await supabase
        .from('products')
        .insert([
          {
            name: newProduct.name.trim(),
            display_name: buildProductDisplayName(
              newProduct.operational_type,
              newProduct.category,
              newProduct.name
            ),
            category: newProduct.category,
            operational_type: newProduct.operational_type.trim() || null,
            subcategory: publicSubcategory || null,
            brand: newProduct.brand.trim() || null,
            price: newProduct.price || 0,
            description: newProduct.description,
            specs: newProduct.specs.trim() || null,
            technical_specs: newProduct.technical_specs.trim() || null,
            includes: newProduct.includes.trim() || null,
            image_url: newProduct.image_url || null,
            images: newProduct.images.length > 0 ? newProduct.images : null,
            seo_tags: normalizeSeoTags(newProduct.seo_tags) || null,
            badge: newProduct.badge || null,
            slug,
            catalog_order: 1,
            is_featured: newProduct.is_featured,
            featured_order: newProduct.is_featured ? newProduct.featured_order : null,
          },
        ])
        .select('id')
        .single();

      if (err) throw err;

      if (insertedProduct?.id) {
        const optionIdsToSave = await buildProductFilterOptionIdsToSave(
          newProduct.category,
          newProduct.brand,
          newProductFilterOptionIds
        );

        await saveProductFilterOptions(insertedProduct.id, optionIdsToSave);

        if (hasFiscalProfileData(newProductFiscalProfile)) {
          await saveFiscalProfile(insertedProduct.id, newProductFiscalProfile);
        }
      }

      setNewProduct({
        name: '',
        category: '',
        operational_type: '',
        subcategory: '',
        price: 0,
        description: '',
        specs: '',
        technical_specs: '',
        includes: '',
        image_url: '',
        images: [],
        brand: '',
        model: '',
        seo_tags: '',
        badge: '',
        catalog_order: null,
        is_featured: false,
        featured_order: null,
      });
      setNewProductFilterOptionIds([]);
      setNewProductFiscalProfile(getEmptyFiscalProfile());
      setError(null);
      await loadProducts();
      alert('Produto adicionado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar produto');
    }
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const slug = await generateUniqueSlug(editingProduct.name, editingProduct.id);
      const publicSubcategory = getPublicSubcategoryForProduct(
        editingProduct,
        editingProductFilterOptionIds
      );

      const { error: err } = await supabase
        .from('products')
        .update({
          name: editingProduct.name.trim(),
          display_name: buildProductDisplayName(
            editingProduct.operational_type,
            editingProduct.category,
            editingProduct.name
          ),
          category: editingProduct.category,
          operational_type: editingProduct.operational_type?.trim() || null,
          subcategory: publicSubcategory || null,
          brand: editingProduct.brand?.trim() || null,
          price: editingProduct.price,
          description: editingProduct.description,
          specs: editingProduct.specs?.trim() || null,
          technical_specs: editingProduct.technical_specs?.trim() || null,
          includes: editingProduct.includes?.trim() || null,
          image_url: editingProduct.image_url || null,
          images:
            editingProduct.images && editingProduct.images.length > 0
              ? editingProduct.images
              : null,
          seo_tags: normalizeSeoTags(
            (editingProduct as ProductWithImages).seo_tags ||
              editingProduct.badge ||
              ''
          ) || null,
          badge: editingProduct.badge || null,
          slug,
          catalog_order: editingProduct.catalog_order || null,
          is_featured: editingProduct.is_featured,
          featured_order: editingProduct.is_featured ? editingProduct.featured_order : null,
        })
        .eq('id', editingProduct.id);

      if (err) throw err;

      const optionIdsToSave = await buildProductFilterOptionIdsToSave(
        editingProduct.category,
        editingProduct.brand || '',
        editingProductFilterOptionIds
      );

      await saveProductFilterOptions(editingProduct.id, optionIdsToSave);

      setSavingFiscalProfile(true);
      await saveProductFiscalProfile(editingProduct.id);
      setSavingFiscalProfile(false);

      setShowEditModal(false);
      setEditingProduct(null);
      setEditingProductFilterOptionIds([]);
      setEditingFiscalProfile(getEmptyFiscalProfile());
      await loadProducts();
      alert('Produto atualizado com sucesso!');
    } catch (err) {
      setSavingFiscalProfile(false);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar produto');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      const { error: err } = await supabase.from('products').delete().eq('id', id);

      if (err) throw err;
      await loadProducts();
      alert('Produto deletado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar produto');
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      setError('Digite o nome da categoria');
      return;
    }

    try {
      const { error: err } = await supabase.from('categories').insert([{ name: newCategory.trim() }]);

      if (err) throw err;
      setNewCategory('');
      setError(null);
      await loadCategories();
      alert('Categoria adicionada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar categoria');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;

    try {
      const { error: err } = await supabase.from('categories').delete().eq('id', id);

      if (err) throw err;
      await loadCategories();
      alert('Categoria deletada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar categoria');
    }
  };

  const openCategorySeoEditor = (category: CategoryWithSeo) => {
  setEditingCategory({
  ...category,
  seo_title: category.seo_title || '',
  seo_description: category.seo_description || '',
  seo_applications: category.seo_applications || '',
  seo_brands: category.seo_brands || '',
  seo_meta_description: category.seo_meta_description || '',
});
    setShowCategorySeoModal(true);
  };

  const updateCategorySeo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCategory) return;

    try {
      const { error: err } = await supabase
        .from('categories')
        .update({
  seo_title: editingCategory.seo_title?.trim() || null,
  seo_description: editingCategory.seo_description?.trim() || null,
  seo_applications: editingCategory.seo_applications?.trim() || null,
  seo_brands: editingCategory.seo_brands?.trim() || null,
  seo_meta_description: editingCategory.seo_meta_description?.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingCategory.id);

      if (err) throw err;

      setShowCategorySeoModal(false);
      setEditingCategory(null);
      setError(null);
      await loadCategories();
      alert('SEO da categoria atualizado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar SEO da categoria');
    }
  };

  const addOperationalType = async () => {
    const cleanTypeName = newOperationalType.trim();

    if (!cleanTypeName) {
      setError('Digite o nome do tipo operacional');
      return;
    }

    try {
      const { data, error: err } = await supabase
        .from('operational_types')
        .insert([{ name: cleanTypeName }])
        .select('id, name')
        .single();

      if (err) throw err;

      if (data) {
        setOperationalTypes((prev) => {
          const withoutDuplicate = prev.filter(
            (type) => normalizeFilterName(type.name) !== normalizeFilterName(data.name)
          );

          return [...withoutDuplicate, data as OperationalType].sort((a, b) =>
            a.name.localeCompare(b.name, 'pt-BR')
          );
        });

        setNewProduct((prev) => ({
          ...prev,
          operational_type: data.name,
        }));

        setEditingProduct((prev) =>
          prev
            ? {
                ...prev,
                operational_type: data.name,
              }
            : prev
        );
      }

      setNewOperationalType('');
      setError(null);
      await loadOperationalTypes();
      alert('Tipo operacional adicionado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar tipo operacional');
    }
  };

  const addVisibleFilterOption = async (categoryName: string, value: string, isEditing: boolean = false) => {
    const cleanValue = value.trim();

    if (!categoryName) {
      setError('Selecione a categoria antes de incluir um filtro visível');
      return;
    }

    if (!cleanValue) {
      setError('Digite o nome do filtro visível');
      return;
    }

    const selectedCategory = categories.find((cat) => cat.name === categoryName);

    if (!selectedCategory) {
      setError('Categoria não encontrada para criar o filtro visível');
      return;
    }

    try {
      let visibleGroup = getFilterGroupsForCategoryName(categoryName).find((group) =>
        isVisibleCategoryFilterGroup(group)
      );

      if (!visibleGroup) {
        const nextGroupOrder =
          Math.max(
            0,
            ...filterGroups
              .filter((group) => group.category_id === selectedCategory.id)
              .map((group) => group.display_order ?? 0)
          ) + 1;

        const { data: createdGroup, error: groupError } = await supabase
          .from('filter_groups')
          .insert([
            {
              category_id: selectedCategory.id,
              name: 'Categoria',
              display_order: nextGroupOrder,
            },
          ])
          .select('id, category_id, name, display_order')
          .single();

        if (groupError) throw groupError;

        visibleGroup = createdGroup as FilterGroup;
      }

      const existingOption = (visibleGroup.options || []).find(
        (option) => normalizeFilterName(option.name) === normalizeFilterName(cleanValue)
      );

      if (!existingOption) {
        const nextOptionOrder =
          Math.max(
            0,
            ...(visibleGroup.options || []).map((option) => option.display_order ?? 0)
          ) + 1;

        const { error: optionError } = await supabase
          .from('filter_options')
          .insert([
            {
              group_id: visibleGroup.id,
              name: cleanValue,
              display_order: nextOptionOrder,
            },
          ]);

        if (optionError) throw optionError;
      }

      if (isEditing) {
        setEditingProduct((prev) =>
          prev
            ? {
                ...prev,
                subcategory: cleanValue,
              }
            : prev
        );
        setEditingVisibleFilterName('');
      } else {
        setNewProduct((prev) => ({
          ...prev,
          subcategory: cleanValue,
        }));
        setNewVisibleFilterName('');
      }

      setError(null);
      await loadFilterArchitecture();
      alert('Filtro visível adicionado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar filtro visível');
    }
  };

  const addBrand = async () => {
    const cleanBrandName = newBrand.trim();

    if (!cleanBrandName) {
      setError('Digite o nome da marca');
      return;
    }

    try {
      const { data, error: err } = await supabase
        .from('brands')
        .insert([{ name: cleanBrandName }])
        .select('id, name')
        .single();

      if (err) throw err;

      if (data) {
        setBrands((prev) => {
          const withoutDuplicate = prev.filter(
            (brand) => normalizeFilterName(brand.name) !== normalizeFilterName(data.name)
          );

          return [...withoutDuplicate, data as Brand].sort((a, b) =>
            a.name.localeCompare(b.name, 'pt-BR')
          );
        });
      }

      setNewBrand('');
      setError(null);
      await loadBrands();
      alert('Marca adicionada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar marca');
    }
  };

  const deleteBrand = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta marca?')) return;

    try {
      const { error: err } = await supabase.from('brands').delete().eq('id', id);

      if (err) throw err;
      await loadBrands();
      alert('Marca deletada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar marca');
    }
  };

  const addSubcategory = async () => {
  if (!newSubcategory.category_id || !newSubcategory.name.trim()) {
   setError('Selecione a categoria e informe o nome do filtro');
    return;
  }

  try {
    const selectedCategory = categories.find(
      (cat) => cat.id === newSubcategory.category_id
    );

    const { error: err } = await supabase
      .from('subcategories')
      .insert([
        {
  name: newSubcategory.name.trim(),
  category_id: newSubcategory.category_id
}
      ]);

    if (err) throw err;

    setNewSubcategory({
      category_id: '',
      name: '',
    });

    setError(null);

    await loadSubcategories();

    alert('Filtro adicionado com sucesso!');
 } catch (err) {
  console.error('ERRO SUBCATEGORY:', err);

  setError(
    err instanceof Error
      ? err.message
      : JSON.stringify(err)
  );
}
};

  const loadFilterArchitecture = async () => {
    await loadFilterArchitectureFromSupabase({
      supabase,
      setFilterGroups,
      setFilterOptions,
    });
  };

  const addFilterGroup = async () => {
    await addFilterGroupToSupabase({
      supabase,
      newFilterGroup,
      setNewFilterGroup,
      setError,
      loadFilterArchitecture,
    });
  };

  const addFilterOption = async () => {
    await addFilterOptionToSupabase({
      supabase,
      newFilterOption,
      setNewFilterOption,
      setError,
      loadFilterArchitecture,
    });
  };

  const deleteFilterGroup = async (id: string) => {
    await deleteFilterGroupFromSupabase({
      supabase,
      id,
      setError,
      loadFilterArchitecture,
    });
  };

  const deleteFilterOption = async (id: string) => {
    await deleteFilterOptionFromSupabase({
      supabase,
      id,
      setError,
      loadFilterArchitecture,
    });
  };

  const addTreeFilter = async () => {
    await addTreeFilterToSupabase({
      supabase,
      categories,
      selectedFilterArchitectureCategory,
      newTreeFilterName,
      newTreeFilterOrder,
      filterGroups,
      setNewTreeFilterName,
      setNewTreeFilterOrder,
      setError,
      loadFilterArchitecture,
    });
  };

  const addTreeFilterValue = async (group: FilterGroup) => {
    await addTreeFilterValueToSupabase({
      supabase,
      group,
      newFilterValueByGroup,
      setNewFilterValueByGroup,
      setError,
      loadFilterArchitecture,
    });
  };


  const moveFilterGroup = async (groupIndex: number, direction: 'up' | 'down') => {
    await moveFilterGroupInSupabase({
      filteredFilterGroups,
      groupIndex,
      direction,
      setError,
      loadFilterArchitecture,
    });
  };


  const moveFilterOption = async (
    group: FilterGroup,
    optionIndex: number,
    direction: 'up' | 'down'
  ) => {
    await moveFilterOptionInSupabase({
      group,
      optionIndex,
      direction,
      setError,
      loadFilterArchitecture,
    });
  };

const deleteSubcategory = async (id: string) => {
  if (!confirm('Tem certeza que deseja deletar este filtro?')) return;

  try {
    const { error: err } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', id);

    if (err) throw err;

    await loadSubcategories();

    alert('Filtro deletado com sucesso!');
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Erro ao deletar filtro'
    );
  }
};
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  const newProductPreviewImages = getCombinedImages(newProduct.image_url, newProduct.images);
  const editingProductPreviewImages = editingProduct
    ? getCombinedImages(editingProduct.image_url, editingProduct.images)
    : [];

  const sortedBrands = [...brands].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR')
  );

  const sortedOperationalTypes = [...operationalTypes].sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR')
  );

  const filteredProducts = products
  .filter((product) => {
    const categoryMatch = selectedCategoryFilter
      ? product.category === selectedCategoryFilter
      : true;

    const brandMatch = selectedBrandFilter
      ? product.brand === selectedBrandFilter
      : true;

    return categoryMatch && brandMatch;
  })
  .sort((a, b) => {
    const categoryA = a.category || '';
    const categoryB = b.category || '';

    if (categoryA !== categoryB) {
      return categoryA.localeCompare(categoryB, 'pt-BR');
    }

    const orderA = getProductOrderValue(a);
    const orderB = getProductOrderValue(b);

    if (orderA !== orderB) return orderA - orderB;

    return (a.display_name || a.name || '').localeCompare(
      b.display_name || b.name || '',
      'pt-BR'
    );
  });
const filteredSubcategories = [...subcategories]
  .filter((subcat) =>
    selectedSubcategoryCategoryFilter
      ? subcat.category?.name === selectedSubcategoryCategoryFilter
      : true
  )
 .sort((a, b) => {
  const categoryA = a.category?.name || '';
  const categoryB = b.category?.name || '';

  if (categoryA !== categoryB) {
    return categoryA.localeCompare(categoryB, 'pt-BR');
  }

  return a.name.localeCompare(b.name, 'pt-BR');
});

const filteredFilterGroups = [...filterGroups]
  .filter((group) =>
    selectedFilterArchitectureCategory
      ? group.category?.name === selectedFilterArchitectureCategory
      : true
  )
  .sort((a, b) => {
    const categoryA = a.category?.name || '';
    const categoryB = b.category?.name || '';

    if (categoryA !== categoryB) {
      return categoryA.localeCompare(categoryB, 'pt-BR');
    }

    const orderA = a.display_order ?? 999;
    const orderB = b.display_order ?? 999;

    if (orderA !== orderB) return orderA - orderB;

    return a.name.localeCompare(b.name, 'pt-BR');
  });
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel de Administração</h1>
        <p className="text-gray-600 mb-8">Gerenciar produtos, categorias e marcas</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-1 font-medium text-sm ${
              activeTab === 'products'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500'
            }`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 px-1 font-medium text-sm ${
              activeTab === 'categories'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500'
            }`}
          >
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`pb-3 px-1 font-medium text-sm ${
              activeTab === 'brands'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500'
            }`}
          >
            Marcas
          </button>

<button
  onClick={() => setActiveTab('subcategories')}
  className={`pb-3 px-1 font-medium text-sm ${
    activeTab === 'subcategories'
      ? 'text-gray-900 border-b-2 border-gray-900'
      : 'text-gray-500'
  }`}
>
  Arquitetura de Filtros
</button>
          
        </div>

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Novo Produto</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>

                  <select
  key={`brand-select-${brands.map((b) => b.id).join('-')}`}
  value={newProduct.brand}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        brand: e.target.value,
                        name: buildProductName(e.target.value, prev.model),
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                  >
                    <option value="">Selecione uma marca</option>

                    {sortedBrands.map((brand) => (
                      <option key={brand.id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
                  <input
                    type="text"
                    placeholder="FX3"
                    value={newProduct.model}
                    onChange={(e) => {
                      const model = e.target.value;

                      setNewProduct((prev) => ({
                        ...prev,
                        model,
                        name: buildProductName(prev.brand, model),
                      }));
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome (automático)</label>
                  <input
                    type="text"
                    placeholder="Nome gerado automaticamente"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                  >
                    <option value="">Selecione</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Operacional *</label>
                  <select
                    value={newProduct.operational_type}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        operational_type: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                  >
                    <option value="">Selecione</option>
                    {sortedOperationalTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incluir Tipo Operacional</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: Encoder, Painel LED"
                      value={newOperationalType}
                      onChange={(e) => setNewOperationalType(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={addOperationalType}
                      className="shrink-0 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded"
                    >
                      Incluir
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filtro Visível</label>
                  <select
                    value={newProduct.subcategory}
                    onChange={(e) =>
                      setNewProduct((prev) => ({ ...prev, subcategory: e.target.value }))
                    }
                    disabled={!newProduct.category}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Selecione</option>
                    {newProduct.subcategory &&
                      !newProductVisibleFilters.includes(newProduct.subcategory) && (
                        <option value={newProduct.subcategory}>
                          {newProduct.subcategory}
                        </option>
                      )}
                    {newProductVisibleFilters.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>

                  <p className="mt-1 text-xs text-gray-500">
                    Tipo público exibido no card e na página do produto.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incluir Filtro Visível</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: Refletor, Mirrorless, Cinema"
                      value={newVisibleFilterName}
                      onChange={(e) => setNewVisibleFilterName(e.target.value)}
                      disabled={!newProduct.category}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => addVisibleFilterOption(newProduct.category, newVisibleFilterName)}
                      disabled={!newProduct.category}
                      className="shrink-0 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-medium py-2 px-4 rounded"
                    >
                      Incluir
                    </button>
                  </div>
                </div>

                               <div className="md:col-span-2 rounded border border-amber-200 bg-amber-50/60 p-4">
                  <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">NCM / Fiscal interno</h3>
                      <p className="mt-1 text-xs leading-5 text-gray-600">
                        Campo interno do admin. Não aparece no site público.
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={suggestNcmForNewProduct}
                        className="rounded bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                      >
                        Sugerir NCM
                      </button>

                      <button
                        type="button"
                        onClick={() => newProductNcmInputRef.current?.focus()}
                        className="rounded border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-50"
                      >
                        Inserir manualmente
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">NCM</label>
                      <input
                        ref={newProductNcmInputRef}
                        type="text"
                        placeholder="Ex: 8525.89.29"
                        value={newProductFiscalProfile.ncm}
                        onChange={(e) =>
                          setNewProductFiscalProfile((prev) => ({
                            ...prev,
                            ncm: e.target.value,
                            fiscal_status: e.target.value.trim() ? prev.fiscal_status : 'pending',
                          }))
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GTIN / EAN</label>
                      <input
                        type="text"
                        placeholder="Ex: 7891234567890"
                        value={newProductFiscalProfile.gtin}
                        onChange={(e) =>
                          setNewProductFiscalProfile((prev) => ({
                            ...prev,
                            gtin: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                      <input
                        type="number"
                        step="0.001"
                        placeholder="Ex: 2.350"
                        value={newProductFiscalProfile.weight_kg ?? ''}
                        onChange={(e) =>
                          setNewProductFiscalProfile((prev) => ({
                            ...prev,
                            weight_kg: e.target.value ? Number(e.target.value) : null,
                          }))
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valor Patrimonial (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Ex: 35000"
                        value={newProductFiscalProfile.asset_value ?? ''}
                        onChange={(e) =>
                          setNewProductFiscalProfile((prev) => ({
                            ...prev,
                            asset_value: e.target.value ? Number(e.target.value) : null,
                          }))
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={newProductFiscalProfile.fiscal_status}
                        onChange={(e) =>
                          setNewProductFiscalProfile((prev) => ({
                            ...prev,
                            fiscal_status: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                      >
                        <option value="pending">Pendente</option>
                        <option value="suggested">Sugerido</option>
                        <option value="reviewed">Revisado</option>
                        <option value="approved">Aprovado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {newProduct.category && (
                  <ProductFilterSelector
                    groups={newProductFilterGroups}
                    selectedIds={newProductFilterOptionIds}
                    selectedBrand={newProduct.brand}
                    onOptionToggle={handleProductFilterOptionToggle}
                    isBrandFilterGroup={isBrandFilterGroup}
                  />
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Tags SEO invisíveis
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        generateSeoTagsAndOpenChatGpt(
                          newProduct,
                          newProductFilterOptionIds,
                          false
                        )
                      }
                      className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-500 hover:text-gray-900"
                    >
                      Gerar sugestões no ChatGPT
                    </button>
                  </div>

                  <textarea
                    rows={5}
                    placeholder={`Digite uma intenção de busca por linha.
Ex: lente Sony 14mm
lente ultra grande angular Sony
lente para Sony FX3
lente para astrofotografia`}
                    value={newProduct.seo_tags}
                    onChange={(e) =>
                      setNewProduct((prev) => ({ ...prev, seo_tags: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Uma palavra-chave ou frase por linha. O botão gera até 12 tags automáticas e copia um prompt para até 8 sugestões complementares no ChatGPT.
                  </p>
                </div>


<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Highlights
  </label>

  <textarea
    placeholder="Aplicações, benefícios, diferenciais e contexto de uso do equipamento."
    value={newProduct.specs}
    onChange={(e) =>
      setNewProduct((prev) => ({
        ...prev,
        specs: e.target.value,
      }))
    }
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
    rows={4}
  />
</div>

<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Especificações Técnicas
  </label>

  <textarea
    placeholder="Uma especificação por linha"
    value={newProduct.technical_specs}
    onChange={(e) =>
      setNewProduct((prev) => ({
        ...prev,
        technical_specs: e.target.value,
      }))
    }
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
    rows={4}
  />
</div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">O que acompanha</label>
                  <textarea
                    placeholder="Listar itens inclusos"
                    value={newProduct.includes}
                    onChange={(e) =>
                      setNewProduct((prev) => ({ ...prev, includes: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2 border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newProduct.is_featured}
                        onChange={(e) =>
                          setNewProduct((prev) => ({
                            ...prev,
                            is_featured: e.target.checked,
                            featured_order: e.target.checked ? prev.featured_order : null,
                          }))
                        }
                        className="w-4 h-4 border border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Destaque na Home</span>
                    </label>

                    {newProduct.is_featured && (
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Ordem:</label>
                        <input
                          type="number"
                          placeholder="1"
                          value={newProduct.featured_order ?? ''}
                          onChange={(e) =>
                            setNewProduct((prev) => ({
                              ...prev,
                              featured_order: e.target.value ? Number(e.target.value) : null,
                            }))
                          }
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                        />
                        <span className="text-xs text-gray-500">(menor número aparece primeiro)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagens</label>
                  <div
                    onDragEnter={(e) => handleDragEnter(e, false)}
                    onDragOver={handleDragOver}
                    onDragLeave={(e) => handleDragLeave(e, false)}
                    onDrop={(e) => handleDrop(e, false)}
                    className={`border-2 border-dashed rounded p-6 text-center transition-colors ${
                      isDragOverNewProduct
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleImageUpload(e, false)}
                      disabled={uploadingImage}
                      className="hidden"
                      id="newProductImageInput"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                    />
                    <label htmlFor="newProductImageInput" className="cursor-pointer">
                      <Upload className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {uploadingImage ? 'Enviando...' : 'Arraste imagens ou clique para selecionar'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WebP → padrão LOC7 WebP 2000x2000</p>
                    </label>

                    {newProductPreviewImages.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-4 justify-center">
                        {newProductPreviewImages.map((img, index) => (
                          <div key={`${img}-${index}`} className="relative w-16">
                            <img
                              src={img}
                              alt={`Imagem ${index + 1}`}
                              className="w-16 h-16 object-cover border border-gray-300 rounded"
                            />

                            {index === 0 && (
                              <span className="absolute -top-2 left-0 text-[10px] bg-black text-white px-1.5 py-0.5 rounded">
                                CAPA
                              </span>
                            )}

                            <div className="mt-2 flex justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveImage(index, 'left', false)}
                                className="px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50"
                              >
                                ←
                              </button>
                              <button
                                type="button"
                                onClick={() => moveImage(index, 'right', false)}
                                className="px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50"
                              >
                                →
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(index, false)}
                                className="px-1.5 py-0.5 text-xs border border-red-300 rounded bg-red-50 text-red-600 hover:bg-red-100"
                              >
                                X
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={addProduct}
                className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded flex items-center gap-2"
              >
                <Plus size={16} /> Adicionar Produto
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-end mb-4">
  <div className="w-full md:w-64">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Filtrar por categoria
    </label>

    <select
      value={selectedCategoryFilter}
      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
    >
      <option value="">Todas as categorias</option>

      {categories.map((cat) => (
        <option key={cat.id} value={cat.name}>
          {cat.name}
        </option>
      ))}
    </select>
  </div>

  <div className="w-full md:w-64">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Filtrar por marca
    </label>

    <select
      value={selectedBrandFilter}
      onChange={(e) => setSelectedBrandFilter(e.target.value)}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
    >
      <option value="">Todas as marcas</option>

      {sortedBrands.map((brand) => (
        <option key={brand.id} value={brand.name}>
          {brand.name}
        </option>
      ))}
    </select>
  </div>
</div>

            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Nome</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Marca</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Categoria</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Filtro Visível</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">SEO</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">NCM</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Preço</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Destaque</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Ordem</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                          Nenhum produto cadastrado
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const categoryOrderedProducts = getProductsSortedForCategoryOrder(
                          product.category || '',
                          products
                        );
                        const productOrderIndex = categoryOrderedProducts.findIndex(
                          (item) => item.id === product.id
                        );
                        const isFirstInCategory = productOrderIndex <= 0;
                        const isLastInCategory =
                          productOrderIndex === categoryOrderedProducts.length - 1;

                        return (
                        <tr
                          key={product.id}
                          onDragOver={(e) => {
                            if (draggedCatalogProductId) e.preventDefault();
                          }}
                          onDrop={(e) => handleCatalogProductDrop(e, product)}
                          className={`hover:bg-gray-50 ${
                            draggedCatalogProductId === product.id ? 'opacity-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3 text-gray-900 font-medium">
                            {product.display_name || product.name}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {product.brand || '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {product.category}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {product.subcategory || '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {countSeoTags((product as ProductWithImages).seo_tags || product.badge || '') > 0 ? (
                              <span className="whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                {countSeoTags((product as ProductWithImages).seo_tags || product.badge || '')} tags
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {product.fiscal_ncm ? (
                              <span className="whitespace-nowrap rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                                {product.fiscal_ncm}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-900">
                            R$ {formatPrice(product.price)}
                          </td>
                          <td className="px-4 py-3">
                            {product.is_featured ? (
                              <span className="text-sm text-gray-900 font-medium">Sim</span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-900">
                            <div className="flex items-center gap-2">
                              <span
                                draggable={Boolean(product.category)}
                                onDragStart={(e) => {
                                  setDraggedCatalogProductId(product.id);
                                  e.dataTransfer.effectAllowed = 'move';
                                  e.dataTransfer.setData('text/plain', product.id);
                                }}
                                onDragEnd={() => setDraggedCatalogProductId(null)}
                                className="inline-flex h-7 w-7 cursor-grab items-center justify-center rounded text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 active:cursor-grabbing"
                                title="Arraste para reorganizar a ordem dentro da categoria"
                              >
                                <GripVertical size={16} />
                              </span>

                              <span className="min-w-[28px] text-sm font-semibold text-gray-900">
                                {product.catalog_order ?? '—'}
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => moveProductInCatalogOrder(product, 'up')}
                                  disabled={isFirstInCategory}
                                  className="p-1 hover:bg-gray-200 rounded disabled:cursor-not-allowed disabled:opacity-30"
                                  title="Mover produto para cima"
                                >
                                  <ArrowUp size={15} className="text-gray-600" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => moveProductInCatalogOrder(product, 'down')}
                                  disabled={isLastInCategory}
                                  className="p-1 hover:bg-gray-200 rounded disabled:cursor-not-allowed disabled:opacity-30"
                                  title="Mover produto para baixo"
                                >
                                  <ArrowDown size={15} className="text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditProduct(product)}
                                className="p-1 hover:bg-gray-200 rounded"
                                title="Editar"
                              >
                                <Edit2 size={16} className="text-gray-600" />
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="p-1 hover:bg-gray-200 rounded"
                                title="Deletar"
                              >
                                <Trash2 size={16} className="text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nova Categoria</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    color: '#111827',
                    backgroundColor: '#ffffff',
                    WebkitTextFillColor: '#111827',
                    caretColor: '#111827',
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-400"
                />
                <button
                  onClick={addCategory}
                  className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded flex items-center gap-2"
                >
                  <Plus size={16} /> Adicionar
                </button>
              </div>
            </div>

            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Categoria</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">SEO Editorial</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                          Nenhuma categoria cadastrada
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat) => {
                        const hasCategorySeo = Boolean(
                          cat.seo_title?.trim() &&
                            cat.seo_description?.trim() &&
                            cat.seo_applications?.trim() &&
                            cat.seo_meta_description?.trim()
                        );

                        return (
                          <tr key={cat.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-900 font-medium">{cat.name}</td>
                            <td className="px-4 py-3">
                              {hasCategorySeo ? (
                                <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                  Completo
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openCategorySeoEditor(cat)}
                                  className="p-1 hover:bg-gray-200 rounded"
                                  title="Editar SEO da categoria"
                                >
                                  <Edit2 size={16} className="text-gray-600" />
                                </button>

                                <button
                                  onClick={() => deleteCategory(cat.id)}
                                  className="p-1 hover:bg-gray-200 rounded"
                                  title="Deletar"
                                >
                                  <Trash2 size={16} className="text-gray-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {showCategorySeoModal && editingCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">SEO da Categoria</h2>
                  <p className="text-sm text-gray-500 mt-1">{editingCategory.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategorySeoModal(false);
                    setEditingCategory(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={updateCategorySeo} className="p-6 space-y-5">
                <div className="rounded border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">Template editorial LOC7</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Estes campos alimentam a página da categoria, meta description, Open Graph e JSON-LD. Use texto editorial, discreto e sem excesso promocional.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={editingCategory.seo_title || ''}
                    onChange={(e) =>
                      setEditingCategory((prev) =>
                        prev ? { ...prev, seo_title: e.target.value } : prev
                      )
                    }
                    placeholder="Ex: Câmeras"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Título editorial exibido na categoria e usado como base semântica.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Editorial</label>
                  <textarea
                    rows={5}
                    value={editingCategory.seo_description || ''}
                    onChange={(e) =>
                      setEditingCategory((prev) =>
                        prev ? { ...prev, seo_description: e.target.value } : prev
                      )
                    }
                    placeholder="Locação de câmeras profissionais para cinema, broadcast, fotografia..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aplicações</label>
                  <textarea
                    rows={3}
                    value={editingCategory.seo_applications || ''}
                    onChange={(e) =>
                      setEditingCategory((prev) =>
                        prev ? { ...prev, seo_applications: e.target.value } : prev
                      )
                    }
                    placeholder="Cinema • Fotografia • Broadcast • Publicidade • Streaming"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use microdots para manter leitura editorial e discreta.
                  </p>
                </div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Marcas
  </label>

  <textarea
    rows={2}
    value={editingCategory.seo_brands || ''}
    onChange={(e) =>
      setEditingCategory((prev) =>
        prev
          ? {
              ...prev,
              seo_brands: e.target.value,
            }
          : prev
      )
    }
    placeholder="Sony • ARRI • RED • Blackmagic • Canon • Nikon • Fujifilm"
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
  />

  <p className="mt-1 text-xs text-gray-500">
    Marcas estratégicas exibidas na página da categoria.
  </p>
</div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={editingCategory.seo_meta_description || ''}
                    onChange={(e) =>
                      setEditingCategory((prev) =>
                        prev ? { ...prev, seo_meta_description: e.target.value } : prev
                      )
                    }
                    placeholder="Resumo para Google e compartilhamento. Ideal entre 140 e 160 caracteres."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Campo interno. Não aparece no layout da categoria como texto visível.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategorySeoModal(false);
                      setEditingCategory(null);
                    }}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white rounded"
                  >
                    Salvar SEO
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'brands' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nova Marca</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nome da marca"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  style={{
                    color: '#111827',
                    backgroundColor: '#ffffff',
                    WebkitTextFillColor: '#111827',
                    caretColor: '#111827',
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-gray-400"
                />
                <button
                  onClick={addBrand}
                  className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded flex items-center gap-2"
                >
                  <Plus size={16} /> Adicionar
                </button>
              </div>
            </div>

            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Marca</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {brands.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                          Nenhuma marca cadastrada
                        </td>
                      </tr>
                    ) : (
                      sortedBrands.map((brand) => (
                        <tr key={brand.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">{brand.name}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteBrand(brand.id)}
                              className="p-1 hover:bg-gray-200 rounded"
                              title="Deletar"
                            >
                              <Trash2 size={16} className="text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
                       )}
      </div>

        {activeTab === 'subcategories' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Configurar filtros do catálogo
              </h2>

              <p className="text-sm text-gray-600 mb-6">
                Escolha uma categoria e configure os filtros na mesma lógica da árvore oficial.
              </p>

              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>

                <select
                  value={selectedFilterArchitectureCategory}
                  onChange={(e) => {
                    setSelectedFilterArchitectureCategory(e.target.value);
                    setNewTreeFilterName('');
                    setNewTreeFilterOrder('');
                  }}
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="">Selecione uma categoria</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!selectedFilterArchitectureCategory ? (
              <div className="bg-white rounded border border-gray-200 px-4 py-10 text-center">
                <p className="text-sm font-medium text-gray-900">
                  Selecione uma categoria para configurar seus filtros.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Os blocos e valores aparecerão aqui seguindo a ordem da árvore.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-white p-6 rounded border border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Categoria selecionada
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900 mt-1">
                        {selectedFilterArchitectureCategory}
                      </h3>
                    </div>

                    <div className="text-sm text-gray-500">
                      {filteredFilterGroups.length} filtro(s) configurado(s)
                    </div>
                  </div>

                  {filteredFilterGroups.length === 0 ? (
                    <div className="rounded border border-dashed border-gray-300 p-6 text-center">
                      <p className="text-sm font-medium text-gray-900">
                        Nenhum filtro configurado para esta categoria.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Crie o primeiro filtro no bloco abaixo.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredFilterGroups.map((group, index) => (
                        <div
                          key={group.id}
                          className="rounded border border-gray-200 bg-gray-50 overflow-hidden"
                        >
                          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-white">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-500">
                                  #{group.display_order ?? 0}
                                </span>
                                <h4 className="text-sm font-semibold text-gray-900 truncate">
                                  {group.name}
                                </h4>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveFilterGroup(index, 'up')}
                                disabled={index === 0}
                                className="p-1 hover:bg-gray-100 rounded disabled:cursor-not-allowed disabled:opacity-30"
                                title="Mover filtro para cima"
                              >
                                <ArrowUp size={16} className="text-gray-600" />
                              </button>

                              <button
                                type="button"
                                onClick={() => moveFilterGroup(index, 'down')}
                                disabled={index === filteredFilterGroups.length - 1}
                                className="p-1 hover:bg-gray-100 rounded disabled:cursor-not-allowed disabled:opacity-30"
                                title="Mover filtro para baixo"
                              >
                                <ArrowDown size={16} className="text-gray-600" />
                              </button>

                              <button
                                onClick={() => deleteFilterGroup(group.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Deletar filtro"
                              >
                                <Trash2 size={16} className="text-gray-600" />
                              </button>
                            </div>
                          </div>

                          <div className="p-4 space-y-4">
                            {group.options && group.options.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {group.options.map((option, optionIndex) => (
                                  <div
                                    key={option.id}
                                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800"
                                  >
                                    <span className="text-xs text-gray-400">
                                      #{option.display_order ?? 0}
                                    </span>
                                    <span>{option.name}</span>

                                    <div className="ml-1 flex items-center gap-0.5">
                                      <button
                                        type="button"
                                        onClick={() => moveFilterOption(group, optionIndex, 'up')}
                                        disabled={optionIndex === 0}
                                        className="text-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-25"
                                        title="Mover valor para cima"
                                      >
                                        <ArrowUp size={12} />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => moveFilterOption(group, optionIndex, 'down')}
                                        disabled={optionIndex === (group.options || []).length - 1}
                                        className="text-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-25"
                                        title="Mover valor para baixo"
                                      >
                                        <ArrowDown size={12} />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => deleteFilterOption(option.id)}
                                        className="text-gray-400 hover:text-gray-900"
                                        title="Deletar valor"
                                      >
                                        <X size={13} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                Nenhum valor cadastrado neste filtro.
                              </p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                placeholder="Adicionar valor"
                                value={newFilterValueByGroup[group.id] || ''}
                                onChange={(e) =>
                                  setNewFilterValueByGroup((prev) => ({
                                    ...prev,
                                    [group.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addTreeFilterValue(group);
                                  }
                                }}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                              />

                              <button
                                type="button"
                                onClick={() => addTreeFilterValue(group)}
                                className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded flex items-center justify-center gap-2"
                              >
                                <Plus size={16} />
                                Adicionar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Criar novo filtro nesta categoria
                  </h3>

                  <p className="text-sm text-gray-500 mb-4">
                    Use apenas quando a árvore oficial precisar de um novo bloco de filtro.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_auto] gap-3">
                    <input
                      type="text"
                      placeholder="Nome do filtro"
                      value={newTreeFilterName}
                      onChange={(e) => setNewTreeFilterName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                    />

                    <input
                      type="number"
                      placeholder="Ordem"
                      value={newTreeFilterOrder}
                      onChange={(e) =>
                        setNewTreeFilterOrder(
                          e.target.value ? Number(e.target.value) : ''
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={addTreeFilter}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Criar filtro
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Editar Produto</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                  setEditingFiscalProfile(getEmptyFiscalProfile());
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={updateProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev ? { ...prev, name: e.target.value } : prev
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      setEditingProduct((prev) =>
                        prev ? { ...prev, category: e.target.value, subcategory: '' } : prev
                      );
                      setEditingProductFilterOptionIds([]);
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                  >
                    <option value="">Selecione</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Operacional</label>
                  <select
                    value={editingProduct.operational_type || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev
                          ? {
                              ...prev,
                              operational_type: e.target.value,
                            }
                          : prev
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                  >
                    <option value="">Selecione</option>
                    {sortedOperationalTypes.map((type) => (
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>

<select
  key={`edit-brand-${brands.length}`}
  value={editingProduct.brand || ''}
  onChange={(e) =>
    setEditingProduct((prev) =>
      prev
        ? {
            ...prev,
            brand: e.target.value,
          }
        : prev
    )
  }
  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
>
  <option value="">Selecione uma marca</option>

  {sortedBrands.map((brand) => (
    <option key={brand.id} value={brand.name}>
      {brand.name}
    </option>
  ))}
</select>
                
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filtro Visível</label>
                  <select
                    value={editingProduct.subcategory || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev ? { ...prev, subcategory: e.target.value } : prev
                      )
                    }
                    disabled={!editingProduct.category}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Selecione</option>
                    {editingProduct.subcategory &&
                      !editingProductVisibleFilters.includes(editingProduct.subcategory) && (
                        <option value={editingProduct.subcategory}>
                          {editingProduct.subcategory}
                        </option>
                      )}
                    {editingProductVisibleFilters.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>

                  <p className="mt-1 text-xs text-gray-500">
                    Tipo público exibido no card e na página do produto.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incluir Filtro Visível</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: Refletor, Mirrorless, Cinema"
                      value={editingVisibleFilterName}
                      onChange={(e) => setEditingVisibleFilterName(e.target.value)}
                      disabled={!editingProduct.category}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => addVisibleFilterOption(editingProduct.category, editingVisibleFilterName, true)}
                      disabled={!editingProduct.category}
                      className="shrink-0 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-medium py-2 px-4 rounded"
                    >
                      Incluir
                    </button>
                  </div>
                </div>

                {editingProduct.category &&
                  (loadingEditingProductFilters ? (
                    <div className="md:col-span-2 rounded border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                      Carregando filtros relacionados do produto...
                    </div>
                  ) : (
                    <ProductFilterSelector
                      groups={editingProductFilterGroups}
                      selectedIds={editingProductFilterOptionIds}
                      selectedBrand={editingProduct.brand || ''}
                      isEditing
                      onOptionToggle={handleProductFilterOptionToggle}
                      isBrandFilterGroup={isBrandFilterGroup}
                    />
                  ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : prev
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Tags SEO invisíveis
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        generateSeoTagsAndOpenChatGpt(
                          editingProduct,
                          editingProductFilterOptionIds,
                          true
                        )
                      }
                      className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-500 hover:text-gray-900"
                    >
                      Gerar sugestões no ChatGPT
                    </button>
                  </div>

                  <textarea
                    rows={5}
                    placeholder={`Digite uma intenção de busca por linha.
Ex: lente Sony 14mm
lente ultra grande angular Sony
lente para Sony FX3
lente para astrofotografia`}
                    value={(editingProduct as ProductWithImages).seo_tags || editingProduct.badge || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev ? { ...prev, seo_tags: e.target.value } : prev
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Uma palavra-chave ou frase por linha. O botão gera até 12 tags automáticas e copia um prompt para até 8 sugestões complementares no ChatGPT.
                  </p>
                </div>


<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Highlights
  </label>

  <textarea
    value={editingProduct.specs || ''}
    onChange={(e) =>
      setEditingProduct((prev) =>
        prev
          ? {
              ...prev,
              specs: e.target.value,
            }
          : prev
      )
    }
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
    rows={4}
  />
</div>

<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Especificações Técnicas
  </label>

  <textarea
    value={editingProduct.technical_specs || ''}
    onChange={(e) =>
      setEditingProduct((prev) =>
        prev
          ? {
              ...prev,
              technical_specs: e.target.value,
            }
          : prev
      )
    }
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
    rows={4}
  />
</div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">O que acompanha</label>
                  <textarea
                    value={editingProduct.includes || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev ? { ...prev, includes: e.target.value } : prev
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                    rows={2}
                  />
                </div>

                               <div className="md:col-span-2 border-t border-gray-200 pt-5">
                  <div className="mb-4 rounded border border-amber-200 bg-amber-50 px-4 py-3">
                    <h3 className="text-sm font-semibold text-gray-900">Fiscal / Remessa</h3>
                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      Dados internos para emissão de nota de remessa. Não aparecem no catálogo público.
                    </p>
                  </div>

                  {loadingEditingFiscalProfile ? (
                    <div className="rounded border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                      Carregando dados fiscais do produto...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código fiscal interno</label>
                        <input
                          type="text"
                          placeholder="Ex: CAM-SON-FX6"
                          value={editingFiscalProfile.fiscal_code}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              fiscal_code: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <label className="block text-sm font-medium text-gray-700">NCM</label>
                          <button
                            type="button"
                            onClick={suggestNcmForEditingProduct}
                            className="rounded bg-gray-900 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-gray-800"
                          >
                            Sugerir NCM
                          </button>
                        </div>
                        <input
                          ref={editingNcmInputRef}
                          type="text"
                          placeholder="Ex: 8525.89.29"
                          value={editingFiscalProfile.ncm}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              ncm: e.target.value,
                              fiscal_status: e.target.value.trim() ? prev.fiscal_status : 'pending',
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GTIN / EAN</label>
                        <input
                          type="text"
                          placeholder="Ex: 7891234567890"
                          value={editingFiscalProfile.gtin}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              gtin: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                        <input
                          type="number"
                          step="0.001"
                          placeholder="Ex: 2.350"
                          value={editingFiscalProfile.weight_kg ?? ''}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              weight_kg: e.target.value ? Number(e.target.value) : null,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor Patrimonial (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Ex: 35000"
                          value={editingFiscalProfile.asset_value ?? ''}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              asset_value: e.target.value ? Number(e.target.value) : null,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição fiscal</label>
                        <input
                          type="text"
                          placeholder="Ex: Câmera Sony FX6"
                          value={editingFiscalProfile.fiscal_description}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              fiscal_description: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fonte do NCM</label>
                        <input
                          type="text"
                          placeholder="Ex: Receita Federal / TIPI / Classif"
                          value={editingFiscalProfile.ncm_source}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              ncm_source: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL da fonte</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={editingFiscalProfile.ncm_source_url}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              ncm_source_url: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confiança da classificação</label>
                        <select
                          value={editingFiscalProfile.ncm_confidence}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              ncm_confidence: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                        >
                          <option value="pending">Pendente</option>
                          <option value="low">Baixa</option>
                          <option value="medium">Média</option>
                          <option value="high">Alta</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status fiscal</label>
                        <select
                          value={editingFiscalProfile.fiscal_status}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              fiscal_status: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                        >
                          <option value="pending">Pendente</option>
                          <option value="suggested">Sugerido</option>
                          <option value="reviewed">Revisado</option>
                          <option value="approved">Aprovado</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Base da classificação</label>
                        <textarea
                          placeholder="Descreva o raciocínio usado para o NCM, fonte consultada ou regra interna LOC7."
                          value={editingFiscalProfile.ncm_basis}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              ncm_basis: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                          rows={3}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações internas</label>
                        <textarea
                          placeholder="Observações fiscais, dúvidas, pendências ou validações futuras."
                          value={editingFiscalProfile.notes}
                          onChange={(e) =>
                            setEditingFiscalProfile((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                          rows={2}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingFiscalProfile.reviewed || false}
                            onChange={(e) =>
                              setEditingFiscalProfile((prev) => ({
                                ...prev,
                                reviewed: e.target.checked,
                                fiscal_status: e.target.checked ? 'reviewed' : prev.fiscal_status,
                              }))
                            }
                            className="w-4 h-4 border border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">Marcar como revisado</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_featured || false}
                        onChange={(e) =>
                          setEditingProduct((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  is_featured: e.target.checked,
                                  featured_order: e.target.checked ? prev.featured_order : null,
                                }
                              : prev
                          )
                        }
                        className="w-4 h-4 border border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Destaque na Home</span>
                    </label>

                    {editingProduct.is_featured && (
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Ordem:</label>
                        <input
                          type="number"
                          placeholder="1"
                          value={editingProduct.featured_order ?? ''}
                          onChange={(e) =>
                            setEditingProduct((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    featured_order: e.target.value ? Number(e.target.value) : null,
                                  }
                                : prev
                            )
                          }
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                        />
                        <span className="text-xs text-gray-500">(menor número aparece primeiro)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagens</label>
                  <div
                    onDragEnter={(e) => handleDragEnter(e, true)}
                    onDragOver={handleDragOver}
                    onDragLeave={(e) => handleDragLeave(e, true)}
                    onDrop={(e) => handleDrop(e, true)}
                    className={`border-2 border-dashed rounded p-6 text-center transition-colors ${
                      isDragOverEditProduct
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleImageUpload(e, true)}
                      disabled={uploadingImage}
                      className="hidden"
                      id="editProductImageInput"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                    />
                    <label htmlFor="editProductImageInput" className="cursor-pointer">
                      <Upload className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {uploadingImage ? 'Enviando...' : 'Arraste imagens ou clique para selecionar'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WebP → padrão LOC7 WebP 2000x2000</p>
                    </label>

                    {editingProductPreviewImages.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-4 justify-center">
                        {editingProductPreviewImages.map((img, index) => (
                          <div key={`${img}-${index}`} className="relative w-16">
                            <img
                              src={img}
                              alt={`Imagem ${index + 1}`}
                              className="w-16 h-16 object-cover border border-gray-300 rounded"
                            />

                            {index === 0 && (
                              <span className="absolute -top-2 left-0 text-[10px] bg-black text-white px-1.5 py-0.5 rounded">
                                CAPA
                              </span>
                            )}

                            <div className="mt-2 flex justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => moveImage(index, 'left', true)}
                                className="px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50"
                              >
                                ←
                              </button>
                              <button
                                type="button"
                                onClick={() => moveImage(index, 'right', true)}
                                className="px-1.5 py-0.5 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50"
                              >
                                →
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(index, true)}
                                className="px-1.5 py-0.5 text-xs border border-red-300 rounded bg-red-50 text-red-600 hover:bg-red-100"
                              >
                                X
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={savingFiscalProfile}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingFiscalProfile ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    setEditingProductFilterOptionIds([]);
                    setEditingFiscalProfile(getEmptyFiscalProfile());
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
