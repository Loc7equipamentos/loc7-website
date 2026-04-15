import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  slug: string | null;
  category: string;
  subcategory: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
};

type Category = {
  id: string;
  name: string;
};

type Subcategory = {
  id: string;
  name: string;
  category_id: string;
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

function normalizeText(value: string | null | undefined) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function Catalogo() {
  const [, params] = useRoute("/catalogo/:category");
  const categorySlug = params?.category || null;

  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
  }, [categorySlug]);

  async function loadPage() {
    try {
      setLoading(true);
      setSelectedSubcategory(null);

      if (!categorySlug) {
        setCurrentCategory(null);
        setProducts([]);
        setSubcategories([]);
        return;
      }

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

      if (categoriesError) {
        console.error(categoriesError);
        alert("Erro ao carregar categorias");
        return;
      }

      const matchedCategory =
        (categoriesData || []).find((cat) => slugify(cat.name) === categorySlug) || null;

      setCurrentCategory(matchedCategory);

      if (!matchedCategory) {
        setProducts([]);
        setSubcategories([]);
        return;
      }

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id, name, slug, category, subcategory, price, image_url, is_active")
        .eq("category", matchedCategory.name)
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (productsError) {
        console.error(productsError);
        alert("Erro ao carregar produtos");
        return;
      }

      setProducts((productsData || []) as Product[]);

      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from("subcategories")
        .select("id, name, category_id")
        .eq("category_id", matchedCategory.id)
        .order("name", { ascending: true });

      if (subcategoriesError) {
        console.error(subcategoriesError);
        alert("Erro ao carregar subcategorias");
        return;
      }

      setSubcategories((subcategoriesData || []) as Subcategory[]);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    if (!selectedSubcategory) return products;

    return products.filter((product) => {
      return normalizeText(product.subcategory) === normalizeText(selectedSubcategory);
    });
  }, [products, selectedSubcategory]);

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "32px 24px",
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
      }}
    >
      {subcategories.length > 0 && (
        <aside
          style={{
            width: 240,
            minWidth: 240,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 20,
            position: "sticky",
            top: 24,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 16,
              color: "#111",
            }}
          >
            Subcategorias
          </div>

          <button
            type="button"
            onClick={() => setSelectedSubcategory(null)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: selectedSubcategory === null ? "#111" : "#fff",
              color: selectedSubcategory === null ? "#fff" : "#111",
              border: "1px solid #d1d5db",
              borderRadius: 10,
              padding: "10px 12px",
              fontWeight: 700,
              marginBottom: 10,
              cursor: "pointer",
            }}
          >
            Todos
          </button>

          {subcategories.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setSelectedSubcategory(sub.name)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background:
                  normalizeText(selectedSubcategory) === normalizeText(sub.name)
                    ? "#111"
                    : "#fff",
                color:
                  normalizeText(selectedSubcategory) === normalizeText(sub.name)
                    ? "#fff"
                    : "#111",
                border: "1px solid #d1d5db",
                borderRadius: 10,
                padding: "10px 12px",
                fontWeight: 600,
                marginBottom: 10,
                cursor: "pointer",
              }}
            >
              {sub.name}
            </button>
          ))}
        </aside>
      )}

      <main style={{ flex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 14,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            Catálogo
          </div>

          <h1
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: "#111",
              margin: 0,
            }}
          >
            {currentCategory ? currentCategory.name : "Categoria"}
          </h1>

          {selectedSubcategory && (
            <div
              style={{
                marginTop: 10,
                fontSize: 15,
                color: "#444",
              }}
            >
              Filtrando por: <strong>{selectedSubcategory}</strong>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ color: "#555", fontSize: 16 }}>Carregando...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ color: "#555", fontSize: 16 }}>
            Nenhum produto encontrado nesta categoria.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={product.slug ? `/equipamentos/${product.slug}` : "#"}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 260,
                    background: "#f3f4f6",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={product.image_url || ""}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                <div style={{ padding: 18 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 8,
                    }}
                  >
                    {product.category}
                    {product.subcategory ? ` • ${product.subcategory}` : ""}
                  </div>

                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      lineHeight: 1.15,
                      color: "#111",
                      marginBottom: 12,
                    }}
                  >
                    {product.name}
                  </div>

                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#111",
                    }}
                  >
                    R$ {Number(product.price || 0).toFixed(2)}
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "#6b7280",
                        marginLeft: 2,
                      }}
                    >
                      /dia
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
// estado estável após rollback
