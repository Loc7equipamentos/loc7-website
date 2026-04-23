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
          <div className="mb-5 h-4 w-64 animate-pulse rounded bg-neutral-200" />

          <div className="grid gap-6 lg:grid-cols-[88px_minmax(0,1fr)_360px]">
            <div className="hidden lg:flex lg:flex-col lg:gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded-xl bg-neutral-200" />
              ))}
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
              <div className="h-[300px] animate-pulse rounded-xl bg-neutral-100 sm:h-[360px] lg:h-[420px]" />
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="mb-4 h-10 w-3/4 animate-pulse rounded bg-neutral-200" />
              <div className="mb-2 h-4 w-32 animate-pulse rounded bg-neutral-200" />
              <div className="mb-6 h-4 w-24 animate-pulse rounded bg-neutral-200" />

              <div className="mb-3 h-12 w-full animate-pulse rounded-lg bg-neutral-200" />
              <div className="mb-6 h-20 w-full animate-pulse rounded-xl bg-neutral-200" />

              <div className="h-[74px] w-full animate-pulse rounded-xl bg-neutral-200" />
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="mb-4 h-4 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-100" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-neutral-100" />
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
              <div className="mb-4 h-4 w-40 animate-pulse rounded bg-neutral-200" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 rounded-lg bg-neutral-50 px-4 py-3"
                  >
                    <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
                  </div>
                ))}
              </div>
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
          <aside className="hidden lg:flex lg:flex-col lg:gap-2">
            {gallery.map((image, index) => (
              <button
                key={image + index}
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-xl border bg-white transition-all ${
                  selectedImage === index
                    ? "border-neutral-900 shadow-sm"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="aspect-square bg-white p-2">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              </button>
            ))}
          </aside>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
            <div className="flex h-[300px] w-full items-center justify-center overflow-hidden rounded-xl bg-white sm:h-[360px] lg:h-[420px]">
              {currentImage ? (
                <div className="flex h-[88%] w-[88%] items-center justify-center">
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-sm text-neutral-500">
                  Sem imagem
                </div>
              )}
            </div>

            {gallery.length > 1 ? (
              <div className="mt-4 grid grid-cols-4 gap-3 lg:hidden">
                {gallery.map((image, index) => (
                  <button
                    key={image + index}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-xl border bg-white transition-all ${
                      selectedImage === index
                        ? "border-neutral-900 shadow-sm"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="aspect-square bg-white p-2">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-[2rem]">
              {product.name}
            </h1>

            <div className="mt-3 space-y-2">
              <p className="text-sm text-neutral-500">
                {[product.category, product.subcategory].filter(Boolean).join(" / ")}
              </p>

              <div className="inline-flex items-center gap-2 text-sm text-neutral-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Disponível
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <a
                href={`https://wa.me/message/WOIONHHSTABQF1?text=Olá! Quero reservar: ${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-lg bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Reservar agora
              </a>

              <a
                href={`https://wa.me/message/WOIONHHSTABQF1?text=Olá! Tenho dúvidas sobre: ${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left transition hover:border-neutral-300 hover:bg-neutral-100"
              >
                <div className="mt-[2px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-base">
                  💬
                </div>

                <div className="min-w-0">
                  <span className="block text-sm font-medium text-neutral-900">
                    Tirar dúvidas com um especialista
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-neutral-500">
                    Fale com nossa equipe sobre kit, compatibilidade e disponibilidade.
                  </span>
                </div>
              </a>
            </div>

            {product.price && (
              <div className="mt-6 rounded-xl border border-neutral-200 bg-white px-4 py-4">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Diária
                </span>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-neutral-950">
                    R$ {Number(product.price).toLocaleString("pt-BR")}
                  </span>
                  <span className="pb-[2px] text-xs text-neutral-400">/ dia</span>
                </div>
              </div>
            )}
          </aside>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Highlights
            </h2>

            {[product.badge, product.description].filter(Boolean).length > 0 ? (
              <ul className="space-y-3 text-sm text-neutral-800">
                {[product.badge, product.description]
                  .filter(Boolean)
                  .slice(0, 5)
                  .map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900" />
                      <span>{item}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500">
                Consulte nossa equipe para conhecer os principais destaques deste item.
              </p>
            )}

            <h2 className="mb-4 mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              O que acompanha
            </h2>

            {includes.length > 0 ? (
              <ul className="space-y-3 text-sm text-neutral-800">
                {includes.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500">
                Consulte nossa equipe para confirmar o kit completo deste item.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Especificações técnicas
              </h2>
            </div>

            <div className="space-y-3">
              {specs.length > 0 ? (
                specs.map((spec, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 rounded-lg bg-neutral-50 px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-neutral-500">{spec.label}</span>
                    <span className="text-neutral-900">{spec.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500">
                  Especificações detalhadas podem ser informadas no atendimento.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
