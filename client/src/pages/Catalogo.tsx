import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { supabase } from "../lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price?: number;
  image_url?: string;
  images?: string[];
  badge?: string;
  slug: string;
  catalog_order?: number;
}

// Categorias hardcoded
const CATEGORIES = [
  { name: "Câmeras", slug: "cameras" },
  { name: "Lentes", slug: "lentes" },
  { name: "Iluminação", slug: "iluminacao" },
  { name: "Áudio", slug: "audio" },
  { name: "Monitores", slug: "monitores" },
  { name: "Movimento", slug: "movimento" },
  { name: "Transmissores", slug: "transmissores" },
  { name: "Maquinária", slug: "maquinaria" },
];

export default function Catalogo() {
  const { category } = useParams();
  const [, navigate] = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const normalize = (str?: string) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const currentCategory = normalize(category);

    const filtered = category
      ? data.filter((p: Product) => normalize(p.category) === currentCategory)
      : data;

    const sorted = [...filtered].sort((a: Product, b: Product) => {
      const orderA = a.catalog_order ?? 9999;
      const orderB = b.catalog_order ?? 9999;
      return orderA - orderB;
    });

    setProducts(sorted);
    setFilteredProducts(sorted);

    setLoading(false);
  };

  // Verificar scroll position
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return "";
    return `R$ ${price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getImage = (p: Product) => {
    if (p.images && p.images.length > 0) return p.images[0];
    return p.image_url;
  };

  if (loading) {
    return (
      <div className="pt-32 text-center text-white">
        Carregando catálogo...
      </div>
    );
  }

  return (
    <div className="pt-24 bg-gray-50 min-h-screen">
      {/* PREMIUM CATEGORY BAR */}
      <div className="bg-white border-b border-gray-200 sticky top-24 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="relative flex items-center">
            {/* Left fade gradient */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            )}

            {/* Left scroll button */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}

            {/* Scroll container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide py-4 px-8"
              style={{ scrollBehavior: "smooth" }}
            >
              {/* "Todos" button */}
              <button
                onClick={() => navigate("/catalogo")}
                className={`flex-shrink-0 px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                  !category
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos
              </button>

              {/* Category buttons */}
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => navigate(`/catalogo/${cat.slug}`)}
                  className={`flex-shrink-0 px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    normalize(category) === cat.slug
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Right fade gradient */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            )}

            {/* Right scroll button */}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/equipamentos/${product.slug}`)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer group overflow-hidden"
            >
              {/* IMAGE */}
              <div className="bg-white aspect-square flex items-center justify-center overflow-hidden">
                <img
                  src={getImage(product)}
                  alt={product.name}
                  className="object-contain w-full h-full p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* INFO */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {product.name}
                </h3>

                {product.subcategory && (
                  <p className="text-xs text-gray-500 mt-1">
                    {product.subcategory}
                  </p>
                )}

                {product.badge && (
                  <span className="inline-block mt-2 text-[10px] font-semibold bg-gray-900 text-white px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}

                {product.price && (
                  <p className="mt-3 text-sm font-bold text-gray-900">
                    {formatPrice(product.price)}
                    <span className="text-xs text-gray-500 font-normal">/dia</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
