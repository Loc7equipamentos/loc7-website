import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  subcategory: string | null;
  price: number;
  short_description: string | null;
  full_description: string | null;
  includes: string | null;
  technical_specs: string | null;
  image_url: string | null;
  is_active: boolean;
  slug: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ProductForm = {
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  short_description: string;
  full_description: string;
  includes: string;
  technical_specs: string;
  image_url: string;
  is_active: boolean;
};

const categorias = [
  "Áudio",
  "Câmeras",
  "Computadores e Tablets",
  "Comunicadores",
  "Conversores / Distribuidores",
  "Drones",
  "Estabilizadores",
  "Filtros",
  "Follow Focus",
  "Gravadores",
  "HDs e Cartões de Memória",
  "Lentes",
  "Luz",
  "Maquinária",
  "Mattebox",
  "Monitores",
  "Still",
  "Movimento",
  "Switchers",
  "Tele-Prompter",
  "Transmissores",
  "Tripés",
] as const;

const subcategoriasPorCategoria: Record<string, string[]> = {
  Câmeras: [
    "DSLR / Mirrorless",
    "Cinema",
    "Broadcast",
    "Handycam",
    "Ação",
    "Acessórios de Câmera",
  ],
  Lentes: [
    "Prime",
    "Zoom",
    "Cinema",
    "Foto",
    "Anamórfica",
    "Adaptadores",
  ],
  Luz: [
    "LED",
    "Tubo",
    "Fresnel",
    "Painel",
    "COB",
    "Modificadores",
    "Acessórios de Iluminação",
  ],
};

const initialForm: ProductForm = {
  name: "",
  brand: "",
  category: "",
  subcategory: "",
  price: "",
  short_description: "",
  full_description: "",
  includes: "",
  technical_specs: "",
  image_url: "",
  is_active: true,
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#ffffff",
  color: "#111111",
  padding: "24px",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #d9dee7",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
  marginBottom: 24,
};

const titleStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  marginBottom: 8,
  color: "#111111",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#555",
  marginBottom: 20,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gap: 12,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 52,
  borderRadius: 12,
  border: "1px solid #cfd6e4",
  background: "#ffffff",
  color: "#111111",
  padding: "12px 14px",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 104,
  resize: "vertical",
};

const buttonPrimaryStyle: React.CSSProperties = {
  background: "#000000",
  color: "#ffffff",
  border: "none",
  borderRadius: 12,
  padding: "14px 18px",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
};

const buttonSecondaryStyle: React.CSSProperties = {
  background: "#f3f5f8",
  color: "#111111",
  border: "1px solid #d9dee7",
  borderRadius: 12,
  padding: "14px 18px",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
};

