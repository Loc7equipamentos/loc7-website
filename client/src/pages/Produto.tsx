/*
 * LOC 7 — Página Individual de Produto
 * Detalhes completo com galeria, breadcrumb e informações
 * Busca dados do Supabase
 */

import { useParams } from "wouter";
import { ChevronRight, Loader } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { supabase, type Product } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";

interface ProductWithExtras extends Product {
  images?: string[];
  includes?: string;
}

export default function Produto() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductWithExtras | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductWithExtras[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
      console.error("Erro:", err);
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

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: typeof product.id === "string" ? parseInt(product.id, 10) : product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
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
          <Link href="/catalogo" className="text-blue-600 hover:text-blue-700">
            ← Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : [];

  const mainImage = galleryImages[selectedImageIndex] || product.image_url;

  let includesArray: string[] = [];
  if (product.includes) {
    try {
      includesArray = JSON.parse(product.includes);
    } catch {
      includesArray = product.includes
        .split("\n")
        .filter((item) => item.trim());
    }
  }

  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "";
    return `R$ ${price.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const whatsappMessage = `Olá! Tenho interesse em alugar: ${product.name} (${formatPrice(
    product.price
  )}/dia)`;

  const whatsappUrl = `https://wa.me/message/WOIONHHSTABQF1?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/catalogo"
              className="text-gray-600 hover:text-gray-900"
            >
              Catálogo
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link
              href={`/catalogo/${normalizeCategory(product.category)}`}
              className="text-gray-600 hover:text-gray-900"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-semibold">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* GALERIA */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Sem imagem
                </div>
              )}
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-20 h-20 border-2 rounded-lg overflow-hidden ${
                      selectedImageIndex === i
                        ? "border-black"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="flex flex-col text-gray-900">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                {product.category}
              </span>

              {product.badge && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
                <span className="text-lg text-gray-500 font-normal">/dia</span>
              </p>
            </div>

            {includesArray.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  O que acompanha
                </h2>
                <ul className="space-y-2">
                  {includesArray.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 font-semibold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Descrição
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 text-center rounded-lg transition"
              >
                Solicitar Orçamento
              </a>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-4 rounded-lg transition"
              >
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>

        {/* INFORMAÇÕES ADICIONAIS */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Categoria</h3>
            <p className="text-gray-700">{product.category}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Preço por dia</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Disponibilidade</h3>
            <p className="text-gray-700">Sob consulta</p>
          </div>
        </div>

        {/* RELACIONADOS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-16 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Produtos Relacionados
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/equipamentos/${p.slug || ""}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                    <div className="relative overflow-hidden aspect-square bg-gray-100">
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
                          <span className="inline-block bg-black text-white text-[10px] font-semibold px-2 py-1 rounded">
                            {p.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                        {p.category}
                      </p>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                        {p.name}
                      </h3>
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(p.price)}
                        <span className="text-xs text-gray-500 font-normal">/dia</span>
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
