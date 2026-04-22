import { useState, useEffect } from 'react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { Trash2, Plus, Edit2, X, Upload, Loader } from 'lucide-react';

type ProductWithImages = Product & {
  images?: string[] | null;
  includes?: string | null;
  catalog_order?: number | null;
  is_featured?: boolean | null;
  featured_order?: number | null;
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
    catalog_order: null as number | null,
    is_featured: false,
    featured_order: null as number | null,
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

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;

      // Sort products: featured first (by featured_order), then non-featured
      const sortedProducts = (data as ProductWithImages[] || []).sort((a, b) => {
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
      const currentImages = [editingProduct.image_url, ...(editingProduct.images || [])].filter(
        Boolean
      ) as string[];
      const allImages = [...currentImages, ...uploadedUrls];
      setEditingProduct((prev) =>
        prev
          ? {
              ...prev,
              image_url: allImages[0],
              images: allImages.slice(1),
            }
          : prev
      );
    } else {
      const currentImages = newProduct.image_url
        ? [newProduct.image_url, ...newProduct.images]
        : newProduct.images;
      const allImages = [...currentImages, ...uploadedUrls];
      setNewProduct((prev) => ({
        ...prev,
        image_url: allImages[0],
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
        includes: '',
        image_url: '',
        images: [],
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
          price: editingProduct.price,
          description: editingProduct.description,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel de Administração</h1>
        <p className="text-gray-600 mb-8">Gerenciar produtos e categorias</p>

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
        </div>

        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* FORMULÁRIO */}
            <div className="bg-white p-6 rounded border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Novo Produto</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    placeholder="Nome do produto"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria</label>
                  <select
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, subcategory: e.target.value }))}
                    disabled={!newProduct.category}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white disabled:bg-gray-50"
                  >
                    <option value="">Selecione</option>
                    {newProductSubcategories.map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço *</label>
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                  <input
                    type="text"
                    placeholder="Ex: FULLFRAME"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    placeholder="Descrição do produto"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                    rows={3}
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                    rows={2}
                  />
                </div>

                {/* BLOCO DESTAQUE NA HOME */}
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
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                        />
                        <span className="text-xs text-gray-500">(menor número aparece primeiro)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* UPLOAD DE IMAGENS */}
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

                    {(newProduct.image_url || newProduct.images.length > 0) && (
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {newProduct.image_url && (
                          <div className="text-center">
                            <img
                              src={newProduct.image_url}
                              alt="Capa"
                              className="w-12 h-12 object-cover border border-gray-300 rounded"
                            />
                            <p className="text-xs mt-1 text-gray-600">Capa</p>
                          </div>
                        )}
                        {newProduct.images.map((img, index) => (
                          <div key={index} className="text-center">
                            <img
                              src={img}
                              alt={`Img ${index}`}
                              className="w-12 h-12 object-cover border border-gray-300 rounded"
                            />
                            <p className="text-xs mt-1 text-gray-600">#{index + 1}</p>
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

            {/* TABELA DE PRODUTOS */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Nome</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Categoria</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Preço</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Destaque</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Ordem</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Nenhum produto cadastrado
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-gray-600">{product.category}</td>
                          <td className="px-4 py-3 text-gray-900">R$ {formatPrice(product.price)}</td>
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
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
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
      </div>

      {/* MODAL DE EDIÇÃO */}
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria</label>
                  <select
                    value={editingProduct.subcategory || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev ? { ...prev, subcategory: e.target.value } : prev
                      )
                    }
                    disabled={!editingProduct.category}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white disabled:bg-gray-50"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev ? { ...prev, badge: e.target.value } : prev
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={editingProduct.description || ''}
                    onChange={(e) =>
                      setEditingProduct((prev) =>
                        prev ? { ...prev, description: e.target.value } : prev
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                    rows={3}
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                    rows={2}
                  />
                </div>

                {/* BLOCO DESTAQUE NA HOME - EDIÇÃO */}
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
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
                        />
                        <span className="text-xs text-gray-500">(menor número aparece primeiro)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* UPLOAD DE IMAGENS - EDIÇÃO */}
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

                    {(editingProduct.image_url || (editingProduct.images && editingProduct.images.length > 0)) && (
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {editingProduct.image_url && (
                          <div className="text-center">
                            <img
                              src={editingProduct.image_url}
                              alt="Capa"
                              className="w-12 h-12 object-cover border border-gray-300 rounded"
                            />
                            <p className="text-xs mt-1 text-gray-600">Capa</p>
                          </div>
                        )}
                        {(editingProduct.images || []).map((img, index) => (
                          <div key={index} className="text-center">
                            <img
                              src={img}
                              alt={`Img ${index}`}
                              className="w-12 h-12 object-cover border border-gray-300 rounded"
                            />
                            <p className="text-xs mt-1 text-gray-600">#{index + 1}</p>
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
