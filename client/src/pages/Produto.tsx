/*
 * LOC 7 — Página Individual de Produto
 * Detalhes completo + LeveJunto (cross-sell)
 */

import { useParams, useLocation } from "wouter";
import { ChevronLeft, MapPin, Zap, Star, ArrowRight, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import LeveJunto from "@/components/LeveJunto";

// Dados dos produtos (mesmo do Catálogo)
const allProducts = [
  { id: 1, name: "Sony FX9 6K Full Frame", category: "Câmeras", brand: "Sony", price: 850, badge: "FULLFRAME", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", isNew: false, slug: "sony-fx9", specs: { sensor: "Full Frame", resolution: "6K", mount: "E-Mount" } },
  { id: 2, name: "Sony A7V 4K Fullframe", category: "Câmeras", brand: "Sony", price: 650, badge: "FULLFRAME", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80", isNew: true, slug: "sony-a7v", specs: { sensor: "Full Frame", resolution: "4K", mount: "E-Mount" } },
  { id: 3, name: "Canon C300 Mark III", category: "Câmeras", brand: "Canon", price: 950, badge: "SUPER35", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", isNew: false, slug: "canon-c300", specs: { sensor: "Super 35", resolution: "4K", mount: "EF" } },
  { id: 4, name: "RED Komodo 6K S35", category: "Câmeras", brand: "RED", price: 1000, badge: "S35", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80", isNew: false, slug: "red-komodo", specs: { sensor: "Super 35", resolution: "6K", mount: "RF" } },
  { id: 5, name: "Blackmagic Pyxis 6K", category: "Câmeras", brand: "Blackmagic", price: 900, badge: "FULLFRAME", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", isNew: true, slug: "blackmagic-pyxis", specs: { sensor: "Full Frame", resolution: "6K", mount: "EF" } },
  { id: 6, name: "Zeiss Supreme Prime Set", category: "Lentes", brand: "Zeiss", price: 2200, badge: "PL MOUNT", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&q=80", isNew: false, slug: "zeiss-supreme", specs: { mount: "PL", type: "Prime Set", quantity: "7 lentes" } },
  { id: 7, name: "Leitz Cine Hektor Set", category: "Lentes", brand: "Zeiss", price: 2100, badge: "E-MOUNT", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&q=80", isNew: true, slug: "leitz-hektor", specs: { mount: "E-Mount", type: "Prime Set", quantity: "5 lentes" } },
  { id: 8, name: "DZO Pictor Zoom Set", category: "Lentes", brand: "Zeiss", price: 1500, badge: "EF/PL", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&q=80", isNew: false, slug: "dzo-pictor", specs: { mount: "EF/PL", type: "Zoom", quantity: "3 lentes" } },
  { id: 9, name: "Aputure 600d Pro", category: "Iluminação", brand: "Aputure", price: 600, badge: "LED", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&q=80", isNew: false, slug: "aputure-600d", specs: { type: "LED", power: "600W", color: "Bicolor" } },
  { id: 10, name: "Aputure Storm 700x", category: "Iluminação", brand: "Aputure", price: 800, badge: "LED", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&q=80", isNew: true, slug: "aputure-700x", specs: { type: "LED", power: "700W", color: "RGB" } },
  { id: 11, name: "Godox AD600 Pro II", category: "Iluminação", brand: "Godox", price: 400, badge: "FLASH", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&q=80", isNew: true, slug: "godox-600", specs: { type: "Flash", power: "600Ws", battery: "Li-ion" } },
  { id: 12, name: "Godox AD400 Pro II", category: "Iluminação", brand: "Godox", price: 300, badge: "FLASH", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&q=80", isNew: false, slug: "godox-400", specs: { type: "Flash", power: "400Ws", battery: "Li-ion" } },
  { id: 13, name: "DJI RS 4 Pro Gimbal", category: "Movimento", brand: "DJI", price: 350, badge: "GIMBAL", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", isNew: false, slug: "dji-rs4", specs: { type: "Gimbal", payload: "4.2kg", battery: "Li-ion" } },
  { id: 14, name: "Rode Wireless Pro", category: "Áudio", brand: "Sony", price: 200, badge: "WIRELESS", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&q=80", isNew: true, slug: "rode-wireless", specs: { type: "Wireless", frequency: "2.4GHz", range: "100m" } },
  { id: 15, name: "SmallHD 702 Touch", category: "Monitores", brand: "Sony", price: 300, badge: "7 POLEGADAS", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80", isNew: false, slug: "smallhd-702", specs: { size: "7 polegadas", resolution: "1920x1200", brightness: "1000 nits" } },
  { id: 16, name: "Tilta Nucleus M II", category: "Movimento", brand: "Sony", price: 550, badge: "FOLLOW FOCUS", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", isNew: false, slug: "tilta-nucleus", specs: { type: "Follow Focus", wireless: "Sim", range: "100m" } },
];

export default function Produto() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { addItem } = useCart();

  const product = allProducts.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-[oklch(0.08_0_0)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-3xl font-display font-bold mb-4">Produto não encontrado</h1>
          <Link href="/catalogo" className="text-[oklch(0.45_0.25_25)] hover:text-[oklch(0.5_0.25_25)]">
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

  const whatsappMessage = `Olá! Tenho interesse em alugar: ${product.name} (R$ ${product.price},00/dia)`;
  const whatsappUrl = `https://wa.me/message/WOIONHHSTABQF1?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* Header com botão voltar */}
      <div className="bg-[oklch(0.06_0_0)] border-b border-[oklch(0.15_0_0)] py-6">
        <div className="container">
          <button
            onClick={() => navigate("/catalogo")}
            className="flex items-center gap-2 text-[oklch(0.5_0_0)] hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar ao catálogo
          </button>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagem do produto */}
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square bg-[oklch(0.12_0_0)] border border-[oklch(0.15_0_0)] rounded-lg overflow-hidden">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <div className="absolute top-4 left-4">
                  <span className="loc7-category-badge">NOVO</span>
                </div>
              )}
            </div>
          </div>

          {/* Informações do produto */}
          <div>
            {/* Breadcrumb */}
            <div className="mb-6">
              <span className="text-[oklch(0.45_0.25_25)] text-xs uppercase tracking-widest font-display font-bold">
                {product.category}
              </span>
            </div>

            {/* Nome */}
            <h1 className="font-display font-bold text-white text-4xl mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Badge */}
            <div className="mb-6">
              <span className="loc7-category-badge">{product.badge}</span>
            </div>

            {/* Preço */}
            <div className="mb-8 pb-8 border-b border-[oklch(0.15_0_0)]">
              <p className="text-[oklch(0.7_0_0)] text-sm mb-2">Valor diário</p>
              <p className="font-mono-price text-[oklch(0.8_0_0)] text-5xl font-bold">
                R$ {product.price.toLocaleString("pt-BR")},00
              </p>
              <p className="text-[oklch(0.45_0_0)] text-sm mt-2">/dia</p>
            </div>

            {/* Especificações */}
            {product.specs && (
              <div className="mb-8 pb-8 border-b border-[oklch(0.15_0_0)]">
                <h3 className="font-display font-bold text-white uppercase tracking-wide mb-4">Especificações</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-[oklch(0.45_0_0)] text-xs uppercase tracking-widest font-display font-bold mb-1">
                        {key}
                      </p>
                      <p className="text-white text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs principais */}
            <div className="flex flex-col gap-3 mb-8">
              {/* Botão WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full loc7-btn-primary py-4 text-center flex items-center justify-center gap-2 font-display font-bold uppercase tracking-wide"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Orçar no WhatsApp
              </a>

              {/* Botão Adicionar ao Orçamento */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-[oklch(0.15_0_0)] hover:bg-[oklch(0.18_0_0)] border border-[oklch(0.25_0_0)] text-white py-4 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-wide transition"
              >
                <ShoppingCart className="w-5 h-5" />
                Adicionar ao Orçamento
              </button>
            </div>

            {/* Info */}
            <p className="text-[oklch(0.4_0_0)] text-xs">
              ℹ️ Adicione itens ao orçamento e customize sua solução completa
            </p>
          </div>
        </div>

        {/* LeveJunto - Cross-sell contextual */}
        <LeveJunto slug={product.slug} />
      </div>
    </div>
  );
}
