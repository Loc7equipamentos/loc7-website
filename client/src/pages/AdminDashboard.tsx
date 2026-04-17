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
  const [editingImagesInput, setEditingImagesInput] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: 0,
    description: '',
    includes: '',
    image_url: '',
    imagesInput: '',
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

  const normalizeSubcategory = (value?: string | null) => {
    return value?.trim() || '';
  };

  const parseImagesInput = (value?: string | null) => {
    if (!value) return [];

    return value
      .split(/\n|,/)
      .map((img) => img.trim())
      .filter(Boolean);
  };

  const buildGallery = (mainImage?: string | null, imagesInput?: string | null) => {
    const main = mainImage?.trim() || '';

    const parsed = parseImagesInput(imagesInput);

    const uniqueAdditional = parsed.filter((img, index, self) => {
      return img !== main && self.indexOf(img) === index;
    });

    return {
      gallery: main ? [main, ...uniqueAdditional] : uniqueAdditional,
      additional: uniqueAdditional.length > 0 ? uniqueAdditional : null,
    };
  };

  const stringifyImages = (images?: string[] | null) => {
    if (!images || images.length === 0) return '';
    return images.join(', ');
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

  const newProductGalleryPreview = buildGallery(newProduct.image_url, newProduct.imagesInput).gallery;
  const editingProductGalleryPreview = editingProduct
    ? buildGallery(editingProduct.image_url, editingImagesInput).gallery
    : [];

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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.warn('[DEBUG] Nenhum arquivo selecionado');
      return;
    }

    try {
      setUploadingImage(true);

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
      const imageUrl = data.publicUrl;

      if (isEditing && editingProduct) {
        setEditingProduct({ ...editingProduct, image_url: imageUrl });
      } else {
        setNewProduct({ ...newProduct, image_url: imageUrl });
      }

      alert('✅ Imagem enviada com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      alert(`❌ Erro ao fazer upload: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const slug = await generateUniqueSlug(newProduct.name);
      const { additional } = buildGallery(newProduct.image_url, newProduct.imagesInput);

      const { error: err } = await supabase.from('products').insert([
        {
          name: newProduct.name.trim(),
          category: newProduct.category,
          subcategory: normalizeSubcategory(newProduct.subcategory) || null,
          price: newProduct.price,
          description: newProduct.description,
          includes: newProduct.includes.trim() || null,
          image_url: newProduct.image_url,
          images: additional,
          badge: newProduct.badge,
          slug,
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
        imagesInput: '',
        badge: '',
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
      const { additional } = buildGallery(editingProduct.image_url, editingImagesInput);

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
          images: additional,
          badge: editingProduct.badge,
          slug,
        })
        .eq('id', editingProduct.id);

      if (err) throw err;
      setShowEditModal(false);
      setEditingProduct(null);
      setEditingImagesInput('');
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
      const { error: err } = await supabase.from('categories').insert([
        {
          name: newCategory.trim(),
        },
      ]);

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
    <div className="admin-dashboard min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-black border-b border-gray-800 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <img
              src="/logo.png"
              alt="Loc 7"
              className="h-20 w-auto object-contain"
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex justify-between items-center animate-in">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-600">
              <X size={18} />
            </button>
          </div>
        )}

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
              <Package size={16} /> Produtos{' '}
              <span className="ml-1 text-xs text-gray-500">({products.length})</span>
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
              <FolderOpen size={16} /> Categorias{' '}
              <span className="ml-1 text-xs text-gray-500">({categories.length})</span>
            </div>
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Novo Produto</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Sony FX9 6K"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value,
                        subcategory: '',
                      })
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
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Subcategoria
                  </label>
                  <input
                    type="text"
                    list="new-product-subcategories"
                    placeholder={
                      newProduct.category
                        ? 'Selecione ou digite uma subcategoria'
                        : 'Selecione a categoria primeiro'
                    }
                    value={newProduct.subcategory}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, subcategory: e.target.value })
                    }
                    disabled={!newProduct.category}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  />
                  <datalist id="new-product-subcategories">
                    {newProductSubcategories.map((subcategory) => (
                      <option key={subcategory} value={subcategory} />
                    ))}
                  </datalist>
                  {newProduct.category && newProductSubcategories.length > 0 && (
                    <p className="mt-2 text-[11px] text-gray-500">
                      Sugestões disponíveis para esta categoria.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
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
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    placeholder="Descrição do produto"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
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
                      setNewProduct({ ...newProduct, includes: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    rows={4}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Imagem principal do produto
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Clique para fazer upload
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        JPG, PNG ou WebP até 10MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
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

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Imagens adicionais (URLs separadas por vírgula ou quebra de linha)
                  </label>
                  <textarea
                    placeholder="https://img1.jpg, https://img2.jpg"
                    value={newProduct.imagesInput}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imagesInput: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                    rows={3}
                  />
                  <p className="mt-2 text-[11px] text-gray-500">
                    A imagem principal continua vindo do upload acima. Este campo alimenta a galeria.
                  </p>

                  {newProductGalleryPreview.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Preview da galeria (ordem real do site)
                      </p>
                      <div className="flex gap-2 overflow-x-auto">
                        {newProductGalleryPreview.map((img, index) => (
                          <div key={`${img}-${index}`} className="text-center shrink-0">
                            <img
                              src={img}
                              alt={`Preview ${index + 1}`}
                              className="w-16 h-16 object-cover border rounded"
                            />
                            <p className="text-[10px] mt-1">
                              {index === 0 ? 'Capa' : `#${index}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={addProduct}
                className="mt-5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Adicionar Produto
              </button>
            </div>

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
                    {products.map((product) => (
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
                              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => {
                              const productToEdit = {
                                ...product,
                                subcategory: normalizeSubcategory(product.subcategory),
                              };
                              setEditingProduct(productToEdit);
                              setEditingImagesInput(stringifyImages(product.images));
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Editar Produto</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                  setEditingImagesInput('');
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
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value,
                        subcategory: '',
                      })
                    }
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
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Subcategoria
                  </label>
                  <input
                    type="text"
                    list="edit-product-subcategories"
                    placeholder={
                      editingProduct.category
                        ? 'Selecione ou digite uma subcategoria'
                        : 'Selecione a categoria primeiro'
                    }
                    value={editingProduct.subcategory || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, subcategory: e.target.value })
                    }
                    disabled={!editingProduct.category}
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  />
                  <datalist id="edit-product-subcategories">
                    {editingProductSubcategories.map((subcategory) => (
                      <option key={subcategory} value={subcategory} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
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
                    value={editingProduct.badge || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, badge: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  O que acompanha
                </label>
                <textarea
                  value={editingProduct.includes || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, includes: e.target.value })
                  }
                  placeholder={`Ex:
2 baterias
1 carregador
1 case`}
                  className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Imagem principal</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-700">Clique para atualizar</span>
                    <input
                      type="file"
                      accept="image/*"
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

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Imagens adicionais (URLs separadas por vírgula ou quebra de linha)
                </label>
                <textarea
                  value={editingImagesInput}
                  onChange={(e) => setEditingImagesInput(e.target.value)}
                  placeholder="https://img1.jpg, https://img2.jpg"
                  className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  rows={3}
                />

                {editingProductGalleryPreview.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Preview da galeria (ordem real do site)
                    </p>
                    <div className="flex gap-2 overflow-x-auto">
                      {editingProductGalleryPreview.map((img, index) => (
                        <div key={`${img}-${index}`} className="text-center shrink-0">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover border rounded"
                          />
                          <p className="text-[10px] mt-1">
                            {index === 0 ? 'Capa' : `#${index}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    setEditingImagesInput('');
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
