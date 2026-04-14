import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const categorias = [
  "Câmeras",
  "Lentes",
  "Iluminação",
  "Áudio",
  "Monitores",
  "Movimento",
  "Transmissores",
  "Comunicadores",
  "Maquinária",
  "Drones",
];

const marcas = [
  "Sony",
  "Canon",
  "RED",
  "Blackmagic",
  "Arri",
  "Aputure",
  "DJI",
  "Hollyland",
  "Sennheiser",
  "Rode",
  "SmallHD",
  "DanaDolly",
  "DZO",
];

type Product = {
  id?: number;
  name: string;
  brand: string;
  category: string;
  price: string | number;
  short_description: string;
  full_description: string;
  includes: string;
  technical_specs: string;
  image_url: string;
  is_active: boolean;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#ffffff",
  color: "#111111",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  padding: "12px 14px",
  fontSize: "14px",
  lineHeight: "20px",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: "100px",
  resize: "vertical",
};

const buttonPrimary: React.CSSProperties = {
  backgroundColor: "#000000",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  padding: "12px 18px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};

const buttonSecondary: React.CSSProperties = {
  backgroundColor: "#e5e7eb",
  color: "#111111",
  border: "none",
  borderRadius: "8px",
  padding: "12px 18px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  color: "#111111",
  fontSize: "14px",
  fontWeight: 600,
};

export default function AdminDashboard() {
  const emptyForm: Product = {
    name: "",
    brand: "",
    category: "",
    price: "",
    short_description: "",
    full_description: "",
    includes: "",
    technical_specs: "",
    image_url: "",
    is_active: true,
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Product>(emptyForm);

  const handleChange = (field: keyof Product, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const load = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.name.trim()) {
      alert("Preencha o nome");
      return;
    }

    if (!form.category.trim()) {
      alert("Selecione a categoria");
      return;
    }

    if (!String(form.price).trim()) {
      alert("Preencha o preço");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
    };

    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        console.error(error);
        alert("Erro ao atualizar");
        return;
      }

      alert("Produto atualizado");
    } else {
      const { error } = await supabase.from("products").insert([payload]);

      if (error) {
        console.error(error);
        alert("Erro ao criar");
        return;
      }

      alert("Produto criado");
    }

    reset();
    load();
  };

  const edit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      brand: p.brand || "",
      category: p.category || "",
      price: p.price || "",
      short_description: p.short_description || "",
      full_description: p.full_description || "",
      includes: p.includes || "",
      technical_specs: p.technical_specs || "",
      image_url: p.image_url || "",
      is_active: p.is_active ?? true,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: number) => {
    const ok = window.confirm("Excluir produto?");
    if (!ok) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao excluir");
      return;
    }

    if (editingId === id) {
      reset();
    }

    alert("Produto excluído");
    load();
  };

  return (
    <div style={{ background: "#000000", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <h1
          style={{
            color: "#ffffff",
            fontSize: 24,
            fontWeight: 800,
            marginBottom: 24,
          }}
        >
          Admin - Produtos
        </h1>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        >
          <h2
            style={{
              color: "#111111",
              fontSize: 18,
              fontWeight: 700,
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            {editingId ? "Editando produto" : "Novo produto"}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <input
              style={inputStyle}
              placeholder="Nome"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <select
              style={inputStyle}
              value={form.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
            >
              <option value="">Marca</option>
              {marcas.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
              <option value="Outra">Outra</option>
            </select>

            <select
              style={inputStyle}
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Categoria</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="Outra">Outra</option>
            </select>

            <input
              style={inputStyle}
              placeholder="Preço"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <textarea
              style={textareaStyle}
              placeholder="Descrição curta"
              value={form.short_description}
              onChange={(e) => handleChange("short_description", e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <textarea
              style={textareaStyle}
              placeholder="Descrição completa"
              value={form.full_description}
              onChange={(e) => handleChange("full_description", e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <textarea
              style={textareaStyle}
              placeholder="O que acompanha"
              value={form.includes}
              onChange={(e) => handleChange("includes", e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <textarea
              style={textareaStyle}
              placeholder="Specs"
              value={form.technical_specs}
              onChange={(e) => handleChange("technical_specs", e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <input
              style={inputStyle}
              placeholder="URL imagem"
              value={form.image_url}
              onChange={(e) => handleChange("image_url", e.target.value)}
            />
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#111111",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => handleChange("is_active", e.target.checked)}
            />
            Ativo
          </label>

          <div style={{ display: "flex", gap: 10 }}>
            <button style={buttonPrimary} onClick={save}>
              {editingId ? "Atualizar" : "Salvar"}
            </button>

            {editingId && (
              <button style={buttonSecondary} onClick={reset}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        >
          <h2
            style={{
              color: "#111111",
              fontSize: 18,
              fontWeight: 700,
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            Equipamentos cadastrados
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#ffffff",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      color: "#111111",
                      padding: "12px 10px",
                      borderBottom: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  >
                    Nome
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      color: "#111111",
                      padding: "12px 10px",
                      borderBottom: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  >
                    Marca
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      color: "#111111",
                      padding: "12px 10px",
                      borderBottom: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  >
                    Categoria
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      color: "#111111",
                      padding: "12px 10px",
                      borderBottom: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  >
                    Preço
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      color: "#111111",
                      padding: "12px 10px",
                      borderBottom: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      color: "#111111",
                      padding: "12px 10px",
                      borderBottom: "1px solid #e5e7eb",
                      fontSize: 14,
                    }}
                  >
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td
                      style={{
                        color: "#111111",
                        padding: "12px 10px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: 14,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {p.name || "-"}
                    </td>
                    <td
                      style={{
                        color: "#111111",
                        padding: "12px 10px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: 14,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {p.brand || "-"}
                    </td>
                    <td
                      style={{
                        color: "#111111",
                        padding: "12px 10px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: 14,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {p.category || "-"}
                    </td>
                    <td
                      style={{
                        color: "#111111",
                        padding: "12px 10px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: 14,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      R$ {p.price}
                    </td>
                    <td
                      style={{
                        color: p.is_active ? "#15803d" : "#b91c1c",
                        fontWeight: 700,
                        padding: "12px 10px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: 14,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {p.is_active ? "Ativo" : "Inativo"}
                    </td>
                    <td
                      style={{
                        padding: "12px 10px",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: 14,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          onClick={() => edit(p)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#2563eb",
                            fontWeight: 700,
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => remove(p.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#dc2626",
                            fontWeight: 700,
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
