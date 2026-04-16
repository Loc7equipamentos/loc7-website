import { useRoute, Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  images?: string[] | null;
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
  const [selectedImage, setSelectedImage] = useState<string>("");

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

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

        const fetchedProduct = data[0] as Product;
        setProduct(fetchedProduct);
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

  const galleryImages = useMemo(() => {
    if (!product) return [];

    const fromArray = Array.isArray(product.images)
      ? product.images.map((img) => img?.trim()).filter(Boolean)
      : [];

    const fallback = product.image_url?.trim() ? [product.image_url.trim()] : [];

    const merged = [...fromArray, ...fallback];
    return Array.from(new Set(merged));
  }, [product]);

  useEffect(() => {
    if (galleryImages.length > 0) {
      setSelectedImage(galleryImages[0]);
    } else {
      setSelectedImage("");
    }
  }, [galleryImages]);

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
              R$ {formatPrice(product.price)}
              <span className="text-gray-400 text-lg md:text-xl font-normal">/dia</span>
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div>
            <div className="bg-[oklch(0.08_0_0)] border border-[oklch(0.18_0_0)] rounded-2xl overflow-hidden">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full min-h-[320px] flex items-center justify-center text-gray-500">
                  Imagem não disponível
                </div>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
                {galleryImages.map((image, index) => {
                  const isActive = selectedImage === image;

                  return (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`rounded-xl overflow-hidden border transition ${
                        isActive
                          ? "border-white ring-2 ring-white/30"
                          : "border-[oklch(0.18_0_0)] hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
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
