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
      console.log('✅ Produtos carregados:', data?.length);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar produtos';
      setError(errorMsg);
      console.error('❌ Erro ao carregar produtos:', err);
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
      console.log('✅ Categorias carregadas:', data?.length);
    } catch (err) {
      console.error('❌ Erro ao carregar categorias:', err);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      console.log('📝 Adicionando produto:', newProduct);

      const { data, error: err } = await supabase.from('products').insert([
        {
          name: newProduct.name,
          category: newProduct.category,
          price: newProduct.price,
          description: newProduct.description,
          image_url: newProduct.image_url || 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80',
          badge: newProduct.badge,
        },
      ]);

      if (err) throw err;

      console.log('✅ Produto adicionado com sucesso!', data);

      setNewProduct({
        name: '',
        category: '',
        price: 0,
        description: '',
        image_url: '',
        badge: '',
      });
      setError(null);
      
      // Recarregar produtos
      await loadProducts();
      alert('✅ Produto adicionado com sucesso!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao adicionar produto';
      setError(errorMsg);
      console.error('❌ Erro ao adicionar produto:', err);
      alert('❌ ' + errorMsg);
    }
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      console.log('📝 Atualizando produto:', editingProduct);

      const { error: err } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          category: editingProduct.category,
          price: editingProduct.price,
          description: editingProduct.description,
          image_url: editingProduct.image_url,
          badge: editingProduct.badge,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingProduct.id);

      if (err) throw err;
      
      console.log('✅ Produto atualizado com sucesso!');
      
      setShowEditModal(false);
      setEditingProduct(null);
      await loadProducts();
      alert('✅ Produto atualizado com sucesso!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar produto';
      setError(errorMsg);
      console.error('❌ Erro ao atualizar produto:', err);
      alert('❌ ' + errorMsg);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      console.log('🗑️ Deletando produto:', id);

      const { error: err } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (err) throw err;
      
      console.log('✅ Produto deletado com sucesso!');
      
      await loadProducts();
      alert('✅ Produto deletado com sucesso!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar produto';
      setError(errorMsg);
      console.error('❌ Erro ao deletar produto:', err);
      alert('❌ ' + errorMsg);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      setError('Digite o nome da categoria');
      return;
    }

    try {
      console.log('📝 Adicionando categoria:', newCategory);

      const { error: err } = await supabase.from('categories').insert([
        {
          name: newCategory,
        },
      ]);

      if (err) throw err;

      console.log('✅ Categoria adicionada com sucesso!');

      setNewCategory('');
      setError(null);
      await loadCategories();
      alert('✅ Categoria adicionada com sucesso!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao adicionar categoria';
      setError(errorMsg);
      console.error('❌ Erro ao adicionar categoria:', err);
      alert('❌ ' + errorMsg);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return;

    try {
      console.log('🗑️ Deletando categoria:', id);

      const { error: err } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (err) throw err;

      console.log('✅ Categoria deletada com sucesso!');

      await loadCategories();
      alert('✅ Categoria deletada com sucesso!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao deletar categoria';
      setError(errorMsg);
      console.error('❌ Erro ao deletar categoria:', err);
      alert('❌ ' + errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Painel de Controle</h1>
          <p className="text-gray-600">Gerenciar produtos e categorias do catálogo</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
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
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-600" />
                Adicionar Produto
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />

                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />

                <input
                  type="text"
                  placeholder="Badge (ex: NOVO, FULLFRAME)"
                  value={newProduct.badge}
                  onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />

                <textarea
                  placeholder="Descrição"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
                  rows={3}
                />

                <input
                  type="url"
                  placeholder="URL da imagem (opcional)"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <button
                onClick={addProduct}
                className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar Produto
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="px-4 py-3 text-left text-gray-900 font-semibold">Nome</th>
                    <th className="px-4 py-3 text-left text-gray-900 font-semibold">Categoria</th>
                    <th className="px-4 py-3 text-left text-gray-900 font-semibold">Preço</th>
                    <th className="px-4 py-3 text-left text-gray-900 font-semibold">Badge</th>
                    <th className="px-4 py-3 text-left text-gray-900 font-semibold">Imagem</th>
                    <th className="px-4 py-3 text-left text-gray-900 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 text-gray-600">{product.category}</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">R$ {product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {product.badge && (
                          <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {product.badge}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowEditModal(true);
                          }}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
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
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            {/* Add Category Form */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-600" />
                Adicionar Categoria
              </h2>

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
                <button
                  onClick={addCategory}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar
                </button>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-semibold text-gray-900">{category.name}</span>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Editar Produto</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={updateProduct} className="space-y-4">
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />

                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />

                <input
                  type="text"
                  value={editingProduct.badge}
                  onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />

                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
                  rows={3}
                />

                <input
                  type="url"
                  value={editingProduct.image_url}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />

                {editingProduct.image_url && (
                  <img
                    src={editingProduct.image_url}
                    alt={editingProduct.name}
                    className="w-32 h-32 object-cover rounded"
                  />
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Salvar Alterações
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingProduct(null);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
