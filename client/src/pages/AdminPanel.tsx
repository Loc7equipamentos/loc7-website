import { useState, useEffect } from 'react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react';

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [editingId, setEditingId] = useState<string | null>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar produto');
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error: err } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (err) throw err;
      setEditingId(null);
      loadProducts();
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar categoria');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[oklch(0.08_0_0)] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Painel de Controle</h1>
          <p className="text-[oklch(0.7_0_0)]">Gerenciar produtos e categorias do catálogo</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded text-red-200 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-200 hover:text-red-100">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[oklch(0.2_0_0)]">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'products'
                ? 'text-[oklch(0.45_0.25_25)] border-b-2 border-[oklch(0.45_0.25_25)]'
                : 'text-[oklch(0.6_0_0)] hover:text-white'
            }`}
          >
            Produtos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'categories'
                ? 'text-[oklch(0.45_0.25_25)] border-b-2 border-[oklch(0.45_0.25_25)]'
                : 'text-[oklch(0.6_0_0)] hover:text-white'
            }`}
          >
            Categorias ({categories.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Add Product Form */}
            <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Plus size={24} /> Adicionar Produto
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded px-4 py-2 text-white placeholder-[oklch(0.4_0_0)]"
                />

                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded px-4 py-2 text-white"
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
                  className="bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded px-4 py-2 text-white placeholder-[oklch(0.4_0_0)]"
                />

                <input
                  type="text"
                  placeholder="Badge (ex: NOVO, FULLFRAME)"
                  value={newProduct.badge}
                  onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                  className="bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded px-4 py-2 text-white placeholder-[oklch(0.4_0_0)]"
                />

                <textarea
                  placeholder="Descrição"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="md:col-span-2 bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded px-4 py-2 text-white placeholder-[oklch(0.4_0_0)] h-20 resize-none"
                />

                <input
                  type="url"
                  placeholder="URL da imagem"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="md:col-span-2 bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded px-4 py-2 text-white placeholder-[oklch(0.4_0_0)]"
                />
              </div>

              <button
                onClick={addProduct}
                className="mt-4 bg-[oklch(0.45_0.25_25)] hover:bg-[oklch(0.5_0.25_25)] text-white font-bold py-2 px-6 rounded transition-colors flex items-center gap-2"
              >
                <Plus size={20} /> Adicionar Produto
              </button>
            </div>

            {/* Products List */}
            <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[oklch(0.15_0_0)] border-b border-[oklch(0.2_0_0)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Preço</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Badge</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[oklch(0.15_0_0)]">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-[oklch(0.15_0_0)] transition-colors">
                        <td className="px-6 py-3 text-sm">{product.name}</td>
                        <td className="px-6 py-3 text-sm text-[oklch(0.6_0_0)]">{product.category}</td>
                        <td className="px-6 py-3 text-sm font-semibold">R$ {product.price.toFixed(2)}</td>
                        <td className="px-6 py-3 text-sm">
                          {product.badge ? (
                            <span className="bg-[oklch(0.45_0.25_25)] text-white px-2 py-1 rounded text-xs">
                              {product.badge}
                            </span>
                          ) : (
                            <span className="text-[oklch(0.4_0_0)]">-</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-sm flex gap-2">
                          <button
                            onClick={() => setEditingId(product.id)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {products.length === 0 && (
                <div className="p-8 text-center text-[oklch(0.6_0_0)]">
                  Nenhum produto cadastrado ainda
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            {/* Add Category Form */}
            <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Plus size={24} /> Adicionar Categoria
              </h2>

              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded px-4 py-2 text-white placeholder-[oklch(0.4_0_0)]"
                />
                <button
                  onClick={addCategory}
                  className="bg-[oklch(0.45_0.25_25)] hover:bg-[oklch(0.5_0.25_25)] text-white font-bold py-2 px-6 rounded transition-colors flex items-center gap-2"
                >
                  <Plus size={20} /> Adicionar
                </button>
              </div>
            </div>

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-4 flex justify-between items-center hover:border-[oklch(0.3_0_0)] transition-colors"
                >
                  <span className="font-semibold">{category.name}</span>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {categories.length === 0 && (
              <div className="text-center text-[oklch(0.6_0_0)] py-8">
                Nenhuma categoria cadastrada ainda
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
