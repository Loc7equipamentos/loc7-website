import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import {
  Camera,
  Aperture,
  Zap,
  Mic,
  Monitor,
  Move,
  Radio,
  Clapperboard,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { categoryConfig, getCategoryConfigBySlug } from "../config/categories";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string | null;
  price?: number | null;
  image_url?: string | null;
  images?: string[] | null;
  badge?: string | null;
  catalog_order?: number | null;
};

type CategoryTab = {
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
};

const categoryTabs: CategoryTab[] = [
  { name: "Câmeras", slug: "cameras", icon: Camera },
  { name: "Lentes", slug: "lentes", icon: Aperture },
  { name: "Iluminação", slug: "iluminacao", icon: Zap },
  { name: "Áudio", slug: "audio", icon: Mic },
  { name: "Monitores", slug: "monitores", icon: Monitor },
  { name: "Movimento", slug: "movimento", icon: Move },
  { name: "Transmissores", slug: "transmissores", icon: Radio },
  { name: "Maquinária", slug: "maquinaria", icon: Clapperboard },
];

function normalizeText(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatPrice(price?: number | null) {
  if (price === null || price === undefined || Number.isNaN(price)) {
    return "Sob consulta";
  }

  return `R$ ${price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}/dia`;
}

function getPrimaryImage(product: Product) {
  const gallery = Array.isArray(product.images) ? product.images : [];
  return gallery[0] || product.image_url || "/placeholder-image.jpg";
}

export default function Catalogo() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute("/catalogo/:category");
  const categorySlug = params?.category || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("todos");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("catalog_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) {
        setError("Não foi possível carregar o catálogo.");
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts((data || []) as Product[]);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedSubcategory("todos");
  }, [categorySlug]);

  const activeCategoryConfig = useMemo(() => {
    if (!categorySlug) return null;
    return getCategoryConfigBySlug(categorySlug);
  }, [categorySlug]);

  const filteredProducts = useMemo(() => {
    const ordered = [...products].sort((a, b) => {
      const aOrder = a.catalog_order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.catalog_order ?? Number.MAX_SAFE_INTEGER;

      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.name.localeCompare(b.name, "pt-BR");
    });

    if (!categorySlug) {
      return ordered;
    }

    const activeCategorySlug = normalizeText(categorySlug);
    const categoryProducts = ordered.filter((product) => {
      const productCategory = normalizeText(product.category);
      return productCategory === activeCategorySlug;
    });

    if (
      !activeCategoryConfig ||
      !activeCategoryConfig.subcategories ||
      activeCategoryConfig.subcategories.length === 0 ||
      selectedSubcategory === "todos"
    ) {
      return categoryProducts;
    }

    return categoryProducts.filter((product) => {
      const productSub = normalizeText(product.subcategory);
      return productSub === normalizeText(selectedSubcategory);
    });
  }, [products, categorySlug, activeCategoryConfig, selectedSubcategory]);

  const title = activeCategoryConfig?.name || "Catálogo";

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-14">
      {/* Barra horizontal premium */}
      <section className="sticky top-[72px] z-30 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 min-w-max py-3">
              <button
                type="button"
                onClick={() => setLocation("/catalogo")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition ${
                  !categorySlug
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/15 hover:border-white/30 hover:bg-white/5"
                }`}
              >
                Todos
              </button>

              {categoryTabs.map((category) => {
                const Icon = category.icon;
                const active = category.slug === categorySlug;

                return (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => setLocation(`/catalogo/${category.slug}`)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition ${
                      active
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white border-white/15 hover:border-white/30 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
            {title}
          </h1>

          {activeCategoryConfig?.description && (
            <p className="mt-2 text-zinc-600 text-sm md:text-base">
              {activeCategoryConfig.description}
            </p>
          )}
        </div>

        {/* Subcategorias APENAS quando existe categoria ativa */}
        {activeCategoryConfig?.subcategories &&
          activeCategoryConfig.subcategories.length > 0 && (
            <div className="mb-8 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 min-w-max">
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory("todos")}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition whitespace-nowrap ${
                    selectedSubcategory === "todos"
                      ? "bg-black text-white border-black"
                      : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  Todos
                </button>

                {activeCategoryConfig.subcategories.map((subcategory: string) => {
                  const active =
                    normalizeText(selectedSubcategory) === normalizeText(subcategory);

                  return (
                    <button
                      key={subcategory}
                      type="button"
                      onClick={() => setSelectedSubcategory(subcategory)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition whitespace-nowrap ${
                        active
                          ? "bg-black text-white border-black"
                          : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      {subcategory}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-zinc-200 p-4 animate-pulse"
              >
                <div className="aspect-[4/4] rounded-2xl bg-zinc-100 mb-4" />
                <div className="h-5 w-3/4 bg-zinc-100 rounded mb-2" />
                <div className="h-4 w-1/3 bg-zinc-100 rounded mb-3" />
                <div className="h-5 w-1/2 bg-zinc-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            <h2 className="text-lg font-semibold mb-2">Erro ao carregar catálogo</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-zinc-900 mb-2">
              Nenhum produto encontrado
            </h2>
            <p className="text-zinc-600">
              Não encontramos produtos para este filtro no momento.
            </p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/equipamentos/${product.slug}`}>
                <a className="group block bg-white rounded-3xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="aspect-[4/4] bg-white p-4 overflow-hidden">
                    <img
                      src={getPrimaryImage(product)}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>

                  <div className="px-4 pb-5">
                    <h3 className="text-zinc-900 font-semibold leading-snug line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>

                    <p className="text-sm text-zinc-500 mt-1">
                      {product.subcategory || product.category}
                    </p>

                    {product.badge && (
                      <div className="mt-3">
                        <span className="inline-flex items-center rounded-full bg-black text-white text-[11px] font-semibold px-2.5 py-1 uppercase tracking-wide">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    <div className="mt-4">
                      <p className="text-zinc-900 text-xl font-bold">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
