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

type Brand = {
  id: string;
  name: string;
  created_at?: string | null;
};

type Category = {
  id: string;
  name: string;
  created_at?: string | null;
};

type Subcategory = {
  id: string;
  name: string;
  category_id: string;
  created_at?: string | null;
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

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  marginBottom: 20,
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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [newSubcategoryCategoryId, setNewSubcategoryCategoryId] = useState("");

  const [form, setForm] = useState<ProductForm>(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingSubcategory, setSavingSubcategory] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadBrands();
    loadCategories();
    loadSubcategories();
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

  const selectedCategory = useMemo(() => {
    return categories.find((cat) => cat.name === form.category) || null;
  }, [categories, form.category]);

  const subcategoriasDisponiveis = useMemo(() => {
    if (!selectedCategory) return [];
    return subcategories.filter((sub) => sub.category_id === selectedCategory.id);
  }, [selectedCategory, subcategories]);

  async function loadBrands() {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      alert("Erro ao carregar marcas");
      return;
    }

    setBrands((data || []) as Brand[]);
  }

  async function loadCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      alert("Erro ao carregar categorias");
      return;
    }

    setCategories((data || []) as Category[]);
  }

  async function loadSubcategories() {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      alert("Erro ao carregar subcategorias");
      return;
    }

    setSubcategories((data || []) as Subcategory[]);
  }

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

  async function addBrand() {
    if (!newBrand.trim()) {
      alert("Digite o nome da marca");
      return;
    }

    try {
      setSavingBrand(true);

      const { error } = await supabase
        .from("brands")
        .insert([{ name: newBrand.trim() }]);

      if (error) {
        console.error(error);
        alert("Erro ao criar marca");
        return;
      }

      setNewBrand("");
      alert("Marca criada");
      setRefreshKey((n) => n + 1);
    } finally {
      setSavingBrand(false);
    }
  }

  async function deleteBrand(id: string, name: string) {
    const confirmed = window.confirm(`Deseja excluir a marca "${name}"?`);
    if (!confirmed) return;

    const { error } = await supabase.from("brands").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao excluir marca");
      return;
    }

    alert("Marca excluída");
    if (form.brand === name) {
      setForm((prev) => ({ ...prev, brand: "" }));
    }
    setRefreshKey((n) => n + 1);
  }

  async function addCategory() {
    if (!newCategory.trim()) {
      alert("Digite o nome da categoria");
      return;
    }

    try {
      setSavingCategory(true);

      const { error } = await supabase
        .from("categories")
        .insert([{ name: newCategory.trim() }]);

      if (error) {
        console.error(error);
        alert("Erro ao criar categoria");
        return;
      }

      setNewCategory("");
      alert("Categoria criada");
      setRefreshKey((n) => n + 1);
    } finally {
      setSavingCategory(false);
    }
  }

  async function deleteCategory(id: string, name: string) {
    const confirmed = window.confirm(`Deseja excluir a categoria "${name}"?`);
    if (!confirmed) return;

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao excluir categoria");
      return;
    }

    alert("Categoria excluída");
    if (form.category === name) {
      setForm((prev) => ({ ...prev, category: "", subcategory: "" }));
    }
    setRefreshKey((n) => n + 1);
  }

  async function addSubcategory() {
    if (!newSubcategoryCategoryId) {
      alert("Selecione a categoria da subcategoria");
      return;
    }

    if (!newSubcategory.trim()) {
      alert("Digite o nome da subcategoria");
      return;
    }

    try {
      setSavingSubcategory(true);

      const { error } = await supabase.from("subcategories").insert([
        {
          name: newSubcategory.trim(),
          category_id: newSubcategoryCategoryId,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Erro ao criar subcategoria");
        return;
      }

      setNewSubcategory("");
      alert("Subcategoria criada");
      setRefreshKey((n) => n + 1);
    } finally {
      setSavingSubcategory(false);
    }
  }

  async function deleteSubcategory(id: string, name: string) {
    const confirmed = window.confirm(`Deseja excluir a subcategoria "${name}"?`);
    if (!confirmed) return;

    const { error } = await supabase.from("subcategories").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao excluir subcategoria");
      return;
    }

    alert("Subcategoria excluída");
    if (form.subcategory === name) {
      setForm((prev) => ({ ...prev, subcategory: "" }));
    }
    setRefreshKey((n) => n + 1);
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

  const categoryNameById = (categoryId: string) =>
    categories.find((cat) => cat.id === categoryId)?.name || "-";

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
              <select
                style={inputStyle}
                value={form.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
              >
                <option value="">Marca</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: "span 3" }}>
              <select
                style={inputStyle}
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                <option value="">Categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
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
                    <option key={item.id} value={item.name}>
                      {item.name}
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
          <div style={sectionTitleStyle}>Gerenciar marcas</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <input
              style={inputStyle}
              placeholder="Nova marca"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
            />

            <button
              type="button"
              onClick={addBrand}
              disabled={savingBrand}
              style={{
                ...buttonPrimaryStyle,
                opacity: savingBrand ? 0.7 : 1,
              }}
            >
              {savingBrand ? "Salvando..." : "Adicionar marca"}
            </button>
          </div>

          {brands.length === 0 ? (
            <div style={{ color: "#555" }}>Nenhuma marca cadastrada.</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  style={{
                    border: "1px solid #d9dee7",
                    borderRadius: 12,
                    padding: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    background: "#fff",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{brand.name}</span>

                  <button
                    type="button"
                    onClick={() => deleteBrand(brand.id, brand.name)}
                    style={{
                      ...smallButtonStyle,
                      borderColor: "#ef4444",
                      color: "#b91c1c",
                    }}
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>Gerenciar categorias</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <input
              style={inputStyle}
              placeholder="Nova categoria"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <button
              type="button"
              onClick={addCategory}
              disabled={savingCategory}
              style={{
                ...buttonPrimaryStyle,
                opacity: savingCategory ? 0.7 : 1,
              }}
            >
              {savingCategory ? "Salvando..." : "Adicionar categoria"}
            </button>
          </div>

          {categories.length === 0 ? (
            <div style={{ color: "#555" }}>Nenhuma categoria cadastrada.</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  style={{
                    border: "1px solid #d9dee7",
                    borderRadius: 12,
                    padding: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    background: "#fff",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{category.name}</span>

                  <button
                    type="button"
                    onClick={() => deleteCategory(category.id, category.name)}
                    style={{
                      ...smallButtonStyle,
                      borderColor: "#ef4444",
                      color: "#b91c1c",
                    }}
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>Gerenciar subcategorias</div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <select
              style={inputStyle}
              value={newSubcategoryCategoryId}
              onChange={(e) => setNewSubcategoryCategoryId(e.target.value)}
            >
              <option value="">Categoria da subcategoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              style={inputStyle}
              placeholder="Nova subcategoria"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
            />

            <button
              type="button"
              onClick={addSubcategory}
              disabled={savingSubcategory}
              style={{
                ...buttonPrimaryStyle,
                opacity: savingSubcategory ? 0.7 : 1,
              }}
            >
              {savingSubcategory ? "Salvando..." : "Adicionar subcategoria"}
            </button>
          </div>

          {subcategories.length === 0 ? (
            <div style={{ color: "#555" }}>Nenhuma subcategoria cadastrada.</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
            {(newSubcategoryCategoryId
  ? subcategories.filter((subcategory) => subcategory.category_id === newSubcategoryCategoryId)
  : subcategories
).map((subcategory) => (
                <div
                  key={subcategory.id}
                  style={{
                    border: "1px solid #d9dee7",
                    borderRadius: 12,
                    padding: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    background: "#fff",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{subcategory.name}</div>
                    <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                      {categoryNameById(subcategory.category_id)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteSubcategory(subcategory.id, subcategory.name)}
                    style={{
                      ...smallButtonStyle,
                      borderColor: "#ef4444",
                      color: "#b91c1c",
                    }}
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={sectionTitleStyle}>Equipamentos cadastrados</div>

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
