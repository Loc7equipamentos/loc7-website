import { useRoute, Link } from "wouter";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  subcategory?: string;
  price?: number;
}

export default function Produto() {
  const [, params] = useRoute("/equipamentos/:slug");
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.slug) return;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", params.slug)
        .single();

      if (!error) setProduct(data);
    };

    fetchProduct();
  }, [params?.slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <div className="max-w-6xl mx-auto text-center py-20">
          Carregando produto...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-2 uppercase tracking-wider">
            <Link href="/catalogo" className="hover:text-white transition-colors">
              Locação
            </Link>

            <span>/</span>

            <span className="text-gray-400">{product.category}</span>

            {product.subcategory && (
              <>
                <span>/</span>
                <span className="text-gray-400">{product.subcategory}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {product.name}
          </h1>

          {typeof product.price === "number" && (
            <p className="text-2xl md:text-3xl font-semibold text-white">
              R$ {product.price.toFixed(2)}
              <span className="text-gray-400 text-lg md:text-xl font-normal">/dia</span>
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="bg-[oklch(0.08_0_0)] border border-[oklch(0.18_0_0)] rounded-2xl overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-[oklch(0.08_0_0)] border border-[oklch(0.18_0_0)] rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold text-white mb-4">Descrição</h2>

            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {product.description || "Descrição não informada."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
