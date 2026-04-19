import { useState, useEffect } from 'react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { Trash2, Plus, Edit2, X, Upload, Loader, Package, FolderOpen, LogOut, AlertCircle } from 'lucide-react';

// Extended Product type to include includes field and catalog_order
interface ProductWithIncludes extends Product {
  includes?: string;
  catalog_order?: number;
}

// Robust slug generation with accent removal and uniqueness check
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const generateUniqueSlug = async (name: string, existingSlug?: string): Promise<string> => {
  let slug = generateSlug(name);
  const baseSlug = slug;
  let counter = 1;

  // Check if slug already exists
  const { data: existing } = await supabase
    .from('products')
    .select('id, slug')
    .eq('slug', slug)
    .neq('id', existingSlug ? 'null' : 'null');

  // If slug exists and it's not the current product being edited, add counter
  while (existing && existing.length > 0) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    const { data: checkNext } = await supabase
      .from('products')
      .select('id, slug')
      .eq('slug', slug);
    if (!checkNext || checkNext.length === 0) break;
  }

  return slug;
};

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps = {}) {
  const [products, setProducts] = useState<ProductWithIncludes[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  
  // Modal de edição
  const [editingProduct, setEditingProduct] = useState<ProductWithIncludes | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: 0,
    description: '',
    includes: '',
    image_url: '',
    badge: '',
    catalog_order: null as number | null,
  });

  const [newCategory, setNewCategory] = useState('');

  // Load data on mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Reset subcategory when category changes
  useEffect(() => {
    setNewProduct(prev => ({ ...prev, subcategory: '' }));
  }, [newProduct.category]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error: err } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (err) throw err;
      setCategories(data || []);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  // Get subcategories for selected category
  const getSubcategoriesForCategory = (categoryName: string): string[] => {
    if (!categoryName) return [];
    
    const subcats = products
      .filter(p => p.category === categoryName)
      .map(p => p.subcategory)
      .filter(Boolean) as string[];
    
    return Array.from(new Set(subcats)).sort();
  };

  // Robust image upload with validation
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing: boolean = false
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.warn('[DEBUG] Nenhum arquivo selecionado');
      return;
    }

    try {
      setUploadingImage(true);
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          console.warn(`[DEBUG] Tipo de arquivo não permitido: ${file.type}`);
          continue;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          console.warn(`[DEBUG] Arquivo muito grande: ${file.size}`);
          continue;
        }

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      if (uploadedUrls.length === 0) {
        setError('Nenhuma imagem válida foi enviada');
        return;
      }

      const [mainImage] = uploadedUrls;

      if (isEditing && editingProduct) {
        setEditingProduct({
          ...editingProduct,
          image_url: mainImage,
        });
      } else {
        setNewProduct((prev) => ({
          ...prev,
          image_url: mainImage,
        }));
      }

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro no upload das imagens';
      setError(errorMsg);
      console.error('[ERROR] Upload failed:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
      setError('Preencha todos os campos obrigatórios (Nome, Categoria, Preço)');
      return;
    }

    try {
      setError(null);

      // Generate unique slug
      const slug = await generateUniqueSlug(newProduct.name);

      const { error: err } = await supabase.from('products').insert([
        {
          name: newProduct.name,
          category: newProduct.category,
          subcategory: newProduct.subcategory || null,
          price: newProduct.price,
          description: newProduct.description,
          includes: newProduct.includes || null,
          image_url: newProduct.image_url || null,
          badge: newProduct.badge || null,
          slug: slug,
          catalog_order: newProduct.catalog_order || null,
        },
      ]);

      if (err) throw err;

      // Reset form
      setNewProduct({
        name: '',
        category: '',
        subcategory: '',
        price: 0,
        description: '',
        includes: '',
        image_url: '',
        badge: '',
        catalog_order: null,
      });

      await loadProducts();
      alert('Produto adicionado com sucesso!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao adicionar produto';
      setError(errorMsg);
      console.error('[ERROR] Add product failed:', err);
    }
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      setError(null);

      // Generate unique slug (check against other products)
      const slug = await generateUniqueSlug(editingProduct.name, editingProduct.id);

      const { error: err } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          category: editingProduct.category,
          subcategory: editingProduct.subcategory || null,
          price: editingProduct.price,
          description: editingProduct.description,
          includes: editingProduct.includes || null,
          image_url: editingProduct.image_url || null,
          badge: editingProduct.badge || null,
          slug: slug,
          catalog_order: editingProduct.catalog_order || null,
        })
        .eq('id', editingProduct.id);

      if (err) throw err;

      setShowEditModal(false);
      setEditingProduct(null);
      await loadProducts();
      alert('Produto atualizado com sucesso!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar produto';
      setError(errorMsg);
      console.error('[ERROR] Update product failed:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.')) return;

    try {
      setError(null);

      const { error: err } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (err) throw err;

      await loadProducts();
      alert('Produto deletado com sucesso!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar produto';
      setError(errorMsg);
      console.error('[ERROR] Delete product failed:', err);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      setError('Digite o nome da categoria');
      return;
    }

    try {
      setError(null);

      const { error: err } = await supabase.from('categories').insert([
        {
          name: newCategory.trim(),
        },
      ]);

      if (err) throw err;

      setNewCategory('');
      await loadCategories();
      alert('Categoria adicionada com sucesso!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao adicionar categoria';
      setError(errorMsg);
      console.error('[ERROR] Add category failed:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria? Esta ação não pode ser desfeita.')) return;

    try {
      setError(null);

      const { error: err } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (err) throw err;

      await loadCategories();
      alert('Categoria deletada com sucesso!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar categoria';
      setError(errorMsg);
      console.error('[ERROR] Delete category failed:', err);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/';
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
    <div className="admin-dashboard min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Simple Black Header - Matches Print */}
      <header className="bg-black border-b border-gray-800 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-white text-lg font-semibold">Painel protegido</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex justify-between items-start animate-in">
            <div className="flex gap-3">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-600 flex-shrink-0">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'products'
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={16} /> Produtos <span className="ml-1 text-xs text-gray-500">({products.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === 'categories'
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderOpen size={16} /> Categorias <span className="ml-1 text-xs text-gray-500">({categories.length})</span>
            </div>
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add Product Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Novo Produto</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Nome do Produto *</label>
                  <input
                    type="text"
                    placeholder="Ex: Sony FX9 6K"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Categoria *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
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
                  {!newProduct.category ? (
                    <div className="w-full px-3 py-2 text-sm border border-gray-300 bg-gray-50 text-gray-500 rounded-lg">
                      Selecione uma categoria primeiro
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={newProduct.subcategory}
                        onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                      >
                        <option value="">Nenhuma / Nova</option>
                        {getSubcategoriesForCategory(newProduct.category).map((subcat) => (
                          <option key={subcat} value={subcat}>
                            {subcat}
                          </option>
                        ))}
                      </select>
                      {!getSubcategoriesForCategory(newProduct.category).includes(newProduct.subcategory) && newProduct.subcategory && (
                        <div className="flex items-center px-3 py-2 text-xs bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium">
                          Nova
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Badge</label>
                  <input
                    type="text"
                    placeholder="Ex: FULLFRAME, 6K, LED"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Ordem no Catálogo</label>
                  <input
                    type="number"
                    placeholder="Ex: 1, 2, 3..."
                    value={newProduct.catalog_order ?? ''}
                    onChange={(e) => setNewProduct({ ...newProduct, catalog_order: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    placeholder="Descrição detalhada do produto"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">O que acompanha</label>
                  <textarea
                    placeholder="Ex: Câmera, lentes, tripé, cabos, bateria, cartão de memória..."
                    value={newProduct.includes}
                    onChange={(e) => setNewProduct({ ...newProduct, includes: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    rows={2}
                  />
                </div>

                {/* Upload Area */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Imagem do Produto</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">Clique para fazer upload</span>
                      <span className="text-xs text-gray-500 mt-1">JPG, PNG ou WebP até 10MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, false)}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    {newProduct.image_url && (
                      <div className="mt-4 flex justify-center">
                        <img
                          src={newProduct.image_url}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={addProduct}
                disabled={uploadingImage}
                className="mt-5 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-600 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
              >
                {uploadingImage ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Adicionar Produto
                  </>
                )}
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Produto</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Categoria</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Subcategoria</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Preço</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Ordem</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Badge</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Imagem</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500 text-sm">
                          Nenhum produto cadastrado. Crie um novo produto acima.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-900 font-medium">{product.name}</td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{product.category}</td>
                          <td className="px-6 py-4">
                            {product.subcategory ? (
                              <span className="inline-block bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                                {product.subcategory}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono text-gray-900 font-medium">R$ {product.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            {product.catalog_order !== null && product.catalog_order !== undefined ? (
                              <span className="inline-block bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium">
                                {product.catalog_order}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
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
                                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                              />
                            )}
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setShowEditModal(true);
                              }}
                              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
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

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Add Category Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Nova Categoria</h2>
              </div>

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
                  className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus size={16} /> Adicionar
                </button>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                  Nenhuma categoria cadastrada. Crie uma nova categoria acima.
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Editar Produto</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={updateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value, subcategory: '' })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Subcategoria</label>
                  {!editingProduct.category ? (
                    <div className="w-full px-3 py-2 text-sm border border-gray-300 bg-gray-50 text-gray-500 rounded-lg">
                      Selecione uma categoria primeiro
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={editingProduct.subcategory || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                      >
                        <option value="">Nenhuma / Nova</option>
                        {getSubcategoriesForCategory(editingProduct.category).map((subcat) => (
                          <option key={subcat} value={subcat}>
                            {subcat}
                          </option>
                        ))}
                      </select>
                      {editingProduct.subcategory && !getSubcategoriesForCategory(editingProduct.category).includes(editingProduct.subcategory) && (
                        <div className="flex items-center px-3 py-2 text-xs bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium">
                          Nova
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Ordem no Catálogo</label>
                  <input
                    type="number"
                    placeholder="Ex: 1, 2, 3..."
                    value={editingProduct.catalog_order ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, catalog_order: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">O que acompanha</label>
                <textarea
                  value={editingProduct.includes || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, includes: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  rows={2}
                />
              </div>

              {/* Upload Area in Modal */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Imagem</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-700">Clique para atualizar</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, true)}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  {editingProduct.image_url && (
                    <div className="mt-3 flex justify-center">
                      <img
                        src={editingProduct.image_url}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
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
                  className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-600 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
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
