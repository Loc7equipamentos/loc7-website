import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string | null;
  price?: number | null;
  description?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  includes?: string[] | string | null;
  badge?: string | null;
};

function formatPrice(price?: number | null) {
  if (price === null || price === undefined || Number.isNaN(price)) {
    return "Sob consulta";
  }

  return `R$ ${price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}/dia`;
}

function normalizeCategory(category?: string | null) {
  if (!category) return "";
  return category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatCategoryLabel(category?: string | null) {
  if (!category) return "Categoria";
  return category
    .split("-")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
}

function parseIncludes(includes?: string[] | string | null) {
  if (!includes) return [];

  if (Array.isArray(includes)) {
    return includes.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof includes === "string") {
    return includes
      .split("\n")
      .map((item) => item.replace(/^[-•\s]+/, "").trim())
      .filter(Boolean);
  }

  return [];
}

function buildGallery(product: Product | null) {
  if (!product) return [];

  const rawImages = [
    ...(Array.isArray(product.images) ? product.images : []),
    product.image_url,
  ];

  return Array.from(
    new Set(
      rawImages
        .map((img) => (typeof img === "string" ? img.trim() : ""))
        .filter(Boolean)
    )
  );
}

function buildWhatsAppLink(product: Product | null) {
  const phone = "5511999999999"; // ajuste somente se seu número oficial for outro
  const productName = product?.name ?? "equipamento";
  const message = `Olá! Tenho interesse no equipamento: ${productName}. Pode me passar mais informações?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function Produto() {
  const [, params] = useRoute("/equipamentos/:slug");
  const slug = params?.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  // NOVO: estado isolado para expandir/recolher descrição
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) {
        setError("Produto não encontrado.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setError("Não foi possível carregar este produto.");
        setProduct(null);
        setLoading(false);
        return;
      }

      setProduct(data as Product);
      setSelectedImage(0);
      setIsDescriptionExpanded(false);
      setLoading(false);
    }

    fetchProduct();
  }, [slug]);

  const galleryImages = useMemo(() => buildGallery(product), [product]);
  const includesList = useMemo(() => parseIncludes(product?.includes), [product?.includes]);

  const safeDescription = (product?.description ?? "").trim();
  const shouldShowDescriptionToggle = safeDescription.length > 220;

  const currentImage =
    galleryImages[selectedImage] || galleryImages[0] || "/placeholder-image.jpg";

  const categorySlug = normalizeCategory(product?.category);

  function handlePrevImage() {
    if (galleryImages.length <= 1) return;
    setSelectedImage((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  }

  function handleNextImage() {
    if (galleryImages.length <= 1) return;
    setSelectedImage((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-56 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-gray-200 rounded" />
                <div className="h-6 w-40 bg-gray-200 rounded" />
                <div className="h-24 w-full bg-gray-200 rounded" />
                <div className="h-12 w-52 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
            <h1 className="text-xl font-semibold mb-2">Erro ao carregar produto</h1>
            <p className="mb-4">{error || "Produto não encontrado."}</p>
            <Link href="/catalogo">
              <a className="inline-flex items-center text-sm font-medium text-black underline underline-offset-4">
                Voltar para o catálogo
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/catalogo">
            <a className="hover:text-black transition-colors">Catálogo</a>
          </Link>

          {categorySlug && (
            <>
              <span>/</span>
              <Link href={`/catalogo/${categorySlug}`}>
                <a className="hover:text-black transition-colors">
                  {formatCategoryLabel(product.category)}
                </a>
              </Link>
            </>
          )}

          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Galeria */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-gray-200">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center shadow-sm hover:bg-white transition"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-black" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center shadow-sm hover:bg-white transition"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="w-5 h-5 text-black" />
                  </button>
                </>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-2xl overflow-hidden border transition ${
                      selectedImage === index
                        ? "border-black ring-2 ring-black/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    aria-label={`Selecionar imagem ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col">
            {product.badge && (
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full bg-black text-white text-xs font-semibold px-3 py-1.5 tracking-wide">
                  {product.badge}
                </span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {(product.subcategory || product.category) && (
              <p className="mt-3 text-sm sm:text-base text-gray-500">
                {product.subcategory || formatCategoryLabel(product.category)}
              </p>
            )}

            <div className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>

            {/* Descrição com Ver mais / Ver menos */}
            {safeDescription && (
              <section className="mt-8">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Descrição
                </h2>

                <div className="relative">
                  <p
                    className="text-gray-700 text-[15px] sm:text-base leading-7 transition-all duration-300"
                    style={
                      isDescriptionExpanded
                        ? undefined
                        : {
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }
                    }
                  >
                    {safeDescription}
                  </p>

                  {!isDescriptionExpanded && shouldShowDescriptionToggle && (
                    <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent" />
                  )}
                </div>

                {shouldShowDescriptionToggle && (
                  <button
                    type="button"
                    onClick={() =>
                      setIsDescriptionExpanded((prevState) => !prevState)
                    }
                    className="mt-3 inline-flex items-center text-sm font-semibold text-black hover:opacity-70 transition-opacity"
                  >
                    {isDescriptionExpanded ? "Ver menos" : "Ver mais"}
                  </button>
                )}
              </section>
            )}

            {includesList.length > 0 && (
              <section className="mt-8">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  O que acompanha
                </h2>

                <ul className="space-y-2">
                  {includesList.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex items-start gap-3 text-gray-700 text-[15px] sm:text-base leading-6"
                    >
                      <span className="mt-2 block w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-10">
              <a
                href={buildWhatsAppLink(product)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black text-white px-6 py-4 font-semibold hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-5 h-5" />
                Solicitar orçamento
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
