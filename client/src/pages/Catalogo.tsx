import { useState, useEffect } from "react";
import { ChevronDown, Menu, X, SlidersHorizontal } from "lucide-react";
import { useParams } from "wouter";
import ProductCard from "@/components/ProductCard";
import { supabase, type Product } from "@/lib/supabase";

const normalize = (text: string): string =>
  text?.toLowerCase().trim() || "";

export default function Catalogo() {
  const params = useParams<{ category?: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedSubcategory, setSelectedSubcategory] =
    useState("Todas");
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
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1)
          )
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

        const { data: categoriesData } = await supabase
          .from("categories")
          .select("name")
          .order("name");

        setCategories([
          "Todos",
          ...(categoriesData?.map((c) => c.name) || []),
        ]);

        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .order("name");

        setProducts(productsData || []);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "Todos" ||
      normalize(p.category) === normalize(selectedCategory);

    const matchSubcategory =
      selectedSubcategory === "Todas" ||
      normalize(p.subcategory) ===
        normalize(selectedSubcategory);

    const matchBrand =
      selectedBrand === "Todas" ||
      p.name
        ?.toLowerCase()
        .includes(selectedBrand.toLowerCase());

    return matchCategory && matchSubcategory && matchBrand;
  });

  const SidebarFilters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-[11px] uppercase text-neutral-500">
          Categorias
        </h3>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
              selectedCategory === cat
                ? "bg-black text-white"
                : "hover:bg-neutral-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <main className="w-full bg-[#f3f3f1]">
      
      {/* HEADER AJUSTADO */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1600px] px-6 pt-20 pb-4">
          <h1 className="text-3xl font-bold">CATÁLOGO</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {filteredProducts.length} equipamentos disponíveis
          </p>
        </div>
      </section>

      {/* CONTEÚDO AJUSTADO */}
      <section className="mx-auto max-w-[1600px] px-6 py-5">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr]">
          
          {/* SIDEBAR */}
          <aside className="hidden lg:block bg-white p-6 rounded-xl border">
            <SidebarFilters />
          </aside>

          {/* GRID */}
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
