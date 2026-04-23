/*
 * LOC 7 — Catálogo Page
 * Cinema Noir Industrial style
 * Product grid with filters, search, and WhatsApp CTA
 * Integrado com Supabase para sincronização em tempo real
 */

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowRight, Loader } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase, type Product } from "@/lib/supabase";
import { useParams } from "wouter";

const brands = ["Todas", "Sony", "Canon", "RED", "Blackmagic", "Arri", "Aputure", "Zeiss", "DJI", "Godox"];

const normalize = (text: string): string => {
  return text?.toLowerCase().trim() || "";
};

export default function Catalogo() {
  const { addItem } = useCart();
  const params = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Todas");
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const slugToCategoryName: Record<string, string> = {
    cameras: "Câmeras",
    lentes: "Lentes",
    iluminacao: "Iluminação",
    audio: "Áudio",
    monitores: "Monitores",
    movimento: "Movimento",
    transmissores: "Transmissores",
    maquinaria: "Maquinária",
  };

  useEffect(() => {
    if (params.category) {
      const categoryName =
        slugToCategoryName[params.category] ||
        params.category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      setSelectedCategory(categoryName);
      setSelectedSubcategory("Todas");
    } else {
      setSelectedCategory("Todos");
      setSelectedSubcategory("Todas");
    }
  }, [params.category]);

  useEffect(() => {
    setSelectedSubcategory("Todas");
  }, [selectedCategory]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: categoriesData, error: catError } = await supabase
          .from("categories")
          .select("name")
          .order("name");

        if (catError) throw catError;

        const categoryNames = categoriesData?.map((c) => c.name) || [];
        setCategories(["Todos", ...categoryNames]);

        const { data: productsData, error: prodError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (prodError) throw prodError;

        setProducts(productsData || []);

        if (productsData && productsData.length > 0) {
          const maxPrice = Math.max(...productsData.map((p) => p.price));
          setPriceRange([0, Math.ceil(maxPrice / 100) * 100]);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar produtos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const subscription = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const availableSubcategories = products
    .filter((p) =>
      selectedCategory === "Todos"
        ? true
        : normalize(p.category) === normalize(selectedCategory)
    )
    .map((p) => p.subcategory)
    .filter(Boolean) as string[];

  const uniqueSubcategories = Array.from(new Set(availableSubcategories.map(normalize)))
    .map(
      (normalized) =>
        availableSubcategories.find((sub) => normalize(sub) === normalized) || ""
    )
    .filter(Boolean);

  const filtered = products
    .filter((p) => {
      const matchCategory =
        selectedCategory === "Todos" ||
        normalize(p.category) === normalize(selectedCategory);

      const matchSubcategory =
        selectedSubcategory === "Todas" ||
        normalize(p.subcategory || "") === normalize(selectedSubcategory);

      const matchBrand =
        selectedBrand === "Todas" ||
        (p.name?.toLowerCase().includes(selectedBrand.toLowerCase()) ?? false);

      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

      return (
        matchCategory &&
        matchSubcategory &&
        matchBrand &&
        matchSearch &&
        matchPrice
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

  if (error) {
    return (
      <div className="min-h-screen bg-[oklch(0.08_0_0)] pt-32 pb-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Erro ao carregar catálogo</h1>
            <p className="text-[oklch(0.7_0_0)] mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="loc7-btn-primary"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] pt-32 pb-16">
      <div className="container">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">CATÁLOGO</h1>
          <p className="text-[oklch(0.7_0_0)] text-lg">
            {loading ? "Carregando produtos..." : `${filtered.length} produtos encontrados`}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(0.45_0_0)]" />
            <input
              type="text"
              placeholder="Buscar equipamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[oklch(0.12_0_0)] border border-[oklch(0.18_0_0)] rounded text-white placeholder-[oklch(0.45_0_0)] focus:outline-none focus:border-[oklch(0.45_0.25_25)]"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-[oklch(0.45_0.25_25)] hover:text-white transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          </button>

          {showFilters && (
            <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.18_0_0)] rounded p-6 space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Categorias</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        selectedCategory === cat
                          ? "bg-[oklch(0.45_0.25_25)] text-white"
                          : "bg-[oklch(0.18_0_0)] text-[oklch(0.7_0_0)] hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {uniqueSubcategories.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">Subcategorias</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button
                      onClick={() => setSelectedSubcategory("Todas")}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        selectedSubcategory === "Todas"
                          ? "bg-[oklch(0.45_0.25_25)] text-white"
                          : "bg-[oklch(0.18_0_0)] text-[oklch(0.7_0_0)] hover:text-white"
                      }`}
                    >
                      Todas
                    </button>
                    {uniqueSubcategories.map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => setSelectedSubcategory(subcat)}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          selectedSubcategory === subcat
                            ? "bg-[oklch(0.45_0.25_25)] text-white"
                            : "bg-[oklch(0.18_0_0)] text-[oklch(0.7_0_0)] hover:text-white"
                        }`}
                      >
                        {subcat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-white font-semibold mb-3">Marcas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        selectedBrand === brand
                          ? "bg-[oklch(0.45_0.25_25)] text-white"
                          : "bg-[oklch(0.18_0_0)] text-[oklch(0.7_0_0)] hover:text-white"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Faixa de Preço</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                </div>
                <p className="text-[oklch(0.7_0_0)] text-sm mt-2">
                  R$ {priceRange[0]} - R$ {priceRange[1]}
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Ordenar por</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-[oklch(0.18_0_0)] border border-[oklch(0.18_0_0)] rounded text-white focus:outline-none focus:border-[oklch(0.45_0.25_25)]"
                >
                  <option value="relevance">Relevância</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name-asc">Nome A-Z</option>
                  <option value="name-desc">Nome Z-A</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 text-[oklch(0.45_0.25_25)] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[oklch(0.7_0_0)] text-lg">
              Nenhum produto encontrado com os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => {
              const productLink = product.slug ? `/equipamentos/${product.slug}` : null;
              const coverImage = [product.image_url, ...(product.images || [])].filter(Boolean)[0];

              return (
                <a
                  key={product.id}
                  href={productLink || "#"}
                  className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="relative overflow-hidden aspect-square bg-gray-100">
                    <img
                      src={coverImage || "https://via.placeholder.com/400x400?text=Sem+imagem"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">
                      {product.subcategory || product.category}
                    </p>
                    <h3 className="text-gray-900 text-sm font-semibold leading-tight mb-3 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.badge && (
                      <p className="text-blue-600 text-xs font-semibold mb-3">{product.badge}</p>
                    )}
                    <p className="text-gray-900 text-lg font-bold">
                      R$ {product.price.toFixed(2)}
                      <span className="text-gray-500 text-sm font-normal">/dia</span>
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <div className="mt-16 bg-gradient-to-r from-[oklch(0.12_0_0)] to-[oklch(0.08_0_0)] border border-[oklch(0.18_0_0)] rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Não encontrou o que procura?</h2>
          <p className="text-[oklch(0.7_0_0)] mb-6">
            Fale com nossos especialistas para soluções customizadas
          </p>
          <a
            href="https://wa.me/5511997237850"
            target="_blank"
            rel="noopener noreferrer"
            className="loc7-btn-primary inline-flex items-center gap-2"
          >
            Falar com especialista
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
