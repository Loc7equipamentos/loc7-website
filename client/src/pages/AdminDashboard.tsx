import { useState, useEffect } from 'react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { Trash2, Plus, Edit2, X, Upload, Loader } from 'lucide-react';

type ProductWithImages = Product & {
  images?: string[] | null;
  includes?: string | null;
  catalog_order?: number | null;
  is_featured?: boolean | null;
  featured_order?: number | null
  brand?: string | null;
};

type Brand = {
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
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
    subcategory: '',
    price: 0,
    description: '',
    specs: '',
    includes: '',
    image_url: '',
    images: [] as string[],
    brand: '',
    model: '',
    badge: '',
    catalog_order: null as number | null,
    is_featured: false,
    featured_order: null as number | null,
  });

  const [newCategory, setNewCategory] = useState('');
  const [newBrand, setNewBrand] = useState('');
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

  const buildProductName = (brand: string, model: string) => {
    return [brand?.trim(), model?.trim()]
      .filter(Boolean)
      .join(' ')
      .trim();
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadBrands();
    loadSubcategories();
    loadFilterArchitecture();
  }, []);

  useEffect(() => {
    setNewProduct((prev) => ({ ...prev, subcategory: '' }));
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

  const getSubcategoriesForCategory = (categoryName: string) => {
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



  const newProductSubcategories = getSubcategoriesForCategory(newProduct.category);
  const editingProductSubcategories = editingProduct
    ? getSubcategoriesForCategory(editingProduct.category)
    : [];

  const getCombinedImages = (imageUrl?: string | null, images?: string[] | null) => {
    return [imageUrl, ...(images || [])].filter(Boolean) as string[];
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

      setProducts(sortedProducts);
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
      setCategories(data || []);
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

    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file) continue;

      try {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('Formato inválido. Use JPG, PNG ou WebP.');
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new Error('Arquivo muito grande (máximo 10MB)');
        }

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
        }

        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        alert(`Erro ao fazer upload: ${errorMessage}`);
        setError(errorMessage);
      }
    }

    setUploadingImage(false);

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

    alert(`${uploadedUrls.length} imagem(ns) enviada(s) com sucesso!`);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing: boolean = false
  ) => {
    const files = e.target.files;
    if (!files) return;
    await processFiles(files, isEditing);
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
      !newProduct.category
    ) {
      setError('Preencha marca, modelo, nome e categoria');
      return;
    }

    try {
      const slug = await generateUniqueSlug(newProduct.name);

      const { error: err } = await supabase.from('products').insert([
        {
          name: newProduct.name.trim(),
          category: newProduct.category,
          subcategory: normalizeSubcategory(newProduct.subcategory) || null,
          brand: newProduct.brand.trim() || null,
          price: newProduct.price || 0,
          description: newProduct.description,
          specs: newProduct.specs.trim() || null,
          includes: newProduct.includes.trim() || null,
          image_url: newProduct.image_url || null,
          images: newProduct.images.length > 0 ? newProduct.images : null,
          badge: newProduct.badge || null,
          slug,
          catalog_order: newProduct.catalog_order || null,
          is_featured: newProduct.is_featured,
          featured_order: newProduct.is_featured ? newProduct.featured_order : null,
        },
      ]);

      if (err) throw err;

      setNewProduct({
        name: '',
        category: '',
        subcategory: '',
        price: 0,
        description: '',
        specs: '',
        includes: '',
        image_url: '',
        images: [],
        brand: '',
        model: '',
        badge: '',
        catalog_order: null,
        is_featured: false,
        featured_order: null,
      });
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

      const { error: err } = await supabase
        .from('products')
        .update({
          name: editingProduct.name.trim(),
          category: editingProduct.category,
          subcategory: normalizeSubcategory(editingProduct.subcategory) || null,
          brand: editingProduct.brand?.trim() || null,
          price: editingProduct.price,
          description: editingProduct.description,
          specs: editingProduct.specs?.trim() || null,
          includes: editingProduct.includes?.trim() || null,
          image_url: editingProduct.image_url || null,
          images:
            editingProduct.images && editingProduct.images.length > 0
              ? editingProduct.images
              : null,
          badge: editingProduct.badge || null,
          slug,
          catalog_order: editingProduct.catalog_order || null,
          is_featured: editingProduct.is_featured,
          featured_order: editingProduct.is_featured ? editingProduct.featured_order : null,
        })
        .eq('id', editingProduct.id);

      if (err) throw err;

      setShowEditModal(false);
      setEditingProduct(null);
      await loadProducts();
      alert('Produto atualizado com sucesso!');
    } catch (err) {
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

  const addBrand = async () => {
    if (!newBrand.trim()) {
      setError('Digite o nome da marca');
      return;
    }

    try {
      const { error: err } = await supabase.from('brands').insert([{ name: newBrand.trim() }]);

      if (err) throw err;
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
  try {

 const { data: groupsData, error: groupsError } = await supabase
.from('filter_groups')
.select(`
  *,
  category:categories!filter_groups_category_id_fkey (
    id,
    name
  )
`)
.order('display_order', { ascending: true });

      if (groupsError) throw groupsError;

      const { data: optionsData, error: optionsError } = await supabase
        .from('filter_options')
        .select('*')
        .order('display_order', { ascending: true });

      if (optionsError) throw optionsError;

      const groups = ((groupsData as FilterGroup[]) || []).map((group) => ({
        ...group,
        options: ((optionsData as FilterOption[]) || [])
          .filter((option) => option.group_id === group.id)
          .sort((a, b) => {
            const orderA = a.display_order ?? 999;
            const orderB = b.display_order ?? 999;

            if (orderA !== orderB) return orderA - orderB;

            return a.name.localeCompare(b.name, 'pt-BR');
          }),
      }));

      setFilterGroups(groups);
      setFilterOptions((optionsData as FilterOption[]) || []);
    } catch (err) {
      console.error('Erro ao carregar arquitetura de filtros:', err);
    }
  };

  const addFilterGroup = async () => {
    if (!newFilterGroup.category_id || !newFilterGroup.name.trim()) {
      setError('Selecione a categoria e informe o nome do grupo');
      return;
    }

    try {
      const { error: err } = await supabase
        .from('filter_groups')
        .insert([
          {
            category_id: newFilterGroup.category_id,
            name: newFilterGroup.name.trim(),
            display_order: newFilterGroup.display_order || 0,
          },
        ]);

      if (err) throw err;

      setNewFilterGroup({
        category_id: '',
        name: '',
        display_order: 0,
      });
      setError(null);
      await loadFilterArchitecture();
      alert('Grupo de filtro adicionado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar grupo');
    }
  };

  const addFilterOption = async () => {
    if (!newFilterOption.group_id || !newFilterOption.name.trim()) {
      setError('Selecione o grupo e informe o nome da opção');
      return;
    }

    try {
      const { error: err } = await supabase
        .from('filter_options')
        .insert([
          {
            group_id: newFilterOption.group_id,
            name: newFilterOption.name.trim(),
            display_order: newFilterOption.display_order || 0,
          },
        ]);

      if (err) throw err;

      setNewFilterOption({
        group_id: '',
        name: '',
        display_order: 0,
      });
      setError(null);
      await loadFilterArchitecture();
      alert('Opção de filtro adicionada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar opção');
    }
  };

  const deleteFilterGroup = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este grupo e suas opções?')) return;

    try {
      const { error: err } = await supabase
        .from('filter_groups')
        .delete()
        .eq('id', id);

      if (err) throw err;

      await loadFilterArchitecture();
      alert('Grupo deletado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar grupo');
    }
  };

  const deleteFilterOption = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta opção?')) return;

    try {
      const { error: err } = await supabase
        .from('filter_options')
        .delete()
        .eq('id', id);

      if (err) throw err;

      await loadFilterArchitecture();
      alert('Opção deletada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar opção');
    }
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

  const filteredProducts = products.filter((product) => {
  const categoryMatch = selectedCategoryFilter
    ? product.category === selectedCategoryFilter
    : true;

  const brandMatch = selectedBrandFilter
    ? product.brand === selectedBrandFilter
    : true;

  return categoryMatch && brandMatch;
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

                    {brands.map((brand) => (
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
                    {newProductSubcategories.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags invisíveis</label>
                  <input
                    type="text"
                    placeholder="Ex: wireless, fullframe, broadcast"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordem no Catálogo</label>
                  <input
                    type="number"
                    placeholder="1, 2, 3..."
                    value={newProduct.catalog_order ?? ''}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        catalog_order: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                  />
                </div>


<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Specs
  </label>

  <textarea
    placeholder="Uma spec por linha"
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
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WebP (máx 10MB)</p>
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

      {brands.map((brand) => (
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
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Preço</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Destaque</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Ordem</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          Nenhum produto cadastrado
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">
                            {product.name}
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
                            {product.featured_order !== null && product.featured_order !== undefined
                              ? product.featured_order
                              : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowEditModal(true);
                                }}
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
                      ))
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
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                          Nenhuma categoria cadastrada
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">{cat.name}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteCategory(cat.id)}
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
                      brands.map((brand) => (
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
                Arquitetura de Filtros
              </h2>

              <p className="text-sm text-gray-600 mb-6">
                Controle os blocos de filtros, opções e ordem oficial por categoria.
              </p>

              <div className="mb-6 max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Configurar categoria
                </label>

                <select
                  value={selectedFilterArchitectureCategory}
                  onChange={(e) => setSelectedFilterArchitectureCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="">Todas as categorias</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded border border-gray-200 p-4 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Novo Filtro
                  </h3>

                  <div className="space-y-3">
                    <select
                      value={newFilterGroup.category_id}
                      onChange={(e) =>
                        setNewFilterGroup((prev) => ({
                          ...prev,
                          category_id: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                    >
                      <option value="">Selecione a categoria</option>

                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Ex.: Tela, Marca, Uso"
                      value={newFilterGroup.name}
                      onChange={(e) =>
                        setNewFilterGroup((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                    />

                    <input
                      type="number"
                      placeholder="Exibição do filtro"
                      value={newFilterGroup.display_order || ''}
                      onChange={(e) =>
                        setNewFilterGroup((prev) => ({
                          ...prev,
                          display_order: e.target.value ? Number(e.target.value) : 0,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                    />

                    <button
                      onClick={addFilterGroup}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded flex items-center gap-2"
                    >
                      <Plus size={16} /> Adicionar Grupo
                    </button>
                  </div>
                </div>

                <div className="rounded border border-gray-200 p-4 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Adicionar valores ao filtro
                  </h3>

                  <div className="space-y-3">
                    <select
                      value={newFilterOption.group_id}
                      onChange={(e) =>
                        setNewFilterOption((prev) => ({
                          ...prev,
                          group_id: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                    >
                      <option value="">Escolha o filtro</option>

                      {filterGroups
                        .filter((group) =>
                          selectedFilterArchitectureCategory
                            ? group.category?.name === selectedFilterArchitectureCategory
                            : true
                        )
                        .sort((a, b) => {
                          const categoryCompare = (a.category?.name || '').localeCompare(
                            b.category?.name || '',
                            'pt-BR'
                          );

                          if (categoryCompare !== 0) return categoryCompare;

                          const orderA = a.display_order ?? 999;
                          const orderB = b.display_order ?? 999;

                          if (orderA !== orderB) return orderA - orderB;

                          return a.name.localeCompare(b.name, 'pt-BR');
                        })
                        .map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.category?.name || '-'} / {group.name}
                          </option>
                        ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Ex.: 19", Atomos, Produção"
                      value={newFilterOption.name}
                      onChange={(e) =>
                        setNewFilterOption((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                    />

                    <input
                      type="number"
                      placeholder="Ordem do valor"
                      value={newFilterOption.display_order || ''}
                      onChange={(e) =>
                        setNewFilterOption((prev) => ({
                          ...prev,
                          display_order: e.target.value ? Number(e.target.value) : 0,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900 placeholder:text-gray-400"
                    />

                    <button
                      onClick={addFilterOption}
                      className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded flex items-center gap-2"
                    >
                      <Plus size={16} /> Adicionar Valor
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {filteredFilterGroups.length === 0 ? (
                <div className="bg-white rounded border border-gray-200 px-4 py-8 text-center text-gray-500 text-sm">
                  Nenhum grupo de filtro encontrado.
                </div>
              ) : (
                filteredFilterGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-white rounded border border-gray-200 overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                          {group.category?.name || 'Sem categoria'}
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-gray-900">
                          {group.name}
                        </h3>
                      </div>

                      <button
                        onClick={() => deleteFilterGroup(group.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Deletar grupo"
                      >
                        <Trash2 size={16} className="text-gray-600" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-white border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">
                              Ordem
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">
                              Opção
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">
                              Ações
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                          {group.options && group.options.length > 0 ? (
                            group.options.map((option) => (
                              <tr key={option.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-600 w-24">
                                  #{option.display_order ?? 0}
                                </td>
                                <td className="px-4 py-3 text-gray-900 font-medium">
                                  {option.name}
                                </td>
                                <td className="px-4 py-3 w-24">
                                  <button
                                    onClick={() => deleteFilterOption(option.id)}
                                    className="p-1 hover:bg-gray-200 rounded"
                                    title="Deletar opção"
                                  >
                                    <Trash2 size={16} className="text-gray-600" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-6 text-center text-gray-500"
                              >
                                Nenhuma opção cadastrada neste grupo.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
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
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev ? { ...prev, category: e.target.value } : prev
                      )
                    }
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
                 <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>

<select
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

  {brands.map((brand) => (
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
                    {editingProductSubcategories.map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags invisíveis</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev ? { ...prev, badge: e.target.value } : prev
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordem no Catálogo</label>
                  <input
                    type="number"
                    value={editingProduct.catalog_order ?? ''}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev
                          ? {
                              ...prev,
                              catalog_order: e.target.value ? Number(e.target.value) : null,
                            }
                          : prev
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-900"
                  />
                </div>

              

<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Specs
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
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WebP (máx 10MB)</p>
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
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
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