const smallButtonStyle: React.CSSProperties = {
  background: "#ffffff",
  color: "#111111",
  border: "1px solid #d9dee7",
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadProducts();
  }, [refreshKey]);

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const subcategoriasDisponiveis = useMemo(() => {
    return subcategoriasPorCategoria[form.category] || [];
  }, [form.category]);

  async function loadProducts() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        alert("Erro ao carregar produtos");
        return;
      }

      setProducts((data || []) as Product[]);
    } finally {
      setLoading(false);
    }
  }

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

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
    setFile(null);
    setPreviewUrl("");
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      price: product.price?.toString() || "",
      short_description: product.short_description || "",
      full_description: product.full_description || "",
      includes: product.includes || "",
      technical_specs: product.technical_specs || "",
      image_url: product.image_url || "",
      is_active: !!product.is_active,
    });
    setFile(null);
    setPreviewUrl(product.image_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImageIfNeeded() {
    if (!file) {
      return form.image_url || null;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert("Formato inválido. Use JPG, JPEG, PNG ou WebP.");
      return "__UPLOAD_ERROR__";
    }

    if (file.size > maxSize) {
      alert("Arquivo muito grande. O limite é 10MB.");
      return "__UPLOAD_ERROR__";
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      alert("Erro no upload da imagem");
      return "__UPLOAD_ERROR__";
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function save() {
    if (!form.name.trim()) {
      alert("Preencha o nome");
      return;
    }

    if (!form.category.trim()) {
      alert("Selecione a categoria");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      alert("Preencha o preço");
      return;
    }

    try {
      setSaving(true);

      const uploadedImageUrl = await uploadImageIfNeeded();
      if (uploadedImageUrl === "__UPLOAD_ERROR__") {
        return;
      }

      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim() || null,
        category: form.category.trim(),
        subcategory: form.subcategory.trim() || null,
        price: Number(form.price),
        short_description: form.short_description.trim() || null,
        full_description: form.full_description.trim() || null,
        includes: form.includes.trim() || null,
        technical_specs: form.technical_specs.trim() || null,
        image_url: uploadedImageUrl || null,
        is_active: form.is_active,
        slug: slugify(form.name),
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

      resetForm();
      setRefreshKey((n) => n + 1);
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(id: string) {
    const confirmed = window.confirm("Deseja excluir este produto?");
    if (!confirmed) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao excluir");
      return;
    }

    alert("Produto excluído");
    setRefreshKey((n) => n + 1);
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={titleStyle}>Novo produto</div>
          <div style={subtitleStyle}>
            Cadastro completo com upload de imagem para Supabase Storage.
          </div>

          <div style={gridStyle}>
            <div style={{ gridColumn: "span 4" }}>
              <input
                style={inputStyle}
                placeholder="Nome"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            <div style={{ gridColumn: "span 3" }}>
              <input
                style={inputStyle}
                placeholder="Marca"
                value={form.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
              />
            </div>

            <div style={{ gridColumn: "span 3" }}>
              <select
                style={inputStyle}
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                <option value="">Categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <input
                style={inputStyle}
                placeholder="Preço"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>

            {subcategoriasDisponiveis.length > 0 && (
              <div style={{ gridColumn: "span 12" }}>
                <select
                  style={inputStyle}
                  value={form.subcategory}
                  onChange={(e) => handleChange("subcategory", e.target.value)}
                >
                  <option value="">Subcategoria</option>
                  {subcategoriasDisponiveis.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ gridColumn: "span 12" }}>
              <textarea
                style={textareaStyle}
                placeholder="Descrição curta"
                value={form.short_description}
                onChange={(e) => handleChange("short_description", e.target.value)}
              />
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <textarea
                style={textareaStyle}
                placeholder="Descrição completa"
                value={form.full_description}
                onChange={(e) => handleChange("full_description", e.target.value)}
              />
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <textarea
                style={textareaStyle}
                placeholder="O que acompanha"
                value={form.includes}
                onChange={(e) => handleChange("includes", e.target.value)}
              />
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <textarea
                style={textareaStyle}
                placeholder="Especificações técnicas"
                value={form.technical_specs}
                onChange={(e) => handleChange("technical_specs", e.target.value)}
              />
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <label
                style={{
                  display: "block",
                  color: "#111111",
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Imagem do produto
              </label>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                  }
                }}
                style={inputStyle}
              />
            </div>

            {(previewUrl || form.image_url) && (
              <div style={{ gridColumn: "span 12" }}>
                <div
                  style={{
                    border: "1px solid #d9dee7",
                    borderRadius: 12,
                    padding: 12,
                    background: "#fff",
                    width: "fit-content",
                  }}
                >
                  <img
                    src={previewUrl || form.image_url}
                    alt="Preview"
                    style={{
                      width: 180,
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 10,
                      display: "block",
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ gridColumn: "span 12" }}>
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
            </div>

            <div
              style={{
                gridColumn: "span 12",
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={save}
                disabled={saving}
                style={{
                  ...buttonPrimaryStyle,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Salvando..." : editingId ? "Atualizar" : "Salvar"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                style={buttonSecondaryStyle}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 20,
              color: "#111111",
            }}
          >
            Equipamentos cadastrados
          </div>

          {loading ? (
            <div style={{ color: "#555" }}>Carregando...</div>
          ) : products.length === 0 ? (
            <div style={{ color: "#555" }}>Nenhum produto cadastrado.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                    <th style={{ padding: "12px 8px" }}>Nome</th>
                    <th style={{ padding: "12px 8px" }}>Marca</th>
                    <th style={{ padding: "12px 8px" }}>Categoria</th>
                    <th style={{ padding: "12px 8px" }}>Subcategoria</th>
                    <th style={{ padding: "12px 8px" }}>Preço</th>
                    <th style={{ padding: "12px 8px" }}>Status</th>
                    <th style={{ padding: "12px 8px" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      style={{ borderBottom: "1px solid #f0f2f5" }}
                    >
                      <td style={{ padding: "12px 8px" }}>{product.name}</td>
                      <td style={{ padding: "12px 8px" }}>{product.brand || "-"}</td>
                      <td style={{ padding: "12px 8px" }}>{product.category || "-"}</td>
                      <td style={{ padding: "12px 8px" }}>{product.subcategory || "-"}</td>
                      <td style={{ padding: "12px 8px" }}>
                        R$ {Number(product.price || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        {product.is_active ? "Ativo" : "Inativo"}
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            style={smallButtonStyle}
                            onClick={() => startEdit(product)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            style={{
                              ...smallButtonStyle,
                              borderColor: "#ef4444",
                              color: "#b91c1c",
                            }}
                            onClick={() => removeProduct(product.id)}
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
          )}
        </div>
      </div>
    </div>
  );
}
