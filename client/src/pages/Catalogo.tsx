import { useState, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, Menu, X } from "lucide-react";
import { useParams } from "wouter";
import ProductCard from "@/components/ProductCard";
import { supabase, type Product } from "@/lib/supabase";

const normalize = (text: string): string => text?.toLowerCase().trim() || "";

export default function Catalogo() {
  const params = useParams<{ category?: string }>();
  const isCategoryPage = !!params.category;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Todas");
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
      setSelectedBrand("Todas");
    } else {
      setSelectedCategory("Todos");
      setSelectedSubcategory("Todas");
      setSelectedBrand("Todas");
    }
  }, [params.category]);

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
          .order("name", { ascending: true });

        if (prodError) throw prodError;

        setProducts(productsData || []);
      } catch (err) {
        console.error("Erro ao carregar catálogo:", err);
        setError("Erro ao carregar produtos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const categoryScopedProducts = products.filter((p) =>
    selectedCategory === "Todos"
      ? true
      : normalize(p.category || "") === normalize(selectedCategory)
  );

  const availableSubcategories = categoryScopedProducts
    .map((p) => p.subcategory)
    .filter(Boolean) as string[];

  const uniqueSubcategories = Array.from(new Set(availableSubcategories.map(normalize)))
    .map(
      (normalized) =>
        availableSubcategories.find((sub) => normalize(sub) === normalized) || ""
    )
    .filter(Boolean);

  const subcategoryScopedProducts = categoryScopedProducts.filter((p) =>
    selectedSubcategory === "Todas"
      ? true
      : normalize(p.subcategory || "") === normalize(selectedSubcategory)
  );

 const uniqueBrands = Array.from(
  new Set(
    categoryScopedProducts
      .map((p) => (p.name ? p.name.split(" ")[0] : ""))
      .filter(Boolean)
  )
);

 const filteredProducts = categoryScopedProducts.filter((p) => {
  const matchSubcategory =
    selectedSubcategory === "Todas" ||
    normalize(p.subcategory || "") === normalize(selectedSubcategory);

  const matchBrand =
    selectedBrand === "Todas" ||
    p.name?.toLowerCase().includes(selectedBrand.toLowerCase());

  return matchSubcategory && matchBrand;
});
    

  const SidebarFilters = () => (
    <div className="space-y-8">
      {!isCategoryPage && (
        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Categorias
          </h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubcategory("Todas");
                  setSelectedBrand("Todas");
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedCategory === cat
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>{cat}</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      )}

      {uniqueSubcategories.length > 0 && (
        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Subcategorias
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                setSelectedSubcategory("Todas");
                setSelectedBrand("Todas");
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedSubcategory === "Todas"
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span>Todas</span>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </button>

            {uniqueSubcategories.map((subcat) => (
              <button
                key={subcat}
                onClick={() => {
                  setSelectedSubcategory(subcat);
                  setSelectedBrand("Todas");
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedSubcategory === subcat
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>{subcat}</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Marca
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedBrand("Todas")}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              selectedBrand === "Todas"
                ? "bg-neutral-900 text-white"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            <span>Todas</span>
            <ChevronDown className="h-4 w-4 opacity-60" />
          </button>

          {uniqueBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedBrand === brand
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <span>{brand}</span>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <main className="min-h-screen bg-[#f3f3f1] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1600px] rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f1] text-neutral-900">
      <section className="border-b border-neutral-200 bg-[#f3f3f1]">
        <div className="mx-auto max-w-[1600px] px-4 pb-4 pt-20 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-[28px] font-bold tracking-tight text-neutral-950 sm:text-4xl">
              CATÁLOGO
            </h1>
            <p className="text-sm text-neutral-500">
              {loading
                ? "Carregando produtos..."
                : `${filteredProducts.length} equipamentos disponíveis`}
            </p>

            {!isCategoryPage && (
              <div className="lg:hidden">
                <div className="-mx-4 mt-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
                  <div className="flex min-w-max gap-2 pb-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setSelectedSubcategory("Todas");
                          setSelectedBrand("Todas");
                        }}
                        className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
                          selectedCategory === cat
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-300 bg-white text-neutral-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}

                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filtros
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isCategoryPage && (
              <div className="lg:hidden">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="mt-2 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-10 lg:py-6">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
          <aside className="hidden self-start rounded-2xl border border-neutral-200 bg-white p-6 lg:block">
            <div className="mb-6 flex items-center gap-2">
              <Menu className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-700">
                Filtros
              </span>
            </div>
            <SidebarFilters />
          </aside>

          <div>
            {loading ? (
              <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
                  >
                    <div className="aspect-[4/3] w-full animate-pulse bg-neutral-100" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
                      <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-12 text-center">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Nenhum produto encontrado
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  Ajuste os filtros para encontrar outros equipamentos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="ml-auto h-full w-full max-w-sm overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
                <span className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-700">
                  Filtros
                </span>
              </div>

              <button onClick={() => setShowMobileFilters(false)}>
                <X className="h-5 w-5 text-neutral-700" />
              </button>
            </div>

            <SidebarFilters />

            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-8 w-full rounded-lg bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
