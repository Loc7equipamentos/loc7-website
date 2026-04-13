/*
 * LOC 7 — Página Individual de Produto
 * Detalhes completo com design cinza claro + branco
 */

import { useParams, useLocation } from "wouter";
import { ChevronLeft, MapPin, Zap, Star, ArrowRight, ShoppingCart, Loader } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { supabase, type Product } from "@/lib/supabase";
import { useState, useEffect } from "react";

export default function Produto() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar produto do Supabase pelo slug
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (err) {
          console.error('Erro ao buscar produto:', err);
          setError('Produto não encontrado');
          setProduct(null);
        } else {
          setProduct(data);
          setError(null);
        }
      } catch (err) {
        console.error('Erro:', err);
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-800 text-3xl font-display font-bold mb-4">Produto não encontrado</h1>
          <Link href="/catalogo" className="text-blue-600 hover:text-blue-700">
            ← Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  };

  const whatsappMessage = `Olá! Tenho interesse em alugar: ${product.name} (R$ ${product.price.toFixed(2)}/dia)`;
  const whatsappUrl = `https://wa.me/message/WOIONHHSTABQF1?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header com botão voltar */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="container">
          <button
            onClick={() => navigate("/catalogo")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar ao catálogo
          </button>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagem */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden aspect-square">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                Sem imagem
              </div>
            )}
          </div>

          {/* Detalhes */}
          <div className="flex flex-col justify-start">
            {/* Categoria e Badge */}
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

            {/* Nome */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Preço */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-3xl font-bold text-gray-900">
                R$ {product.price.toFixed(2)}
                <span className="text-lg text-gray-500 font-normal">/dia</span>
              </p>
            </div>

            {/* Descrição */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-4 mt-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Solicitar Orçamento
              </a>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </div>

        {/* Seção de informações adicionais */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Categoria</h3>
            <p className="text-gray-700">{product.category}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Preço por dia</h3>
            <p className="text-2xl font-bold text-gray-900">R$ {product.price.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Disponibilidade</h3>
            <p className="text-gray-700">Sob consulta</p>
          </div>
        </div>
      </div>
    </div>
  );
}
