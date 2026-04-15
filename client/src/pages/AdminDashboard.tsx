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

  // 🔥 CARREGAR DADOS
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: catData } = await supabase.from("categories").select("*");
    const { data: subData } = await supabase.from("subcategories").select("*");

    setCategories(catData || []);
    setSubcategories(subData || []);
  }

  // 🔥 FILTRO DE SUBCATEGORIAS (SEGURO)
  const selectedCategory = useMemo(() => {
    return categories.find((cat) => cat.name === form.category) || null;
  }, [categories, form.category]);

  const subcategoriasDisponiveis = useMemo(() => {
    if (!selectedCategory) return [];
    return subcategories.filter(
      (sub) => sub.category_id === selectedCategory.id
    );
  }, [selectedCategory, subcategories]);

  // 🔥 HANDLE CHANGE SEGURO
  function handleChange<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
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
    <div style={{ padding: "20px", color: "#000" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Admin Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "10px",
        }}
      >
        {/* NOME */}
        <div style={{ gridColumn: "span 6" }}>
          <input
            style={inputStyle}
            placeholder="Nome do produto"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* MARCA */}
        <div style={{ gridColumn: "span 6" }}>
          <input
            style={inputStyle}
            placeholder="Marca"
            value={form.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
          />
        </div>

        {/* CATEGORIA */}
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

        {/* SUBCATEGORIA (FILTRADA E SEGURA) */}
        <div style={{ gridColumn: "span 6" }}>
          <select
            style={inputStyle}
            value={form.subcategory}
            disabled={
              !form.category || subcategoriasDisponiveis.length === 0
            }
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

        {/* PREÇO */}
        <div style={{ gridColumn: "span 6" }}>
          <input
            style={inputStyle}
            placeholder="Preço"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
        </div>

        {/* IMAGEM */}
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
  );
}
