import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { supabase, type Product } from "@/lib/supabase";
import { getWhatsAppLink } from "@/lib/whatsapp";

type ProductImage = string;

function parseImages(images: unknown): ProductImage[] {
  if (Array.isArray(images)) {
    return images.filter((img): img is string => typeof img === "string" && img.trim() !== "");
  }

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.filter((img): img is string => typeof img === "string" && img.trim() !== "");
      }
    } catch {
      return images.trim() ? [images] : [];
    }
  }

  return [];
}

function parseIncludes(includes: unknown): string[] {
  if (Array.isArray(includes)) {
    return includes.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  }

  if (typeof includes === "string") {
    try {
      const parsed = JSON.parse(includes);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string" && item.trim() !== "");
      }
    } catch {
      return includes
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

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

  const currentImage = gallery[selectedImage] || product?.image_url || "";

  const reserveLink = product
    ? getWhatsAppLink({
        context: "product_reserve",
        productName: product.name,
      })
    : "#";

  const questionLink = product
    ? getWhatsAppLink({
        context: "product_question",
        productName: product.name,
      })
    : "#";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f3f1] pt-24">
        <div className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mb-3 h-4 w-64 animate-pulse rounded bg-neutral-200" />
          <div className="grid gap-5 lg:grid-cols-[88px_minmax(0,1fr)_360px]">
            <div className="hidden lg:flex lg:flex-col lg:gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded-xl bg-neutral-200" />
              ))}
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
              <div className="h-[320px] animate-pulse rounded-xl bg-neutral-100 sm:h-[380px] lg:h-[440px]" />
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="mb-4 h-10 w-3/4 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#f3f3f1] pt-24">
        <div className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
            {error || "Produto não encontrado."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f1] pt-24 text-neutral-900">
      <div className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[88px_minmax(0,1fr)_360px]">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            <img src={currentImage} alt={product.name} className="object-contain" />
          </div>

          <aside className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
            <h1 className="text-3xl font-semibold">{product.name}</h1>

            <div className="mt-5 space-y-3">
              <a href={reserveLink} target="_blank" className="block bg-black text-white p-3 rounded">
                Reservar agora
              </a>

              <a href={questionLink} target="_blank" className="block border p-3 rounded">
                Tirar dúvidas com especialista
              </a>
            </div>

            {product.price && (
              <div className="mt-5">
                <div className="text-2xl font-semibold">
                  R$ {Number(product.price).toLocaleString("pt-BR")}
                </div>

                {(product as any).is_featured_special && (
                  <a
                    href={getWhatsAppLink({
                      context: "product_special",
                      productName: product.name,
                    })}
                    target="_blank"
                    className="mt-3 block rounded-md border border-red-500/15 bg-red-500/5 px-3 py-2 text-[12px] font-medium text-red-800/80 transition hover:bg-red-500/10"
                  >
                    Condições diferenciadas disponíveis
                  </a>
                )}
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
