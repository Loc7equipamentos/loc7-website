/*
 * LOC 7 — Página Individual de Produto
 * Ajuste de densidade e composição para 13"
 * Correções:
 * - image_url = capa principal
 * - images[] = imagens secundárias
 * - página abre com a capa correta
 * - sem zoom na imagem principal
 */

import { useParams } from "wouter";
import { Loader, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";

interface ProductWithExtras extends Product {
  images?: string[];
  includes?: string;
}

export default function Produto() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductWithExtras | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithExtras[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: productData, error: err } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (err) throw new Error("Produto não encontrado");
      if (!productData) throw new Error("Produto não encontrado");

      setProduct(productData);

      const { data: related, error: relErr } = await supabase
        .from("products")
        .select("*")
        .eq("category", productData.category)
        .neq("id", productData.id)
        .limit(4);

      if (!relErr && related) {
        setRelatedProducts(related);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produto");
      console.error("[DEBUG] Erro ao carregar produto:", err);
    } finally {
      setLoading(false);
    }
  };

  const normalizeCategory = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  const formatPrice = (price?: number): string => {
    if (!price || price <= 0) {
      return "Sob consulta";
    }
    return `R$ ${price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-800 text-3xl font-bold mb-4">
            Produto não encontrado
          </h1>
          <Link
            href="/catalogo"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            ← Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  // CAPA PRIMEIRO, depois imagens secundárias
  const galleryImages = [
    ...(product.image_url ? [product.image_url] : []),
    ...(product.images && product.images.length > 0 ? product.images : []),
  ];

  const mainImage = galleryImages[selectedImageIndex] || product.image_url;

  let includesArray: string[] = [];
  if (product.includes) {
    try {
      includesArray = JSON.parse(product.includes);
    } catch {
      includesArray = product.includes.split("\n").filter((item) => item.trim());
    }
  }

  const priceText =
    product.price && product.price > 0
      ? ` (${formatPrice(product.price)}/dia)`
      : "";
  const whatsappMessage = `Olá! Tenho interesse no equipamento ${product.name}${priceText}. Pode me passar disponibilidade e orçamento?`;
  const whatsappUrl = `https://wa.me/message/WOIONHHSTABQF1?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-2.5">
        <div className="container">
          <nav className="flex items-center gap-2 text-xs text-gray-600">
            <Link href="/catalogo" className="hover:text-gray-900 transition">
              Catálogo
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link
              href={`/catalogo/${normalizeCategory(product.category)}`}
              className="hover:text-gray-900 transition"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-8 items-start">
          {/* Galeria */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full aspect-[5/4] lg:aspect-[1/1] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 lg:p-5"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Sem imagem
                </div>
              )}

              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-black text-white px-2.5 py-1 text-xs font-medium rounded">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded border transition ${
                      selectedImageIndex === idx
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-400 bg-gray-50"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${idx + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex flex-col justify-start">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.16em]">
                {product.category}
              </span>

              {product.subcategory && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-[0.16em]">
                    {product.subcategory}
                  </span>
                </>
              )}

              {product.badge && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-gray-700">
                    {product.badge}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 leading-[1.05] tracking-tight">
              {product.name}
            </h1>

            <div className="mb-6 pb-5 border-b border-gray-100">
              <p className="text-2xl lg:text-[2rem] font-semibold text-gray-900">
                {formatPrice(product.price)}
                {product.price && product.price > 0 && (
                  <span className="text-base text-gray-500 font-normal ml-2">
                    /dia
                  </span>
                )}
              </p>
            </div>

            {includesArray.length > 0 && (
              <div className="mb-6 pb-5 border-b border-gray-100">
                <h2 className="text-xs font-medium text-gray-600 uppercase tracking-[0.18em] mb-3">
                  O que acompanha
                </h2>
                <ul className="space-y-2">
                  {includesArray.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-gray-400 mt-0.5 flex-shrink-0 text-sm">
                        •
                      </span>
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3.5 px-6 rounded transition flex items-center justify-center gap-2 text-base shadow-sm hover:shadow-md mb-6"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Solicitar Orçamento
            </a>

            {product.description && (
              <div className="mb-6">
                <h2 className="text-xs font-medium text-gray-600 uppercase tracking-[0.18em] mb-3">
                  Descrição
                </h2>

                <div
                  className={`text-gray-600 leading-relaxed whitespace-pre-wrap text-sm transition-all overflow-hidden ${
                    isDescriptionExpanded ? "max-h-none" : "max-h-28"
                  }`}
                >
                  {product.description}
                </div>

                {product.description.length > 200 && (
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="mt-3 text-gray-600 hover:text-gray-900 font-medium text-xs uppercase tracking-[0.16em] transition"
                  >
                    {isDescriptionExpanded ? "Ver menos" : "Ver mais"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Produtos Relacionados
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/equipamentos/${p.slug || ""}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded border border-gray-100 hover:border-gray-200 transition overflow-hidden">
                    <div className="relative overflow-hidden aspect-square bg-gray-50">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sem imagem
                        </div>
                      )}

                      {p.badge && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-block bg-black text-white text-[10px] font-medium px-2 py-0.5 rounded">
                            {p.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {p.category}
                      </p>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                        {p.name}
                      </h3>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(p.price)}
                        {p.price && p.price > 0 && (
                          <span className="text-xs text-gray-500 font-normal">
                            /dia
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
