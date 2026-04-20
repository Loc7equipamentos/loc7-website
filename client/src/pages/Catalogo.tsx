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
    setFilteredProducts(sorted);

    setLoading(false);
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
