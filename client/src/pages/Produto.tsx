import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { supabase, type Product } from "@/lib/supabase";

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

function buildSpecs(product: Product): Array<{ label: string; value: string }> {
  const specs: Array<{ label: string; value: string }> = [];

  if (product.category) specs.push({ label: "Categoria", value: product.category });
  if (product.subcategory) specs.push({ label: "Subcategoria", value: product.subcategory });
  if (product.badge) specs.push({ label: "Destaque", value: product.badge });
  if (product.price) {
    specs.push({
      label: "Diária",
      value: `R$ ${Number(product.price).toLocaleString("pt-BR")}`,
    });
  }

  return specs;
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
  const specs = useMemo(() => (product ? buildSpecs(product) : []), [product]);

  const currentImage = gallery[selectedImage] || product?.image_url || "";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f3f1] pt-28">
        <div className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[88px_minmax(0,1fr)_360px]">
            <div className="hidden lg:flex lg:flex-col lg:gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded-xl bg-neutral-200" />
              ))}
            </div>

            <div className="h-[300px] animate-pulse rounded-2xl bg-white sm:h-[360px] lg:h-[420px]" />

            <div className="rounded-2xl bg-white p-6">
              <div className="mb-4 h-5 w-20 animate-pulse rounded bg-neutral-200" />
              <div className="mb-3 h-10 w-2/3 animate-pulse rounded bg-neutral-200" />
              <div className="mb-3 h-12 w-full animate-pulse rounded bg-neutral-200" />
              <div className="mb-3 h-20 w-full animate-pulse rounded-xl bg-neutral-200" />
              <div className="mt-5 h-8 w-1/2 animate-pulse rounded bg-neutral-200" />
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

        {/* HEADER LIMPO */}
        <div className="mb-5 flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            Início
          </Link>
          <span>›</span>
          {product.category ? (
            <>
              <Link
                href={`/catalogo/${(product.category || "")
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/\s+/g, "-")}`}
                className="hover:text-neutral-900"
              >
                {product.category}
              </Link>
              <span>›</span>
            </>
          ) : null}
          <span className="text-neutral-900">{product.name}</span>
        </div>

        <section className="grid gap-6 lg:grid-cols-[88px_minmax(0,1fr)_360px]">
          
          {/* THUMBNAILS */}
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

          {/* IMAGEM PRINCIPAL */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            <div className="flex h-[300px] sm:h-[360px] lg:h-[420px] items-center justify-center">
              <img
                src={currentImage}
                alt={product.name}
                className="max-h-[90%] max-w-[90%] object-contain"
              />
            </div>
          </div>

          {/* INFO */}
          <aside className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
            <h1 className="text-3xl font-semibold text-neutral-950">
              {product.name}
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              {[product.category, product.subcategory].filter(Boolean).join(" / ")}
            </p>

            <div className="mt-2 text-sm text-neutral-700 flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full" />
              Disponível
            </div>

            <div className="mt-6 space-y-3">
              <a className="flex w-full justify-center bg-black text-white py-3 rounded-lg">
                Reservar agora
              </a>

              <a className="flex gap-3 p-3 border rounded-xl bg-neutral-50">
                💬
                <div>
                  <div className="text-sm font-medium">
                    Tirar dúvidas com um especialista
                  </div>
                  <div className="text-xs text-neutral-500">
                    Fale com nossa equipe sobre kit e disponibilidade.
                  </div>
                </div>
              </a>
            </div>

            {product.price && (
              <div className="mt-5 border-t pt-4">
                <div className="text-xs uppercase text-neutral-500">
                  Diária
                </div>
                <div className="text-xl font-semibold">
                  R$ {Number(product.price).toLocaleString("pt-BR")}
                </div>
              </div>
            )}
          </aside>
        </section>

      </div>
    </main>
  );
}
