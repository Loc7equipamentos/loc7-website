import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type FormState = {
  name: string;
  brand: string;
  category: string;
  price: string;
  description: string;
  short_description: string;
  full_description: string;
  includes: string;
  technical_specs: string;
  image_url: string;
  is_active: boolean;
};

type ProductRow = {
  id: string;
  name: string | null;
  brand: string | null;
  category: string | null;
  price: number | null;
  is_active: boolean | null;
  created_at?: string | null;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#ffffff",
  color: "#111111",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "12px 14px",
  fontSize: "14px",
  lineHeight: "20px",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "110px",
  backgroundColor: "#ffffff",
  color: "#111111",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "12px 14px",
  fontSize: "14px",
  lineHeight: "20px",
  outline: "none",
  boxSizing: "border-box",
  resize: "vertical",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  color: "#111111",
  fontSize: "14px",
  fontWeight: 600,
};

const sectionTitleStyle: React.CSSProperties = {
  color: "#111111",
  fontSize: "18px",
  fontWeight: 700,
  marginBottom: "16px",
};

export default function AdminDashboard() {
  const [form, setForm] = useState<FormState>({
    name: "",
    brand: "",
    category: "",
    price: "",
    description: "",
    short_description: "",
    full_description: "",
    includes: "",
    technical_specs: "",
    image_url: "",
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const loadProducts = async () => {
    setLoadingProducts(true);

    const { data, error } = await supabase
      .from("products")
      .select("id, name, brand, category, price, is_active, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar produtos:", error);
      setLoadingProducts(false);
      return;
    }

    setProducts((data as ProductRow[]) || []);
    setLoadingProducts(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Preencha o nome do produto.");
      return;
    }

    if (!form.category.trim()) {
      alert("Preencha a categoria.");
      return;
    }

    if (!form.price.trim()) {
      alert("Preencha o preço.");
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
    };

    const { error } = await supabase.from("products").insert([payload]);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Erro ao salvar produto.");
      return;
    }

    alert("Produto criado com sucesso.");

    setForm({
      name: "",
      brand: "",
      category: "",
      price: "",
      description: "",
      short_description: "",
      full_description: "",
      includes: "",
      technical_specs: "",
      image_url: "",
      is_active: true,
    });

    loadProducts();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1
          style={{
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: 800,
            marginBottom: "24px",
          }}
        >
          Admin - Produtos
        </h1>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <h2 style={sectionTitleStyle}>Informações básicas</h2>
            </div>

            <div>
              <label style={labelStyle}>Nome</label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nome"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Marca</label>
              <input
                value={form.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                placeholder="Marca"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Categoria</label>
              <input
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Categoria"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Preço</label>
              <input
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="Preço"
                type="number"
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <h2 style={sectionTitleStyle}>Descrição</h2>
            </div>

            <div>
              <label style={labelStyle}>Descrição curta</label>
              <textarea
                value={form.short_description}
                onChange={(e) =>
                  handleChange("short_description", e.target.value)
                }
                placeholder="Descrição curta"
                style={textareaStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Descrição completa</label>
              <textarea
                value={form.full_description}
                onChange={(e) =>
                  handleChange("full_description", e.target.value)
                }
                placeholder="Descrição completa"
                style={textareaStyle}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <h2 style={sectionTitleStyle}>Detalhes</h2>
            </div>

            <div>
              <label style={labelStyle}>O que acompanha</label>
              <textarea
                value={form.includes}
                onChange={(e) => handleChange("includes", e.target.value)}
                placeholder="O que acompanha"
                style={textareaStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Especificações técnicas</label>
              <textarea
                value={form.technical_specs}
                onChange={(e) =>
                  handleChange("technical_specs", e.target.value)
                }
                placeholder="Especificações técnicas"
                style={textareaStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h2 style={sectionTitleStyle}>Imagem</h2>

            <label style={labelStyle}>URL da imagem</label>
            <input
              value={form.image_url}
              onChange={(e) => handleChange("image_url", e.target.value)}
              placeholder="URL da imagem"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#111111",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => handleChange("is_active", e.target.checked)}
                style={{ width: "16px", height: "16px" }}
              />
              Produto ativo
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "12px 18px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Salvando..." : "Salvar produto"}
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        >
          <h2 style={sectionTitleStyle}>Equipamentos cadastrados</h2>

          {loadingProducts ? (
            <p style={{ color: "#555555", margin: 0 }}>Carregando produtos...</p>
          ) : products.length === 0 ? (
            <p style={{ color: "#555555", margin: 0 }}>
              Nenhum produto cadastrado ainda.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#111111",
                      }}
                    >
                      Nome
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#111111",
                      }}
                    >
                      Marca
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#111111",
                      }}
                    >
                      Categoria
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#111111",
                      }}
                    >
                      Preço
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#111111",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #f1f5f9",
                          color: "#111111",
                        }}
                      >
                        {product.name || "-"}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #f1f5f9",
                          color: "#111111",
                        }}
                      >
                        {product.brand || "-"}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #f1f5f9",
                          color: "#111111",
                        }}
                      >
                        {product.category || "-"}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #f1f5f9",
                          color: "#111111",
                        }}
                      >
                        {product.price != null ? `R$ ${product.price}` : "-"}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #f1f5f9",
                          color: product.is_active ? "#166534" : "#991b1b",
                          fontWeight: 700,
                        }}
                      >
                        {product.is_active ? "Ativo" : "Inativo"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
