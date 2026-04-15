import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  price: number;
  image_url: string | null;
};

export default function Catalogo() {
  const { categoria } = useParams();

  const [produtos, setProdutos] = useState<Product[]>([]);
  const [subcategorias, setSubcategorias] = useState<string[]>([]);
  const [filtroSubcategoria, setFiltroSubcategoria] = useState<string | null>(null);

  // 🔹 Carregar produtos
  const loadProdutos = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("category", categoria)
      .eq("is_active", true);

    if (data) setProdutos(data);
  };

  // 🔹 Carregar subcategorias
  const loadSubcategorias = async () => {
    const { data } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category", categoria);

    if (data) {
      const nomes = data.map((item: any) => item.name);
      setSubcategorias(nomes);
    }
  };

  useEffect(() => {
    if (categoria) {
      loadProdutos();
      loadSubcategorias();
    }
  }, [categoria]);

  // 🔹 Aplicar filtro
  const produtosFiltrados = filtroSubcategoria
    ? produtos.filter(p => p.subcategory === filtroSubcategoria)
    : produtos;

  return (
    <div style={{ display: "flex", padding: 20, gap: 20 }}>

      {/* 🔥 LATERAL */}
      <div style={{
        width: 220,
        borderRight: "1px solid #eee",
        paddingRight: 20
      }}>
        <h3 style={{ marginBottom: 16 }}>Filtrar</h3>

        <div
          style={{
            cursor: "pointer",
            marginBottom: 10,
            fontWeight: !filtroSubcategoria ? "bold" : "normal"
          }}
          onClick={() => setFiltroSubcategoria(null)}
        >
          Todos
        </div>

        {subcategorias.map((sub) => (
          <div
            key={sub}
            onClick={() => setFiltroSubcategoria(sub)}
            style={{
              cursor: "pointer",
              marginBottom: 8,
              color: filtroSubcategoria === sub ? "#000" : "#666",
              fontWeight: filtroSubcategoria === sub ? "bold" : "normal"
            }}
          >
            {sub}
          </div>
        ))}
      </div>

      {/* 🔥 PRODUTOS */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20
          }}
        >
          {produtosFiltrados.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                overflow: "hidden",
                background: "#fff"
              }}
            >
              <img
                src={p.image_url || ""}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover"
                }}
              />

              <div style={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {p.category}
                </div>

                <div style={{ fontWeight: 600 }}>
                  {p.name}
                </div>

                <div style={{ marginTop: 6 }}>
                  R$ {p.price}.00/dia
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
