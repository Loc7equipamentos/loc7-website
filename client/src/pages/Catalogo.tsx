import { useEffect, useState } from "react";
import { ArrowRight, Loader } from "lucide-react";
import { supabase, type Product } from "@/lib/supabase";
import { useParams } from "wouter";

function normalizeCategory(value: string = ""): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function Catalogo() {
  const params = useParams<{ category?: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todos"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const slugToCategoryName: Record<string, string> = {
    cameras: "Câmeras",
    lentes: "Lentes",
    iluminacao: "Iluminação",
    audio: "Audio",
    monitores: "Monitores",
    movimento: "Movimento",
    transmissores: "Transmissores",
    maquinaria: "Maquinária",
    câmeras: "Câmeras",
    iluminação: "Iluminação",
    áudio: "Audio",
    maquinária: "Maquinária",
  };

  useEffect(() => {
    if (!params.category) {
      setSelectedCategory("Todos");
      return;
    }

    try {
      const slug = decodeURIComponent(params.category);
      const categoryName =
        slugToCategoryName[slug] ||
        slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      setSelectedCategory(categoryName);
    } catch (err) {
      console.error("Erro ao decodificar categoria:", err);
      setSelectedCategory("Todos");
    }
  }, [params.category]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("name")
          .order("name");

        if (categoriesError) {
          throw categoriesError;
        }

        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (productsError) {
          throw productsError;
        }

        setCategories([
          "Todos",
          ...(categoriesData?.map((item) => item.name) ?? []),
        ]);
        setProducts(productsData ?? []);
      } catch (err) {
        console.error("Erro ao carregar catálogo:", err);
        setError("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "Todos" ||
      normalizeCategory(product.category || "") ===
        normalizeCategory(selectedCategory);

    const matchSearch = (product.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  function renderContent() {
    if (loading) {
      return (
        <div className="flex justify-center py-16">
          <Loader className="w-8 h-8 animate-spin text-gray-600" />
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">
            Nenhum produto encontrado com os filtros selecionados.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const productLink = product.slug
            ? `/equipamentos/${encodeURIComponent(product.slug)}`
            : "#";

          return (
            <a
              key={product.id}
              href={productLink}
              className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-200"
            >
              <div className="relative overflow-hidden aspect-square bg-gray-100">
                <img
                  src={
                    product.image_url ||
                    "https://via.placeholder.com/400x400?text=Sem+imagem"
                  }
                  alt={product.name || "Produto"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              <div className="p-4">
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">
                  {product.category}
                </p>

                <h3 className="text-gray-900 text-sm font-semibold leading-tight mb-3 line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-gray-900 text-lg font-bold">
                  R$ {Number(product.price || 0).toFixed(2)}
                  <span className="text-gray-500 text-sm font-normal">
                    /dia
                  </span>
                </p>
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-32 pb-16">
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Catálogo</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar equipamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg text-gray-900"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                selectedCategory === cat
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {renderContent()}

        <div className="mt-16 text-center">
          <a
            href="https://wa.me/5511997237850"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Falar no WhatsApp
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
