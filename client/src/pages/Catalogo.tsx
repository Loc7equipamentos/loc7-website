import { useState, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, LayoutGrid, Menu, X } from "lucide-react";
import { useParams } from "wouter";
import ProductCard from "@/components/ProductCard";
import { supabase, type Product } from "@/lib/supabase";

const normalize = (text: string): string => text?.toLowerCase().trim() || "";

export default function Catalogo() {
  const params = useParams<{ category?: string }>();

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
    } else {
      setSelectedCategory("Todos");
      setSelectedSubcategory("Todas");
    }
  }, [params.category]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: categoriesData } = await supabase
          .from("categories")
          .select("name")
          .order("name");

        const categoryNames = categoriesData?.map((c) => c.name) || [];
        setCategories(["Todos", ...categoryNames]);

        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .order("name", { ascending: true });

        setProducts(productsData || []);
      } catch (err) {
        console.error("Erro ao carregar catálogo:", err);
        setError("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "Todos" ||
      normalize(p.category || "") === normalize(selectedCategory);

    const matchSubcategory =
      selectedSubcategory === "Todas" ||
      normalize(p.subcategory || "") === normalize(selectedSubcategory);

    const matchBrand =
      selectedBrand === "Todas" ||
      p.name?.toLowerCase().includes(selectedBrand.toLowerCase());

    return matchCategory && matchSubcategory && matchBrand;
  });

  if (error) {
    return (
      <main className="min-h-screen bg-[#f3f3f1] pt-28">
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f1] text-neutral-900">

      {/* HEADER */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-28 sm:px-6 lg:px-10">
          <h1 className="text-3xl font-bold text-neutral-950">CATÁLOGO</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {loading
              ? "Carregando..."
              : `${filteredProducts.length} equipamentos disponíveis`}
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">

          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="rounded-2xl border bg-white p-6">
              <span className="text-sm font-semibold uppercase text-neutral-600">
                Filtros
              </span>
            </div>
          </aside>

          {/* PRODUTOS */}
          <div>
            {loading ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-[220px] animate-pulse rounded-xl bg-white" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
