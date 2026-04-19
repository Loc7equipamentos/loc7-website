/*
 * LOC 7 — Página Individual de Produto
 * Detalhes completo com galeria, breadcrumb e informações
 * Busca dados do Supabase
 */

import { useParams, useLocation } from "wouter";
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
  const [, navigate] = useLocation();
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
    if (!price) return "";
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
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

            <div className="mb-8 pb-8 border-b">
              <p className="text-3xl font-bold">
                {formatPrice(product.price)}
                <span className="text-lg text-gray-500">/dia</span>
              </p>
            </div>

            {includesArray.length > 0 && (
              <div className="mb-8 pb-8 border-b">
                <h2 className="font-semibold mb-3">O que acompanha</h2>
                <ul className="space-y-2">
                  {includesArray.map((item, idx) => (
                    <li key={idx}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.description && (
              <div className="mb-8">
                <h2 className="font-semibold mb-3">Descrição</h2>
                <p className="whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                className="flex-1 bg-green-500 text-white py-4 text-center rounded-lg"
              >
                Solicitar Orçamento
              </a>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-200 py-4 rounded-lg"
              >
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
