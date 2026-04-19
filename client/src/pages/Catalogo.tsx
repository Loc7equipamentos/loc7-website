import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { supabase } from "../lib/supabase";

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

export default function Catalogo() {
  const { category } = useParams();
  const [, navigate] = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);

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

    const uniqueSubs = Array.from(
      new Set(sorted.map((p: Product) => p.subcategory).filter(Boolean))
    ) as string[];

    setSubcategories(uniqueSubs);
    setFilteredProducts(sorted);

    setLoading(false);
  };

  useEffect(() => {
    if (selectedSubcategory === "Todos") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p: Product) => p.subcategory === selectedSubcategory)
      );
    }
  }, [selectedSubcategory, products]);

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
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex gap-8">
        <aside className="hidden lg:block w-64">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-28">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Categorias
            </h2>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedSubcategory("Todos")}
                className={`text-left px-3 py-2 rounded-lg transition ${
                  selectedSubcategory === "Todos"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Todos
              </button>

              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`text-left px-3 py-2 rounded-lg transition ${
                    selectedSubcategory === sub
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="lg:hidden mb-6 overflow-x-auto flex gap-2">
            <button
              onClick={() => setSelectedSubcategory("Todos")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedSubcategory === "Todos"
                  ? "bg-black text-white"
                  : "bg-white border"
              }`}
            >
              Todos
            </button>

            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedSubcategory === sub
                    ? "bg-black text-white"
                    : "bg-white border"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/equipamentos/${product.slug}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer group overflow-hidden"
              >
                <div className="bg-white aspect-square flex items-center justify-center overflow-hidden">
                  <img
                    src={getImage(product)}
                    alt={product.name}
                    className="object-contain w-full h-full p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

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
                    <span className="inline-block mt-2 text-[10px] font-semibold bg-black text-white px-2 py-1 rounded">
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
        </main>
      </div>
    </div>
  );
}
