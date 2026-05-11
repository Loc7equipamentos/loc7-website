import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
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

function parseHighlights(description: unknown): string[] {
  if (typeof description !== "string") return [];

  return description
    .split(/\n|•/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function Produto() {
  const params = useParams<{ slug?: string }>();
  const slug = params.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [previewImage, setPreviewImage] = useState<number | null>(null);
  const [mobileTab, setMobileTab] = useState<"includes" | "specs">("includes");
  const [showAllSpecs, setShowAllSpecs] = useState(false);

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
        setPreviewImage(null);
        setShowAllSpecs(false);
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

  const highlights = useMemo(
    () => (product ? parseHighlights((product as Product & { specs?: string | null }).specs) : []),
    [product]
  );

  const detailHighlights = useMemo(
    () => [product?.badge, ...highlights].filter(Boolean) as string[],
    [product?.badge, highlights]
  );

  const visibleSpecs = showAllSpecs ? detailHighlights : detailHighlights.slice(0, 8);
  const hasMoreSpecs = detailHighlights.length > 8;

  useEffect(() => {
    if (includes.length > 0) {
      setMobileTab("includes");
      return;
    }

    if (detailHighlights.length > 0) {
      setMobileTab("specs");
    }
  }, [detailHighlights.length, includes.length]);

  const currentImage =
    gallery[previewImage ?? selectedImage] || product?.image_url || "";

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
              <div className="mb-2 h-4 w-32 animate-pulse rounded bg-neutral-200" />
              <div className="mb-5 h-4 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="mb-3 h-12 w-full animate-pulse rounded-lg bg-neutral-200" />
              <div className="mb-5 h-20 w-full animate-pulse rounded-xl bg-neutral-200" />
              <div className="h-[74px] w-full animate-pulse rounded-xl bg-neutral-200" />
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
        <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/catalogo" className="hover:text-neutral-900">
            Catálogo
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

        <section className="grid gap-5 lg:grid-cols-[88px_minmax(0,1fr)_360px]">
          <aside className="hidden lg:flex lg:flex-col lg:gap-2">
            {gallery.map((image, index) => (
              <button
                key={image + index}
                onClick={() => {
                  setSelectedImage(index);
                  setPreviewImage(null);
                }}
                onMouseEnter={() => setPreviewImage(index)}
                onMouseLeave={() => setPreviewImage(null)}
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
            <div className="flex h-[320px] w-full items-center justify-center overflow-hidden rounded-xl bg-white sm:h-[380px] lg:h-[440px]">
              {currentImage ? (
                <div className="flex h-[90%] w-[90%] items-center justify-center">
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

            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 lg:hidden">
                {gallery.map((image, index) => (
                  <button
                    key={image + index}
                    onClick={() => {
                      setSelectedImage(index);
                      setPreviewImage(null);
                    }}
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
            )}
          </div>

          <aside className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-[2rem]">
              {product.name}
            </h1>

            <div className="mt-2 space-y-2">
              <p className="text-sm text-neutral-500">
                {[product.category, product.subcategory].filter(Boolean).join(" / ")}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <a
                href={reserveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-lg bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Consultar disponibilidade
              </a>

              <a
                href={questionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left transition hover:border-neutral-300 hover:bg-neutral-100"
              >
                <div className="mt-[2px] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white shadow-sm transition group-hover:bg-neutral-800">
                  💬
                </div>

                <div className="min-w-0">
                  <span className="block text-sm font-medium text-neutral-900">
                    Falar com especialista
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-neutral-500">
                    Fale com nosso time sobre kit, disponibilidade e configurações ideais.
                  </span>
                </div>
              </a>
            </div>

            {product.price && (
              <div className="mt-5 rounded-xl border border-neutral-200 bg-white px-4 py-4">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Diária
                </span>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-2xl font-semibold text-neutral-950">
                    R$ {Number(product.price).toLocaleString("pt-BR")}
                  </span>
                  <span className="pb-[2px] text-xs text-neutral-400">/ dia</span>
                </div>

                {(product as Product & { is_featured_special?: boolean | null }).is_featured_special && (
                  <a
                    href={getWhatsAppLink({
                      context: "product_special",
                      productName: product.name,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-[12px] font-medium text-red-700/80 underline decoration-red-700/25 underline-offset-4 transition hover:text-red-800 hover:decoration-red-800/60"
                  >
                    Condições diferenciadas
                  </a>
                )}

                <div className="mt-4 flex flex-col gap-1.5 text-[12px]">
                  <div className="flex items-center gap-2 text-neutral-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-800" />
                    <span>Liberação ágil de equipamentos</span>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                    <span>Consultoria técnica especializada</span>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                    <span>Desenvolvimento de projetos especiais</span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </section>

        {(includes.length > 0 || detailHighlights.length > 0) && (
          <>
            <section className="mt-6 hidden gap-6 lg:flex lg:items-start">
              {includes.length > 0 && (
                <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
                  <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    O que acompanha
                  </h2>

                  <ul className="space-y-3 text-sm text-neutral-800">
                    {includes.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {detailHighlights.length > 0 && (
                <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
                  <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Specs
                  </h2>

                  <ul className="space-y-3 text-sm text-neutral-800">
                    {visibleSpecs.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {hasMoreSpecs && (
                    <button
                      type="button"
                      onClick={() => setShowAllSpecs((prev) => !prev)}
                      className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 underline underline-offset-4"
                    >
                      {showAllSpecs ? "Ver menos" : "Ver mais"}
                    </button>
                  )}
                </div>
              )}
            </section>

            <section className="mt-6 lg:hidden">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                {includes.length > 0 && detailHighlights.length > 0 && (
                  <div className="mb-5 flex items-center gap-6 border-b border-neutral-200 pb-3">
                    <button
                      onClick={() => setMobileTab("includes")}
                      className={`relative pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                        mobileTab === "includes"
                          ? "text-neutral-950"
                          : "text-neutral-400"
                      }`}
                    >
                      O que acompanha

                      {mobileTab === "includes" && (
                        <span className="absolute bottom-[-13px] left-0 h-[1px] w-full bg-neutral-950" />
                      )}
                    </button>

                    <button
                      onClick={() => setMobileTab("specs")}
                      className={`relative pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                        mobileTab === "specs"
                          ? "text-neutral-950"
                          : "text-neutral-400"
                      }`}
                    >
                      Specs

                      {mobileTab === "specs" && (
                        <span className="absolute bottom-[-13px] left-0 h-[1px] w-full bg-neutral-950" />
                      )}
                    </button>
                  </div>
                )}

                {includes.length > 0 &&
                  (mobileTab === "includes" || detailHighlights.length === 0) && (
                    <>
                      {detailHighlights.length === 0 && (
                        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                          O que acompanha
                        </h2>
                      )}

                      <ul className="space-y-3 text-sm text-neutral-800">
                        {includes.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                {detailHighlights.length > 0 &&
                  (mobileTab === "specs" || includes.length === 0) && (
                    <>
                      {includes.length === 0 && (
                        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                          Specs
                        </h2>
                      )}

                      <ul className="space-y-3 text-sm text-neutral-800">
                        {visibleSpecs.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {hasMoreSpecs && (
                        <button
                          type="button"
                          onClick={() => setShowAllSpecs((prev) => !prev)}
                          className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 underline underline-offset-4"
                        >
                          {showAllSpecs ? "Ver menos" : "Ver mais"}
                        </button>
                      )}
                    </>
                  )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
