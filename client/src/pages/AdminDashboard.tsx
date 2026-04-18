import { useState, useEffect } from 'react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { Trash2, Plus, Edit2, X, Upload, Loader, Package, FolderOpen } from 'lucide-react';

type ProductWithImages = Product & {
  images?: string[] | null;
  includes?: string | null;
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  const [editingProduct, setEditingProduct] = useState<ProductWithImages | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragOverNewProduct, setIsDragOverNewProduct] = useState(false);
  const [isDragOverEditProduct, setIsDragOverEditProduct] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: 0,
    description: '',
    includes: '',
    image_url: '',
    images: [] as string[],
    badge: '',
  });

  const [newCategory, setNewCategory] = useState('');

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    setNewProduct(prev => ({ ...prev, subcategory: '' }));
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

    const uniqueMap = new Map<string, string>();

    products.forEach((product) => {
      if (product.category !== categoryName) return;

      const subcategory = normalizeSubcategory(product.subcategory);
      if (!subcategory) return;

      const normalizedKey = subcategory.toLowerCase();
      if (!uniqueMap.has(normalizedKey)) {
        uniqueMap.set(normalizedKey, subcategory);
      }
    });

    return Array.from(uniqueMap.values()).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  };

  const newProductSubcategories = getSubcategoriesForCategory(newProduct.category);
  const editingProductSubcategories = editingProduct
    ? getSubcategoriesForCategory(editingProduct.category)
    : [];

  const reorderImages = (
    allImages: string[],
    fromIndex: number,
    toIndex: number
  ): { image_url: string; images: string[] } => {
    if (fromIndex === toIndex) {
      return {
        image_url: allImages[0],
        images: allImages.slice(1),
      };
    }

    const reordered = [...allImages];
    const [movedImage] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedImage);

    return {
      image_url: reordered[0],
      images: reordered.slice(1),
    };
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setProducts((data as ProductWithImages[]) || []);
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

  const processFiles = async (files: FileList, isEditing: boolean = false) => {
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file) {
        console.warn('[DEBUG] Nenhum arquivo selecionado');
        continue;
      }

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
        alert(`❌ Erro ao fazer upload: ${errorMessage}`);
        setError(errorMessage);
      }
    }

    setUploadingImage(false);

    if (uploadedUrls.length === 0) {
      alert('⚠️ Nenhuma imagem foi enviada com sucesso');
      return;
    }

    if (isEditing && editingProduct) {
      const currentImages = [editingProduct.image_url, ...(editingProduct.images || [])]
        .filter(Boolean);
      const allImages = [...currentImages, ...uploadedUrls];
      const reordered = {
        image_url: allImages[0],
        images: allImages.slice(1),
      };
      setEditingProduct((prev) =>
        prev
          ? {
              ...prev,
              image_url: reordered.image_url,
              images: reordered.images,
            }
          : prev
      );
    } else {
      const currentImages = newProduct.image_url
        ? [newProduct.image_url, ...newProduct.images]
        : newProduct.images;
      const allImages = [...currentImages, ...uploadedUrls];
      const reordered = {
        image_url: allImages[0],
        images: allImages.slice(1),
      };
      setNewProduct((prev) => ({
        ...prev,
        image_url: reordered.image_url,
        images: reordered.images,
      }));
    }

    alert(`✅ ${uploadedUrls.length} imagem(ns) enviada(s) com sucesso!`);
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
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const slug = await generateUniqueSlug(newProduct.name);

      const { error: err } = await supabase.from('products').insert([
        {
          name: newProduct.name.trim(),
          category: newProduct.category,
          subcategory: normalizeSubcategory(newProduct.subcategory) || null,
          price: newProduct.price,
          description: newProduct.description,
          includes: newProduct.includes.trim() || null,
          image_url: newProduct.image_url,
          images: newProduct.images.length > 0 ? newProduct.images : null,
          badge: newProduct.badge,
          slug,
        },
      ]);

      if (err) throw err;

      setNewProduct((prev) => ({
        ...prev,
        name: '',
        category: '',
        subcategory: '',
        price: 0,
        description: '',
        includes: '',
        image_url: '',
        images: [],
        badge: '',
      }));
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
          price: editingProduct.price,
          description: editingProduct.description,
          includes: editingProduct.includes?.trim() || null,
          image_url: editingProduct.image_url,
          images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : null,
          badge: editingProduct.badge,
          slug,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader className="w-8 h-8 text-gray-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Header */}
      <header className="bg-black border-b border-gray-900 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img 
              src="/logo.png" 
              alt="Loc 7" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="border-l border-gray-700 pl-5">
              <h1 className="text-base font-semibold text-white">Painel de Administração</h1>
              <p className="text-xs text-gray-400">Gerenciar equipamentos e categorias</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Loc 7 Equipamentos</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-4 font-medium text-sm transition-colors ${
              activeTab === 'products'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="inline-block mr-2 size-4" />
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-4 px-4 font-medium text-sm transition-colors ${
              activeTab === 'categories'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FolderOpen className="inline-block mr-2 size-4" />
            Categorias
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add Product Form */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Novo Produto</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Nome *</label>
                  <input
                    type="text"
                    placeholder="Nome do produto"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Categoria *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Subcategoria</label>
                  <select
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, subcategory: e.target.value }))}
                    disabled={!newProduct.category}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Selecione ou crie nova</option>
                    {newProductSubcategories.map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Preço *</label>
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Badge</label>
                  <input
                    type="text"
                    placeholder="Ex: FULLFRAME"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    placeholder="Descrição do produto"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    O que acompanha
                  </label>
                  <textarea
                    placeholder={`Ex:
2 baterias
1 carregador
1 case
1 cartão de memória`}
                    value={newProduct.includes}
                    onChange={(e) =>
                      setNewProduct((prev) => ({ ...prev, includes: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    rows={4}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Imagens do produto
                  </label>
                  <div
                    onDragEnter={(e) => handleDragEnter(e, false)}
                    onDragOver={handleDragOver}
                    onDragLeave={(e) => handleDragLeave(e, false)}
                    onDrop={(e) => handleDrop(e, false)}
                    className={`border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
                      isDragOverNewProduct
                        ? 'border-gray-900 bg-gray-100'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => document.getElementById('fileInputNew')?.click()}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {isDragOverNewProduct ? 'Solte as imagens aqui' : 'Clique ou arraste imagens'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        JPG, PNG ou WebP até 10MB (primeira imagem = capa)
                      </span>
                    </div>

                    <input
                      id="fileInputNew"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, false)}
                      disabled={uploadingImage}
                      className="hidden"
                    />

                    {(newProduct.image_url || newProduct.images.length > 0) && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2">Preview (arraste para reordenar)</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {[newProduct.image_url, ...newProduct.images]
                            .filter(Boolean)
                            .map((img, index) => (
                              <div
                                key={`${img}-${index}`}
                                draggable
                                onDragStart={() => setDraggedImageIndex(index)}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setDragOverIndex(index);
                                }}
                                onDragLeave={() => setDragOverIndex(null)}
                                onDrop={() => {
                                  if (draggedImageIndex !== null && draggedImageIndex !== index) {
                                    const allImages = [newProduct.image_url, ...newProduct.images].filter(Boolean);
                                    const reordered = reorderImages(allImages, draggedImageIndex, index);
                                    setNewProduct((prev) => ({
                                      ...prev,
                                      image_url: reordered.image_url,
                                      images: reordered.images,
                                    }));
                                  }
                                  setDraggedImageIndex(null);
                                  setDragOverIndex(null);
                                }}
                                onDragEnd={() => {
                                  setDraggedImageIndex(null);
                                  setDragOverIndex(null);
                                }}
                                className={`text-center shrink-0 cursor-move transition-all ${
                                  dragOverIndex === index ? 'ring-2 ring-gray-900 scale-105' : ''
                                } ${draggedImageIndex === index ? 'opacity-50' : ''}`}
                              >
                                <img
                                  src={img}
                                  alt={index === 0 ? 'Capa' : `Imagem ${index}`}
                                  className="w-16 h-16 object-cover border rounded"
                                />
                                <p className="text-[10px] mt-1 font-medium">
                                  {index === 0 ? 'Capa' : `#${index}`}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={addProduct}
                className="mt-5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Adicionar Produto
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Produto</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">
                        Categoria
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">
                        Subcategoria
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Preço</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Badge</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Imagem</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          <Loader className="inline-block animate-spin mr-2 size-4" />
                          Carregando...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          Nenhum produto cadastrado
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-900 font-medium">{product.name}</td>
                          <td className="px-6 py-4 text-gray-600">{product.category}</td>
                          <td className="px-6 py-4">
                            {normalizeSubcategory(product.subcategory) ? (
                              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                {normalizeSubcategory(product.subcategory)}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-900 font-medium">
                            R$ {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4">
                            {product.badge && (
                              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                {product.badge}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {product.image_url && (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded border border-gray-200"
                              />
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowEditModal(true);
                                }}
                                className="p-2 hover:bg-gray-100 rounded transition-colors"
                                title="Editar"
                              >
                                <Edit2 size={16} className="text-gray-600" />
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="p-2 hover:bg-red-50 rounded transition-colors"
                                title="Deletar"
                              >
                                <Trash2 size={16} className="text-red-600" />
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

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nova Categoria</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                />
                <button
                  onClick={addCategory}
                  className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={16} /> Adicionar
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Categoria</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                          Nenhuma categoria cadastrada
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-900 font-medium">{cat.name}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => deleteCategory(cat.id)}
                              className="p-2 hover:bg-red-50 rounded transition-colors"
                              title="Deletar"
                            >
                              <Trash2 size={16} className="text-red-600" />
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

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Editar Produto</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={updateProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Subcategoria</label>
                  <select
                    value={editingProduct.subcategory || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, subcategory: e.target.value })
                    }
                    disabled={!editingProduct.category}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Selecione ou crie nova</option>
                    {editingProductSubcategories.map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Preço</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Badge</label>
                  <input
                    type="text"
                    placeholder="Ex: FULLFRAME"
                    value={editingProduct.badge || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, badge: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    O que acompanha
                  </label>
                  <textarea
                    value={editingProduct.includes || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, includes: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    rows={4}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Imagens do produto
                  </label>
                  <div
                    onDragEnter={(e) => handleDragEnter(e, true)}
                    onDragOver={handleDragOver}
                    onDragLeave={(e) => handleDragLeave(e, true)}
                    onDrop={(e) => handleDrop(e, true)}
                    className={`border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${
                      isDragOverEditProduct
                        ? 'border-gray-900 bg-gray-100'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => document.getElementById('fileInputEdit')?.click()}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {isDragOverEditProduct ? 'Solte as imagens aqui' : 'Clique ou arraste imagens'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        JPG, PNG ou WebP até 10MB
                      </span>
                    </div>

                    <input
                      id="fileInputEdit"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, true)}
                      disabled={uploadingImage}
                      className="hidden"
                    />

                    {(editingProduct.image_url || editingProduct.images?.length) && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2">Preview (arraste para reordenar)</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {[editingProduct.image_url, ...(editingProduct.images || [])]
                            .filter(Boolean)
                            .map((img, index) => (
                              <div
                                key={`${img}-${index}`}
                                draggable
                                onDragStart={() => setDraggedImageIndex(index)}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setDragOverIndex(index);
                                }}
                                onDragLeave={() => setDragOverIndex(null)}
                                onDrop={() => {
                                  if (draggedImageIndex !== null && draggedImageIndex !== index) {
                                    const allImages = [editingProduct.image_url, ...(editingProduct.images || [])]
                                      .filter(Boolean);
                                    const reordered = reorderImages(allImages, draggedImageIndex, index);
                                    setEditingProduct((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            image_url: reordered.image_url,
                                            images: reordered.images,
                                          }
                                        : prev
                                    );
                                  }
                                  setDraggedImageIndex(null);
                                  setDragOverIndex(null);
                                }}
                                onDragEnd={() => {
                                  setDraggedImageIndex(null);
                                  setDragOverIndex(null);
                                }}
                                className={`text-center shrink-0 cursor-move transition-all ${
                                  dragOverIndex === index ? 'ring-2 ring-gray-900 scale-105' : ''
                                } ${draggedImageIndex === index ? 'opacity-50' : ''}`}
                              >
                                <img
                                  src={img}
                                  alt={index === 0 ? 'Capa' : `Imagem ${index}`}
                                  className="w-16 h-16 object-cover border rounded"
                                />
                                <p className="text-[10px] mt-1 font-medium">
                                  {index === 0 ? 'Capa' : `#${index}`}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                  }}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

