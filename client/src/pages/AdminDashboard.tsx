import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    image_url: "",
    badge: "",
    brand: "",
    short_description: "",
    full_description: "",
    includes: "",
    technical_specs: "",
    is_active: true,
  });

  const handleChange = (field: string, value: any) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!newProduct.name || !newProduct.category) {
      alert("Preencha nome e categoria");
      return;
    }

    const { error } = await supabase.from("products").insert([newProduct]);

    if (error) {
      alert("Erro ao salvar");
      console.error(error);
    } else {
      alert("Produto criado!");
      window.location.reload();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin - Produtos</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        {/* BASICO */}
        <div>
          <h2 className="font-semibold mb-2">Informações básicas</h2>
          <input
            placeholder="Nome"
            className="input"
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <input
            placeholder="Marca"
            className="input"
            onChange={(e) => handleChange("brand", e.target.value)}
          />
          <input
            placeholder="Categoria"
            className="input"
            onChange={(e) => handleChange("category", e.target.value)}
          />
          <input
            type="number"
            placeholder="Preço"
            className="input"
            onChange={(e) => handleChange("price", Number(e.target.value))}
          />
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <h2 className="font-semibold mb-2">Descrição</h2>
          <textarea
            placeholder="Descrição curta"
            className="input"
            onChange={(e) =>
              handleChange("short_description", e.target.value)
            }
          />
          <textarea
            placeholder="Descrição completa"
            className="input"
            onChange={(e) =>
              handleChange("full_description", e.target.value)
            }
          />
        </div>

        {/* DETALHES */}
        <div>
          <h2 className="font-semibold mb-2">Detalhes</h2>
          <textarea
            placeholder="O que inclui"
            className="input"
            onChange={(e) => handleChange("includes", e.target.value)}
          />
          <textarea
            placeholder="Especificações técnicas"
            className="input"
            onChange={(e) =>
              handleChange("technical_specs", e.target.value)
            }
          />
        </div>

        {/* IMAGEM */}
        <div>
          <h2 className="font-semibold mb-2">Imagem</h2>
          <input
            placeholder="URL da imagem"
            className="input"
            onChange={(e) => handleChange("image_url", e.target.value)}
          />
        </div>

        {/* STATUS */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newProduct.is_active}
            onChange={(e) => handleChange("is_active", e.target.checked)}
          />
          <label>Produto ativo</label>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Salvar produto
        </button>
      </div>
    </div>
  );
}
