import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";

type Product = {
  id: string;
  name: string;
  slug?: string | null;
  category?: string | null;
  subcategory?: string | null;
  price?: number | null;
  description?: string | null;
  includes?: string[] | string | null;
  image_url?: string | null;
  images?: string[] | string | null;
  badge?: string | null;
  is_featured?: boolean | null;
  featured_order?: number | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  audio: "Áudio",
  cameras: "Câmeras",
  computadorestablets: "Computadores e Tablets",
  comunicadores: "Comunicadores",
  conversoresdistribuidores: "Conversores e Distribuidores",
  estabilizadores: "Estabilizadores",
  filtros: "Filtros",
  followfocus: "Follow Focus",
  gravadores: "Gravadores",
  hdscartoes: "HDs e Cartões",
  iluminacao: "Iluminação",
  lentes: "Lentes",
  maquinaria: "Maquinária",
  mattebox: "Mattebox",
  monitores: "Monitores",
  movimento: "Movimento",
  still: "Still",
  switchers: "Switchers",
  teleprompter: "Teleprompter",
  transmissores: "Transmissores",
  tripes: "Tripés",
};

const CATEGORY_ORDER = [
  "cameras",
  "lentes",
  "iluminacao",
  "audio",
  "monitores",
  "movimento",
  "transmissores",
  "switchers",
  "tripes",
  "estabilizadores",
  "gravadores",
  "filtros",
  "mattebox",
  "followfocus",
  "maquinaria",
  "still",
  "comunicadores",
  "conversoresdistribuidores",
  "computadorestablets",
  "hdscartoes",
  "teleprompter",
];

const SUBCATEGORY_MAP: Record<string, string[]> = {
  cameras: ["PTZ", "Broadcast", "Mirrorless", "Cinema"],
  lentes: ["E-Mount", "EF-Mount", "RF-Mount", "PL-Mount", "Broadcast"],
  iluminacao: ["LED", "Fresnel", "Tubos", "Painéis", "Modificadores"],
};

function safeString(value: unknown, fallback: string = ""): string {
  return typeof value === "string" ? value : fallback;
}

function safeNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function safeNumber(value: unknown): number | null {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function normalizeCategory(value?: string | null) {
  if (!value || typeof value !== "string") return "";

  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "e")
    .replace(/\//g, "")
    .replace(/\s+/g, "")
    .replace(/-/g, "");
}

function getCategoryLabel(slug: string) {
  return CATEGORY_LABELS[slug] || slug;
}

function sanitizeProduct(raw: any): Product | null {
  if (!raw || typeof raw !== "object") return null;

  const id =
    typeof raw.id === "string" || typeof raw.id === "number"
      ? String(raw.id)
      : "";

  const name = safeString(raw.name).trim();

  if (!id || !name) return null;

  return {
    id,
    name,
    slug: safeNullableString(raw.slug),
    category: safeNullableString(raw.category),
    subcategory: safeNullableString(raw.subcategory),
    price: safeNumber(raw.price),
    description: safeNullableString(raw.description),
    includes: raw.includes ?? null,
    image_url: safeNullableString(raw.image_url),
    images: raw.images ?? null,
    badge: safeNullableString(raw.badge),
    is_featured: typeof raw.is_featured === "boolean" ? raw.is_featured : null,
    featured_order: safeNumber(raw.featured_order),
  };
}

export default function Catalogo() {
  const [location, setLocation] = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryFromRoute = useMemo(() => {
    const parts = location.split("/").filter(Boolean);
    if (parts[0] === "catalogo" && parts[1]) {
      return normalizeCategory(parts[1]);
    }
    return "";
  }, [location]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();

    for (const product of products) {
      const normalized = normalizeCategory(product.category);
      if (normalized) set.add(normalized);
    }

    const fromOrder = CATEGORY_ORDER.filter((cat) => set.has(cat));
    const remaining = Array.from(set).filter((cat) => !CATEGORY_ORDER.includes(cat));

    return [...fromOrder, ...remaining];
  }, [products]);

  const availableSubcategories = useMemo(() => {
    if (!categoryFromRoute) return [];

    if (SUBCATEGORY_MAP[categoryFromRoute]) {
      return SUBCATEGORY_MAP[categoryFromRoute];
    }

    const subs = new Set<string>();

    for (const product of products) {
      if (
        normalizeCategory(product.category) === categoryFromRoute &&
        typeof product.subcategory === "string" &&
        product.subcategory.trim() !== ""
      ) {
        subs.add(product.subcategory);
      }
    }

    return Array.from(subs);
  }, [products, categoryFromRoute]);

  const filteredProducts = useMemo(() => {
    let next = [...products];

    if (categoryFromRoute) {
      next = next.filter(
        (product) => normalizeCategory(product.category) === categoryFromRoute
      );
    }

    if (selectedSubcategory !== "Todos") {
      next = next.filter((product) => product.subcategory === selectedSubcategory);
    }

    return next;
  }, [products, categoryFromRoute, selectedSubcategory]);

  useEffect(() => {
    setSelectedSubcategory("Todos");
  }, [categoryFromRoute]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("name", { ascending: true });

        if (error) {
          console.error("Erro ao carregar produtos:", error);
          setError("Não foi possível carregar o catálogo.");
          setProducts([]);
          return;
        }

        const sanitized = Array.isArray(data)
          ? data.map(sanitizeProduct).filter(Boolean) as Product[]
          : [];

        setProducts(sanitized);
      } catch (err) {
        console.error("Erro inesperado no catálogo:", err);
        setError("Ocorreu um erro ao montar o catálogo.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const currentCategoryLabel = categoryFromRoute
    ? getCategoryLabel(categoryFromRoute)
    : "Todos os Equipamentos";

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-24 sm:px-6 lg:px-10 lg:pt-28">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.20em] text-neutral-500">
              Catálogo Loc7
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
              {currentCategoryLabel}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-[15px]">
              Equipamentos profissionais para produções audiovisuais, broadcast,
              publicidade, conteúdo e operação técnica de alto nível.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <div className="flex min-w-max gap-2 pb-1">
              <button
                onClick={() => setLocation("/catalogo")}
                className={`rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                  !categoryFromRoute
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:text-black"
                }`}
              >
                Todos
              </button>

              {availableCategories.map((category) => {
                const isActive = categoryFromRoute === category;

                return (
                  <button
                    key={category}
                    onClick={() => setLocation(`/catalogo/${category}`)}
                    className={`rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                      isActive
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:text-black"
                    }`}
                  >
                    {getCategoryLabel(category)}
                  </button>
                );
              })}
            </div>
          </div>

          {categoryFromRoute && availableSubcategories.length > 0 && (
            <div className="mt-5 overflow-x-auto">
              <div className="flex min-w-max gap-2 pb-1">
                <button
                  onClick={() => setSelectedSubcategory("Todos")}
                  className={`rounded-full px-4 py-2 text-[12px] font-medium transition-all duration-200 ${
                    selectedSubcategory === "Todos"
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 hover:text-black"
                  }`}
                >
                  Todos
                </button>

                {availableSubcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`rounded-full px-4 py-2 text-[12px] font-medium transition-all duration-200 ${
                      selectedSubcategory === sub
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 hover:text-black"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-500">
            {loading
              ? "Carregando catálogo..."
              : `${filteredProducts.length} ${
                  filteredProducts.length === 1 ? "produto" : "produtos"
                }`}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[18px] border border-neutral-200 bg-white"
              >
                <div className="aspect-[4/3] w-full animate-pulse bg-neutral-200" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-neutral-900">
              Nenhum produto encontrado
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Tente trocar a categoria ou subcategoria para visualizar outros itens.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
