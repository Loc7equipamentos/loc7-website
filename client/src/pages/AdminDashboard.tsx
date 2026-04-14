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

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
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
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
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
    });
    setEditingId(null);
  };

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    setProducts(data || []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      ...form,
      price: Number(form.price),
    };

    if (editingId) {
      await supabase.from("products").update(payload).eq("id", editingId);
      alert("Atualizado");
    } else {
      await supabase.from("products").insert([payload]);
      alert("Criado");
    }

    resetForm();
    loadProducts();
  };

  const handleEdit = (p: any) => {
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

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir produto?")) return;

    await supabase.from("products").delete().eq("id", id);

    loadProducts();
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ color: "#fff", marginBottom: 20 }}>
          Admin - Produtos
        </h1>

        {/* FORM */}
        <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
          <h2>{editingId ? "Editando produto" : "Novo produto"}</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            <input placeholder="Nome" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />

            {/* MARCA SELECT */}
            <select value={form.brand} onChange={(e) => handleChange("brand", e.target.value)}>
              <option value="">Marca</option>
              {marcas.map((m) => (
                <option key={m}>{m}</option>
              ))}
              <option value="Outra">Outra</option>
            </select>

            {/* CATEGORIA SELECT */}
            <select value={form.category} onChange={(e) => handleChange("category", e.target.value)}>
              <option value="">Categoria</option>
              {categorias.map((c) => (
                <option key={c}>{c}</option>
              ))}
              <option value="Outra">Outra</option>
            </select>

            <input placeholder="Preço" value={form.price} onChange={(e) => handleChange("price", e.target.value)} />
          </div>

          <textarea placeholder="Descrição curta" value={form.short_description} onChange={(e) => handleChange("short_description", e.target.value)} />
          <textarea placeholder="Descrição completa" value={form.full_description} onChange={(e) => handleChange("full_description", e.target.value)} />
          <textarea placeholder="O que acompanha" value={form.includes} onChange={(e) => handleChange("includes", e.target.value)} />
          <textarea placeholder="Specs" value={form.technical_specs} onChange={(e) => handleChange("technical_specs", e.target.value)} />

          <input placeholder="URL imagem" value={form.image_url} onChange={(e) => handleChange("image_url", e.target.value)} />

          <label>
            <input type="checkbox" checked={form.is_active} onChange={(e) => handleChange("is_active", e.target.checked)} />
            Produto ativo
          </label>

          <div style={{ marginTop: 10 }}>
            <button onClick={handleSubmit}>
              {editingId ? "Atualizar" : "Salvar"}
            </button>

            {editingId && (
              <button onClick={resetForm} style={{ marginLeft: 10 }}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* LISTA */}
        <div style={{ background: "#fff", marginTop: 20, padding: 20, borderRadius: 12 }}>
          <h2>Equipamentos cadastrados</h2>

          <table width="100%">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Marca</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.brand || "-"}</td>
                  <td>{p.category}</td>
                  <td>R$ {p.price}</td>
                  <td>{p.is_active ? "Ativo" : "Inativo"}</td>
                  <td>
                    <button onClick={() => handleEdit(p)}>Editar</button>
                    <button onClick={() => handleDelete(p.id)} style={{ color: "red", marginLeft: 8 }}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
