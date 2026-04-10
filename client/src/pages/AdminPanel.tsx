import { useState, useEffect } from 'react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { Trash2, Plus, Edit2, X, Upload, Loader } from 'lucide-react';

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  
  // Modal de edição
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: 0,
    description: '',
    image_url: '',
    badge: '',
  });

  const [newCategory, setNewCategory] = useState('');

  // Load data on mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

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

  // Upload de imagem
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEditing: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      // Gerar nome único para o arquivo
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `products/${fileName}`;

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data } = supabase.storage.from('products').getPublicUrl(filePath);

      const imageUrl = data.publicUrl;

      if (isEditing && editingProduct) {
        setEditingProduct({ ...editingProduct, image_url: imageUrl });
      } else {
        setNewProduct({ ...newProduct, image_url: imageUrl });
      }

      alert('Imagem enviada com sucesso!');
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      alert('Erro ao fazer upload da imagem');
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
      const { error: err } = await supabase.from('products').insert([
        {
          name: newProduct.name,
          category: newProduct.category,
          price: newProduct.price,
          description: newProduct.description,
          image_url: newProduct.image_url,
          badge: newProduct.badge,
        },
      ]);

      if (err) throw err;

      setNewProduct({
        name: '',
        category: '',
        price: 0,
        description: '',
        image_url: '',
        badge: '',
      });
      setError(null);
      loadProducts();
      alert('Produto adicionado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar produto');
    }
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const { error: err } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          category: editingProduct.category,
          price: editingProduct.price,
          description: editingProduct.description,
          image_url: editingProduct.image_url,
          badge: editingProduct.badge,
        })
        .eq('id', editingProduct.id);

      if (err) throw err;
      setShowEditModal(false);
      setEditingProduct(null);
      loadProducts();
      alert('Produto atualizado com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar produto');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      const { error: err } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (err) throw err;
      loadProducts();
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
          name: newCategory,
        },
      ]);

      if (err) throw err;
      setNewCategory('');
      setError(null);
      loadCategories();
      alert('Categoria adicionada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar categoria');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;

    try {
      const { error: err } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (err) throw err;
      loadCategories();
      alert('Categoria deletada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar categoria');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[oklch(0.08_0_0)] flex items-center justify-center pt-32">
        <Loader className="w-8 h-8 text-[oklch(0.45_0.25_25)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Painel de Controle</h1>
          <p className="text-gray-600">Gerenciar produtos e categorias do catálogo</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded text-red-800 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-800 hover:text-red-600">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'products'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Produtos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'categories'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Categorias ({categories.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Add Product Form */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Plus size={24} /> Adicionar Produto
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Preço (R$)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="text"
                  placeholder="Badge (ex: NOVO, FULLFRAME)"
                  value={newProduct.badge}
                  onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                  className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <textarea
                  placeholder="Descrição"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="md:col-span-2 bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 h-20 resize-none"
                />

                {/* Upload de imagem */}
                <div className="md:col-span-2 border-2 border-dashed border-gray-300 rounded p-4 bg-gray-50">
                  <label className="flex items-center justify-center gap-2 cursor-pointer hover:text-orange-600 transition-colors text-gray-600">
                    <Upload className="w-5 h-5" />
                    <span>Clique para fazer upload da imagem</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  {newProduct.image_url && (
                    <div className="mt-4">
                      <img
                        src={newProduct.image_url}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={addProduct}
                className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded transition-colors flex items-center gap-2"
              >
                <Plus size={20} /> Adicionar Produto
              </button>
            </div>

            {/* Products List */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Categoria</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preço</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Badge</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Imagem</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-sm text-gray-900">{product.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-3 text-sm font-mono text-gray-900">R$ {product.price.toFixed(2)}</td>
                        <td className="px-6 py-3 text-sm">
                          {product.badge && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">
                              {product.badge}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowEditModal(true);
                            }}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
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

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            {/* Add Category Form */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Plus size={24} /> Adicionar Categoria
              </h2>

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  onClick={addCategory}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded transition-colors flex items-center gap-2"
                >
                  <Plus size={20} /> Adicionar
                </button>
              </div>
            </div>

            {/*             {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-semibold text-gray-900">{category.name}</span>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
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

      {/* Modal de edição */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-300 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Editar Produto</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={updateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Preço (R$)"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="text"
                  placeholder="Badge"
                  value={editingProduct.badge || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  className="bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <textarea
                placeholder="Descrição"
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
              />

              {/* Upload de imagem na edição */}
              <div className="border-2 border-dashed border-gray-300 rounded p-4 bg-gray-50">
                <label className="flex items-center justify-center gap-2 cursor-pointer hover:text-orange-600 transition-colors text-gray-600">
                  <Upload className="w-5 h-5" />
                  <span>Clique para atualizar a imagem</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                {editingProduct.image_url && (
                  <div className="mt-4">
                    <img
                      src={editingProduct.image_url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded transition-colors flex items-center gap-2"
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
