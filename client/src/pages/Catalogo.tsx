// [ARQUIVO COMPLETO AJUSTADO]

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

// 🔥 NORMALIZADOR (ponto crítico)
const normalize = (str?: string) =>
  (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function Catalogo() {
  const { addItem } = useCart();
  const params = useParams<{ category?: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("Todos");
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

  // URL → categoria
  useEffect(() => {
    if (params.category) {
      const categoryName =
        slugToCategoryName[params.category] ||
        params.category
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

      setSelectedCategory(categoryName);
    } else {
      setSelectedCategory("Todos");
    }
  }, [params.category]);

  // Carregar dados
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
          .order("created_at", { ascending: false });

        setProducts(productsData || []);

        if (productsData && productsData.length > 0) {
          const maxPrice = Math.max(...productsData.map((p) => p.price));
          setPriceRange([0, Math.ceil(maxPrice / 100) * 100]);
        }
      } catch (err) {
        setError("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const sub = supabase
      .channel("products")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, loadData)
      .subscribe();

    return () => sub.unsubscribe();
  }, []);

  // 🔥 FILTRO CORRIGIDO
  const filtered = products
    .filter((p) => {
      const matchCat =
        selectedCategory === "Todos" ||
        normalize(p.category) === normalize(selectedCategory);

      const matchBrand =
        selectedBrand === "Todas" ||
        normalize(p.name).includes(normalize(selectedBrand));

      const matchSearch = normalize(p.name).includes(normalize(searchQuery));

      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

      return matchCat && matchBrand && matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      return 0;
    });

  if (error) {
    return <div className="pt-32 text-center text-white">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] pt-32 pb-16">
      <div className="container">

        <h1 className="text-5xl text-white mb-8">CATÁLOGO</h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader className="animate-spin text-white" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <a key={p.id} href={`/equipamentos/${p.slug}`}>
                <div className="bg-white p-4 rounded">
                  <img src={p.image_url} className="w-full mb-3" />
                  <p className="text-xs text-gray-500">{p.category}</p>
                  <h3 className="text-sm font-semibold">{p.name}</h3>
                  <p className="font-bold">R$ {p.price}</p>
                </div>
              </a>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
