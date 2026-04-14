import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id?: number;
  name: string;
  brand?: string;
  category: string;
  price: number;
  description?: string;
  image_url?: string;
  is_active?: boolean;
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState<Product>({
    name: "",
    brand: "",
    category: "",
    price: 0,
    description: "",
    image_url: "",
    is_active: true,
  });

  // =========================
  // FETCH PRODUTOS
  // =========================
  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("id", { ascending: false });
    if (data) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (field: keyof Product, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "price" ? Number(value) : value,
    }));
  };

  // =========================
  // EDITAR
  // =========================
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      brand: "",
      category: "",
      price: 0,
      description: "",
      image_url: "",
      is_active: true,
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    if (!form.name || !form.category) {
      alert("Preencha nome e categoria");
      return;
    }

    if (editingProduct) {
      // UPDATE
      const { error } = await supabase
        .from("products")
        .update(form)
        .eq("id", editingProduct.id);

      if (error) {
        alert("Erro ao atualizar");
        console.error(error);
      } else {
        alert("Produto atualizado!");
        handleCancelEdit();
        fetchProducts();
      }
    } else {
      // INSERT
      const { error } = await supabase.from("products").insert([form]);

      if (error) {
        alert("Erro ao salvar");
        console.error(error);
      } else {
        alert("Produto criado!");
        fetchProducts();
      }
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="admin-panel p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin - Produtos</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4 mb-10">
        <h2 className="font-semibold">
          {editingProduct ? "Editando produto" : "Novo produto"}
        </h2>

        <input
          placeholder="Nome"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="input"
        />

        <input
          placeholder="Marca"
          value={form.brand || ""}
          onChange={(e) => handleChange("brand", e.target.value)}
          className="input"
        />

        <input
          placeholder="Categoria"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="input"
        />

        <input
          placeholder="Preço"
          type="number"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
          className="input"
        />

        <textarea
          placeholder="Descrição"
          value={form.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="input"
        />

        <input
          placeholder="URL da imagem"
          value={form.image_url || ""}
          onChange={(e) => handleChange("image_url", e.target.value)}
          className="input"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => handleChange("is_active", e.target.checked)}
          />
          Produto ativo
        </label>

        <div className="flex gap-3">
          <button onClick={handleSubmit} className="btn-primary">
            {editingProduct ? "Atualizar produto" : "Salvar produto"}
          </button>

          {editingProduct && (
            <button onClick={handleCancelEdit} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* LISTA */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Equipamentos cadastrados</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>Nome</th>
              <th>Marca</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td>{p.name}</td>
                <td>{p.brand || "-"}</td>
                <td>{p.category}</td>
                <td>R$ {p.price}</td>
                <td>{p.is_active ? "Ativo" : "Inativo"}</td>
                <td>
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
