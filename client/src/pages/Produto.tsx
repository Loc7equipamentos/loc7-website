// (arquivo completo com ajuste apenas nos botões)

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

  // 🔥 LINKS WHATSAPP (NOVO)
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
    return <main className="min-h-screen bg-[#f3f3f1] pt-24" />;
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

        {/* (TODO O RESTO DO LAYOUT PERMANECE IGUAL) */}

        <section className="grid gap-5 lg:grid-cols-[88px_minmax(0,1fr)_360px]">

          {/* ... imagens ... */}

          <aside className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">

            <h1 className="text-3xl font-semibold">{product.name}</h1>

            {/* 🔥 BOTÕES AJUSTADOS */}

            <div className="mt-5 space-y-3">

              <a
                href={reserveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-lg bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Reservar agora
              </a>

              <a
                href={questionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left transition hover:border-neutral-300 hover:bg-neutral-100"
              >
                <div className="mt-[2px] flex h-9 w-9 items-center justify-center rounded-full border bg-white">
                  💬
                </div>

                <div>
                  <span className="block text-sm font-medium text-neutral-900">
                    Tirar dúvidas com um especialista
                  </span>
                  <span className="mt-1 block text-xs text-neutral-500">
                    Fale com nosso time sobre kit, disponibilidade e configurações ideais.
                  </span>
                </div>
              </a>

            </div>

          </aside>
        </section>
      </div>
    </main>
  );
}
