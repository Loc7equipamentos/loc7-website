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
  slug?: string;
  created_at?: string;
}

export default function Produto() {
  const [, params] = useRoute("/equipamentos/:slug");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.slug) {
        setErrorMessage("Slug do produto não informado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(null);

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", params.slug)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          setErrorMessage("Produto não encontrado.");
          setProduct(null);
          return;
        }

        setProduct(data[0]);
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
        setErrorMessage("Não foi possível carregar este produto.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <div className="max-w-6xl mx-auto text-center py-20">
          Carregando produto...
        </div>
      </div>
    );
  }

  if (errorMessage || !product) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-10">
        <div className="max-w-6xl mx-auto text-center py-20">
          <p className="text-lg text-gray-300 mb-6">
            {errorMessage || "Produto não encontrado."}
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white text-black font-medium hover:opacity-90 transition"
          >
            Voltar ao catálogo
          </Link>
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
