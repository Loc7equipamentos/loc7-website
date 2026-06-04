import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { supabase, type Product } from "@/lib/supabase";
import { getWhatsAppLink } from "@/lib/whatsapp";

const OFFICIAL_DOMAIN = "https://www.loc7equipamentos.com.br";

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

function parseSeoTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return Array.from(
      new Set(
        tags
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      )
    ).slice(0, 20);
  }

  if (typeof tags === "string") {
    return Array.from(
      new Set(
        tags
          .split(/\n|,/)
          .map((item) => item.trim())
          .filter(Boolean)
      )
    ).slice(0, 20);
  }

  return [];
}

function slugifyPathSegment(value?: string | null): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export default function Produto() {
  const params = useParams<{ category?: string; slug?: string }>();
  const slug = params.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [previewImage, setPreviewImage] = useState<number | null>(null);
  const [mobileTab, setMobileTab] = useState<"overview" | "technical" | "includes">("overview");
  const [desktopDetailTab, setDesktopDetailTab] = useState<"technical" | "includes">("technical");
  const [showAllOverview, setShowAllOverview] = useState(false);

useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}, [slug]);
  
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
        setShowAllOverview(false);
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

  const highlightsText = useMemo(() => {
    return (product ? ((product as Product & { specs?: string | null }).specs || "").trim() : "");
  }, [product]);

  const hasMoreHighlights = highlightsText.length > 700;

  const technicalSpecs = useMemo(
    () =>
      product
        ? parseHighlights(
            (product as Product & { technical_specs?: string | null }).technical_specs
          )
        : [],
    [product]
  );


  const seoTags = useMemo(() => {
    return product
      ? parseSeoTags((product as Product & { seo_tags?: string | string[] | null }).seo_tags)
      : [];
  }, [product]);

  useEffect(() => {
    if (highlightsText.length > 0) {
      setMobileTab("overview");
      return;
    }

    if (technicalSpecs.length > 0) {
      setMobileTab("technical");
      return;
    }

    if (includes.length > 0) {
      setMobileTab("includes");
    }
  }, [highlightsText.length, technicalSpecs.length, includes.length]);

  useEffect(() => {
    if (technicalSpecs.length > 0) {
      setDesktopDetailTab("technical");
      return;
    }

    if (includes.length > 0) {
      setDesktopDetailTab("includes");
    }
  }, [technicalSpecs.length, includes.length]);

  const currentImage =
    gallery[previewImage ?? selectedImage] || product?.image_url || "";

  const productTitle =
    (product as Product & { display_name?: string | null })?.display_name ||
    product?.name ||
    "";

  const reserveLink = product
    ? getWhatsAppLink({
        context: "product_reserve",
        productName: productTitle,
      })
    : "#";

  const questionLink = product
    ? getWhatsAppLink({
        context: "product_question",
        productName: productTitle,
      })
    : "#";

  useEffect(() => {
    if (!product) return;

    const productSlug = (product as Product & { slug?: string | null }).slug || slug || "";
    const categorySlug = slugifyPathSegment(product.category) || "catalogo";
    const canonicalUrl = `${OFFICIAL_DOMAIN}/equipamentos/${categorySlug}/${productSlug}`;
    const automaticSeoTags = [
  productTitle,
  (product as Product & { brand?: string | null }).brand,
  product.category,
  product.subcategory,
]
  .filter((item): item is string => typeof item === "string" && item.trim() !== "")
  .map((item) => item.trim());

const finalSeoTags = Array.from(
  new Set([...automaticSeoTags, ...seoTags])
).slice(0, 20);

const titleTags = finalSeoTags
  .filter((tag) => tag !== productTitle)
  .slice(0, 2)
  .join(" ");

const descriptionTags = finalSeoTags
  .filter((tag) => tag !== productTitle)
  .slice(0, 5)
  .join(", ");

const pageTitle = titleTags
  ? `${productTitle} ${titleTags} para Locação | LOC7`
  : `${productTitle} para Locação | LOC7`;

const pageDescription = descriptionTags
  ? `Locação de ${productTitle} para cinema, publicidade, audiovisual e broadcast em São Paulo. ${descriptionTags}. Suporte técnico especializado LOC7.`
  : `Locação de ${productTitle} para produções audiovisuais, publicidade, cinema e broadcast em São Paulo. Equipamentos profissionais com suporte técnico especializado.`;

const ogImage = product.image_url || currentImage || "";
const keywordContent = finalSeoTags.join(", ");

    document.title = pageTitle;

    const setMetaTag = (
      key: "name" | "property",
      value: string,
      content: string
    ) => {
      let tag = document.head.querySelector(
        `meta[${key}="${value}"]`
      ) as HTMLMetaElement | null;

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(key, value);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    setMetaTag("name", "description", pageDescription);
    if (keywordContent) {
      setMetaTag("name", "keywords", keywordContent);
    }
    setMetaTag("property", "og:title", pageTitle);
    setMetaTag("property", "og:description", pageDescription);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", "website");

    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalUrl);

    const productJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productTitle,
      description: pageDescription,
      image: gallery.length > 0 ? gallery : ogImage ? [ogImage] : undefined,
      category: [product.category, product.subcategory].filter(Boolean).join(" / ") || undefined,
      brand: (product as Product & { brand?: string | null }).brand
        ? {
            "@type": "Brand",
            name: (product as Product & { brand?: string | null }).brand,
          }
        : undefined,
     keywords: finalSeoTags.length > 0 ? finalSeoTags.join(", ") : undefined,
      url: canonicalUrl,
      offers: product.price
        ? {
            "@type": "Offer",
            price: Number(product.price),
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
            url: canonicalUrl,
          }
        : undefined,
    };

    let productSchema = document.head.querySelector(
      'script[data-loc7-schema="product"]'
    ) as HTMLScriptElement | null;

    if (!productSchema) {
      productSchema = document.createElement("script");
      productSchema.type = "application/ld+json";
      productSchema.setAttribute("data-loc7-schema", "product");
      document.head.appendChild(productSchema);
    }

    productSchema.textContent = JSON.stringify(productJsonLd);

    const hostname = window.location.hostname;
    const isStaging =
      hostname.includes("loc7.com.br") &&
      !hostname.includes("loc7equipamentos.com.br");

    setMetaTag("name", "robots", isStaging ? "noindex, nofollow" : "index, follow");
  }, [product, slug, currentImage, productTitle, gallery, seoTags]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f3f1] pt-24">
        <div className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mb-3 h-4 w-64 animate-pulse rounded bg-neutral-200" />

          <div className="grid gap-5 lg:grid-cols-[88px_560px_330px] lg:justify-center">
            <div className="hidden lg:flex lg:flex-col lg:gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="aspect-square animate-pulse rounded-xl bg-neutral-200" />
              ))}
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 lg:p-3">
              <div className="h-[320px] animate-pulse rounded-xl bg-neutral-100 sm:h-[380px] lg:h-[560px]" />
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
                href={`/catalogo/${slugifyPathSegment(product.category)}`}
                className="hover:text-neutral-900"
              >
                {product.category}
              </Link>
              <span>›</span>
            </>
          ) : null}
          <span className="text-neutral-900">{productTitle}</span>
        </div>

        <section className="grid gap-5 lg:grid-cols-[88px_560px_330px] lg:justify-center lg:gap-4">
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
                    alt={`${productTitle} ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              </button>
            ))}
          </aside>

          <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 lg:p-3">
            <div className="flex h-[320px] w-full items-center justify-center overflow-hidden rounded-xl bg-white sm:h-[380px] lg:h-[560px]">
              {currentImage ? (
                <div className="flex h-[96%] w-[96%] items-center justify-center">
                  <img
                    src={currentImage}
                    alt={productTitle}
                    className="h-full w-full object-contain"
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
                        alt={`${productTitle} ${index + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 lg:p-4">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-[2rem] lg:text-[1.85rem]">
              {productTitle}
            </h1>

            <div className="mt-2 space-y-2">
              <p className="text-sm text-neutral-500">
                {[product.category, product.subcategory].filter(Boolean).join(" / ")}
              </p>
            </div>

            <div className="mt-5 space-y-3 lg:mt-4 lg:space-y-2">
              <a
                href={reserveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-lg bg-neutral-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 lg:py-2.5"
              >
                Consultar disponibilidade
              </a>

              <a
                href={questionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left transition hover:border-neutral-300 hover:bg-neutral-100 lg:gap-2.5 lg:px-3 lg:py-2.5"
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

            {product.price ? (
              <div className="mt-5 rounded-xl border border-neutral-200 bg-white px-4 py-4 lg:mt-4 lg:px-3.5 lg:py-3.5">
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
                      productName: productTitle,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-[12px] font-medium text-red-700/80 underline decoration-red-700/25 underline-offset-4 transition hover:text-red-800 hover:decoration-red-800/60"
                  >
                    Condições diferenciadas
                  </a>
                )}

                <div className="mt-4 flex flex-col gap-1.5 text-[12px] lg:mt-3">
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
            ) : (
              <div className="mt-5 rounded-xl border border-neutral-200 bg-white px-4 py-4 lg:mt-4 lg:px-3.5 lg:py-3.5">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Diária
                </span>
                <div className="mt-1 text-2xl font-semibold text-neutral-950">
                  Sob consulta
                </div>
              </div>
            )}
          </aside>
        </section>

        {(highlightsText.length > 0 || technicalSpecs.length > 0 || includes.length > 0) && (
          <>
            <section className="mt-5 hidden gap-5 lg:grid lg:grid-cols-2 lg:items-start">
              {highlightsText.length > 0 && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 lg:p-5">
                  <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Highlights
                  </h2>

                  <div
                    className={`whitespace-pre-line text-sm leading-7 text-neutral-800 ${
                      showAllOverview ? "" : "max-h-[336px] overflow-hidden"
                    }`}
                  >
                    {highlightsText}
                  </div>

                  {hasMoreHighlights && (
                    <button
                      type="button"
                      onClick={() => setShowAllOverview((prev) => !prev)}
                      className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 underline underline-offset-4"
                    >
                      {showAllOverview ? "Ver menos" : "Ver mais"}
                    </button>
                  )}
                </div>
              )}

              {(technicalSpecs.length > 0 || includes.length > 0) && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 lg:p-5">
                  {technicalSpecs.length > 0 && includes.length > 0 ? (
                    <div className="mb-5 flex items-center gap-6 border-b border-neutral-200 pb-3">
                      <button
                        type="button"
                        onClick={() => setDesktopDetailTab("technical")}
                        className={`relative pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                          desktopDetailTab === "technical"
                            ? "text-neutral-950"
                            : "text-neutral-400"
                        }`}
                      >
                        Especificações Técnicas

                        {desktopDetailTab === "technical" && (
                          <span className="absolute bottom-[-13px] left-0 h-[1px] w-full bg-neutral-950" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDesktopDetailTab("includes")}
                        className={`relative pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                          desktopDetailTab === "includes"
                            ? "text-neutral-950"
                            : "text-neutral-400"
                        }`}
                      >
                        O que acompanha

                        {desktopDetailTab === "includes" && (
                          <span className="absolute bottom-[-13px] left-0 h-[1px] w-full bg-neutral-950" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      {technicalSpecs.length > 0 ? "Especificações Técnicas" : "O que acompanha"}
                    </h2>
                  )}

                  {technicalSpecs.length > 0 &&
                    (desktopDetailTab === "technical" || includes.length === 0) && (
                      <ul className="space-y-3 text-sm text-neutral-800">
                        {technicalSpecs.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                  {includes.length > 0 &&
                    (desktopDetailTab === "includes" || technicalSpecs.length === 0) && (
                      <ul className="space-y-3 text-sm text-neutral-800">
                        {includes.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              )}
            </section>

            <section className="mt-6 lg:hidden">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                {[highlightsText.length, technicalSpecs.length, includes.length].filter(Boolean)
                  .length > 1 && (
                  <div className="mb-5 flex flex-wrap items-center gap-5 border-b border-neutral-200 pb-3">
                    {highlightsText.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMobileTab("overview")}
                        className={`relative pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                          mobileTab === "overview" ? "text-neutral-950" : "text-neutral-400"
                        }`}
                      >
                        Highlights

                        {mobileTab === "overview" && (
                          <span className="absolute bottom-[-13px] left-0 h-[1px] w-full bg-neutral-950" />
                        )}
                      </button>
                    )}

                    {technicalSpecs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMobileTab("technical")}
                        className={`relative pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                          mobileTab === "technical" ? "text-neutral-950" : "text-neutral-400"
                        }`}
                      >
                        Specs

                        {mobileTab === "technical" && (
                          <span className="absolute bottom-[-13px] left-0 h-[1px] w-full bg-neutral-950" />
                        )}
                      </button>
                    )}

                    {includes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMobileTab("includes")}
                        className={`relative pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                          mobileTab === "includes" ? "text-neutral-950" : "text-neutral-400"
                        }`}
                      >
                        Kit

                        {mobileTab === "includes" && (
                          <span className="absolute bottom-[-13px] left-0 h-[1px] w-full bg-neutral-950" />
                        )}
                      </button>
                    )}
                  </div>
                )}

                {highlightsText.length > 0 &&
                  (mobileTab === "overview" ||
                    (technicalSpecs.length === 0 && includes.length === 0)) && (
                    <>
                      {technicalSpecs.length === 0 && includes.length === 0 && (
                        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                          Highlights
                        </h2>
                      )}

                      <div
                        className={`whitespace-pre-line text-sm leading-7 text-neutral-800 ${
                          showAllOverview ? "" : "max-h-[336px] overflow-hidden"
                        }`}
                      >
                        {highlightsText}
                      </div>

                      {hasMoreHighlights && (
                        <button
                          type="button"
                          onClick={() => setShowAllOverview((prev) => !prev)}
                          className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 underline underline-offset-4"
                        >
                          {showAllOverview ? "Ver menos" : "Ver mais"}
                        </button>
                      )}
                    </>
                  )}

                {technicalSpecs.length > 0 &&
                  (mobileTab === "technical" ||
                    (highlightsText.length === 0 && includes.length === 0)) && (
                    <>
                      {highlightsText.length === 0 && includes.length === 0 && (
                        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                          Specs
                        </h2>
                      )}

                      <ul className="space-y-3 text-sm text-neutral-800">
                        {technicalSpecs.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-900" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                {includes.length > 0 &&
                  (mobileTab === "includes" ||
                    (highlightsText.length === 0 && technicalSpecs.length === 0)) && (
                    <>
                      {highlightsText.length === 0 && technicalSpecs.length === 0 && (
                        <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                          Kit
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
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
