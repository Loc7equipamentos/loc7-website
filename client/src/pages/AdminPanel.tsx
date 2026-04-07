import { useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Sony FX9 6K", category: "Câmera", price: 850, description: "Câmera profissional 6K" },
    { id: "2", name: "Zeiss Supreme Prime Set", category: "Lentes", price: 2200, description: "Set de lentes profissionais" },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Câmera" },
    { id: "2", name: "Lentes" },
    { id: "3", name: "Iluminação" },
  ]);

  const [newProduct, setNewProduct] = useState({ name: "", category: "", price: 0, description: "" });
  const [newCategory, setNewCategory] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  const addProduct = () => {
    if (newProduct.name && newProduct.category) {
      setProducts([
        ...products,
        { id: Date.now().toString(), ...newProduct },
      ]);
      setNewProduct({ name: "", category: "", price: 0, description: "" });
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addCategory = () => {
    if (newCategory) {
      setCategories([
        ...categories,
        { id: Date.now().toString(), name: newCategory },
      ]);
      setNewCategory("");
    }
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[oklch(0.45_0.25_25)]">Painel Admin</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[oklch(0.2_0_0)]">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "products"
                ? "text-[oklch(0.45_0.25_25)] border-b-2 border-[oklch(0.45_0.25_25)]"
                : "text-[oklch(0.6_0_0)] hover:text-white"
            }`}
          >
            📦 Produtos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "categories"
                ? "text-[oklch(0.45_0.25_25)] border-b-2 border-[oklch(0.45_0.25_25)]"
                : "text-[oklch(0.6_0_0)] hover:text-white"
            }`}
          >
            📂 Categorias ({categories.length})
          </button>
        </div>

        {/* Produtos Tab */}
        {activeTab === "products" && (
          <div className="space-y-8">
            {/* Adicionar Produto */}
            <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Adicionar Novo Produto</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Nome do Produto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded px-4 py-2 text-white placeholder-[oklch(0.4_0_0)]"
                />
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded px-4 py-2 text-white"
                >
                  <option value="">Selecione Categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
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
                  placeholder="Descrição"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded px-4 py-2 text-white placeholder-[oklch(0.4_0_0)]"
                />
              </div>
              <button
                onClick={addProduct}
                className="bg-[oklch(0.45_0.25_25)] hover:bg-[oklch(0.5_0.25_25)] text-white px-6 py-2 rounded font-semibold transition-colors"
              >
                ➕ Adicionar Produto
              </button>
            </div>

            {/* Lista de Produtos */}
            <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Produtos</h2>
              <div className="space-y-3">
                {products.map(product => (
                  <div key={product.id} className="bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-[oklch(0.45_0.25_25)] text-sm">{product.category}</p>
                      <p className="text-[oklch(0.7_0_0)] text-sm">{product.description}</p>
                      <p className="font-mono text-[oklch(0.8_0_0)] font-bold">R$ {product.price.toFixed(2)}/dia</p>
                    </div>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categorias Tab */}
        {activeTab === "categories" && (
          <div className="space-y-8">
            {/* Adicionar Categoria */}
            <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Adicionar Nova Categoria</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Nome da Categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded px-4 py-2 text-white placeholder-[oklch(0.4_0_0)]"
                />
                <button
                  onClick={addCategory}
                  className="bg-[oklch(0.45_0.25_25)] hover:bg-[oklch(0.5_0.25_25)] text-white px-6 py-2 rounded font-semibold transition-colors"
                >
                  ➕ Adicionar
                </button>
              </div>
            </div>

            {/* Lista de Categorias */}
            <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Categorias</h2>
              <div className="space-y-3">
                {categories.map(category => (
                  <div key={category.id} className="bg-[oklch(0.08_0_0)] border border-[oklch(0.2_0_0)] rounded p-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-4 text-center">
            <p className="text-[oklch(0.6_0_0)] text-sm">Total de Produtos</p>
            <p className="text-3xl font-bold text-[oklch(0.45_0.25_25)]">{products.length}</p>
          </div>
          <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-4 text-center">
            <p className="text-[oklch(0.6_0_0)] text-sm">Total de Categorias</p>
            <p className="text-3xl font-bold text-[oklch(0.45_0.25_25)]">{categories.length}</p>
          </div>
          <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-4 text-center">
            <p className="text-[oklch(0.6_0_0)] text-sm">Valor Total em Estoque</p>
            <p className="text-3xl font-bold text-[oklch(0.45_0.25_25)]">R$ {products.reduce((sum, p) => sum + p.price, 0).toFixed(0)}</p>
          </div>
          <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg p-4 text-center">
            <p className="text-[oklch(0.6_0_0)] text-sm">Preço Médio</p>
            <p className="text-3xl font-bold text-[oklch(0.45_0.25_25)]">R$ {(products.reduce((sum, p) => sum + p.price, 0) / products.length || 0).toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
