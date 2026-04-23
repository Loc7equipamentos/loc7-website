// CÓDIGO COMPLETO ATUALIZADO (APENAS AJUSTE #1 APLICADO)

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { supabase, type Product } from "@/lib/supabase";

// ... (SEM ALTERAÇÃO NAS FUNÇÕES AUXILIARES)

export default function Produto() {
  const params = useParams<{ slug?: string }>();
  const slug = params.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) {
        setError("Produto não encontrado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setError("Produto não encontrado.");
          setProduct(null);
          return;
        }

        setProduct(data);
        setSelectedImage(0);
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
        setError("Erro ao carregar produto.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const parsedImages = parseImages(product.images);
    const allImages = [product.image_url, ...parsedImages].filter(
      (img): img is string => typeof img === "string" && img.trim() !== ""
    );

    return Array.from(new Set(allImages));
  }, [product]);

  const includes = useMemo(() => (product ? parseIncludes(product.includes) : []), [product]);
  const specs = useMemo(() => (product ? buildSpecs(product) : []), [product]);

  const currentImage = gallery[selectedImage] || product?.image_url || "";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f3f1] pt-28">
        <div className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[96px_minmax(0,1fr)_360px]">
            <div className="hidden lg:flex lg:flex-col lg:gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded-xl bg-neutral-200" />
              ))}
            </div>

            <div className="h-[320px] animate-pulse rounded-2xl bg-white sm:h-[360px] lg:h-[420px]" />
            <div className="rounded-2xl bg-white p-6">
              <div className="mb-4 h-5 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="mb-3 h-10 w-2/3 animate-pulse rounded bg-neutral-200" />
              <div className="mb-8 h-5 w-1/3 animate-pulse rounded bg-neutral-200" />
              <div className="mb-3 h-12 w-full animate-pulse rounded bg-neutral-200" />
              <div className="h-12 w-full animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#f3f3f1] pt-28">
        <div className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
            {error || "Produto não encontrado."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f1] pt-28 text-neutral-900">
      <div className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[96px_minmax(0,1fr)_360px]">

          {/* GALERIA */}
          <aside className="hidden lg:flex lg:flex-col lg:gap-2">
            {gallery.map((image, index) => (
              <button
                key={image + index}
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-xl border bg-white ${
                  selectedImage === index
                    ? "border-neutral-900 shadow-sm"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="aspect-square p-2">
                  <img src={image} className="h-full w-full object-contain" />
                </div>
              </button>
            ))}
          </aside>

          {/* IMAGEM */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex h-[320px] items-center justify-center sm:h-[360px] lg:h-[420px]">
              <img
                src={currentImage}
                className="max-h-[90%] max-w-[90%] object-contain"
              />
            </div>
          </div>

          {/* INFO */}
          <aside className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h1 className="text-3xl font-semibold">{product.name}</h1>

            <div className="mt-6 space-y-3">
              <a className="flex w-full justify-center rounded-lg bg-black py-3 text-white">
                Reservar agora
              </a>

              <a className="text-sm underline">Tirar dúvidas</a>
            </div>
          </aside>

        </section>
      </div>
    </main>
  );
}
