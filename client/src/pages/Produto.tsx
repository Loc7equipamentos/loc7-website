import { useRoute } from "wouter";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  subcategory?: string;
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
      <div className="text-white text-center py-20">
        Carregando produto...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* 🔥 TOPO CORRIGIDO (SEM REDUNDÂNCIA) */}
        <p className="text-sm text-gray-400 mb-2 uppercase tracking-widest">
          {product.subcategory || product.category}
        </p>

        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          {product.name}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          <div>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full rounded-xl object-cover"
            />
          </div>

          <div>
            <p className="text-gray-300 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* 🔽 Se existir outro bloco de categoria abaixo, mantemos */}
            <div className="text-sm text-gray-500">
              Categoria: {product.subcategory || product.category}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
