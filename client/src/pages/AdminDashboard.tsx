import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Category = {
  id: string;
  name: string;
};

type Subcategory = {
  id: string;
  name: string;
  category_id: string;
};

type ProductForm = {
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  price: string;
  image: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  color: "#000",
  background: "#fff",
};

export default function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    category: "",
    subcategory: "",
    brand: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: catData, error: catError } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    const { data: subData, error: subError } = await supabase
      .from("subcategories")
      .select("*")
      .order("name", { ascending: true });

    if (catError) {
      console.error("Erro ao carregar categorias:", catError);
    }

    if (subError) {
      console.error("Erro ao carregar subcategorias:", subError);
    }

    setCategories(catData || []);
    setSubcategories(subData || []);
  }

  const selectedCategory = useMemo(() => {
    return categories.find((cat) => cat.name === form.category) || null;
  }, [categories, form.category]);

  const subcategoriasDisponiveis = useMemo(() => {
    if (!selectedCategory) return [];
    return subcategories.filter((sub) => sub.category_id === selectedCategory.id);
  }, [selectedCategory, subcategories]);

  function handleChange<K extends keyof ProductForm>(field: K, value: ProductForm[K]) {
    setForm((prev) => {
      if (field === "category") {
        return {
          ...prev,
          category: value as string,
          subcategory: "",
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  }

  return (
    <div
      style={{
        padding: "24px",
        background: "#f8f8f8",
        minHeight: "100vh",
        color: "#111",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            marginBottom: "24px",
            fontWeight: 800,
            color: "#111",
          }}
        >
          Admin Dashboard
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "12px",
          }}
        >
          <div style={{ gridColumn: "span 6" }}>
            <input
              style={inputStyle}
              placeholder="Nome do produto"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div style={{ gridColumn: "span 6" }}>
            <input
              style={inputStyle}
              placeholder="Marca"
              value={form.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
            />
          </div>

          <div style={{ gridColumn: "span 6" }}>
            <select
              style={inputStyle}
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "span 6" }}>
            <select
              style={inputStyle}
              value={form.subcategory}
              disabled={!form.category || subcategoriasDisponiveis.length === 0}
              onChange={(e) => handleChange("subcategory", e.target.value)}
            >
              <option value="">
                {!form.category
                  ? "Selecione uma categoria primeiro"
                  : subcategoriasDisponiveis.length === 0
                  ? "Nenhuma subcategoria disponível"
                  : "Subcategoria"}
              </option>

              {subcategoriasDisponiveis.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: "span 6" }}>
            <input
              style={inputStyle}
              placeholder="Preço"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>

          <div style={{ gridColumn: "span 6" }}>
            <input
              style={inputStyle}
              placeholder="URL da imagem"
              value={form.image}
              onChange={(e) => handleChange("image", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
