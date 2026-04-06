/*
 * LOC 7 — Locação Page
 * Cinema Noir Industrial style
 * Equipment rental categories
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Equipment categories
const categories = [
  { id: "cameras", name: "CÂMERAS", icon: "🎥", color: "from-red-900 to-red-800" },
  { id: "lentes", name: "LENTES", icon: "🔍", color: "from-orange-900 to-orange-800" },
  { id: "iluminacao", name: "ILUMINAÇÃO", icon: "💡", color: "from-yellow-900 to-yellow-800" },
  { id: "audio", name: "ÁUDIO", icon: "🎙️", color: "from-green-900 to-green-800" },
  { id: "monitores", name: "MONITORES", icon: "📺", color: "from-blue-900 to-blue-800" },
  { id: "movimento", name: "MOVIMENTO", icon: "🎬", color: "from-purple-900 to-purple-800" },
  { id: "wireless", name: "WIRELESS", icon: "📡", color: "from-pink-900 to-pink-800" },
  { id: "modificadores", name: "MODIFICADORES", icon: "🔧", color: "from-indigo-900 to-indigo-800" },
  { id: "maquinaria", name: "MAQUINÁRIA", icon: "⚙️", color: "from-gray-900 to-gray-800" },
];

// Featured products for each category
const featuredProducts = [
  { id: 1, name: "Sony FX9 6K Full Frame", category: "CÂMERAS", price: "R$ 850,00", badge: "FULLFRAME", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80" },
  { id: 2, name: "Zeiss Supreme Prime Set", category: "LENTES", price: "R$ 2.200,00", badge: "PL MOUNT", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80" },
  { id: 3, name: "Aputure 600d Pro", category: "ILUMINAÇÃO", price: "R$ 600,00", badge: "LED", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80" },
  { id: 4, name: "Canon C300 Mark III", category: "CÂMERAS", price: "R$ 950,00", badge: "SUPER35", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80" },
  { id: 5, name: "DZO Pictor Zoom Set", category: "LENTES", price: "R$ 1.500,00", badge: "EF/PL", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80" },
  { id: 6, name: "RED Komodo 6K", category: "CÂMERAS", price: "R$ 1.000,00", badge: "S35", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80" },
];

function ProductCard({ product }: { product: typeof featuredProducts[0] }) {
  return (
    <div className="loc7-product-card group">
      <div className="relative overflow-hidden aspect-square bg-[oklch(0.08_0_0)]">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:opacity-80 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute top-2 left-2">
          <span className="loc7-category-badge">{product.badge}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <a
            href={`https://wa.me/message/WOIONHHSTABQF1?text=Olá! Tenho interesse em alugar: ${product.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full loc7-btn-primary text-xs py-2 text-center flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Orçamento
          </a>
        </div>
      </div>
      <div className="p-3">
        <p className="text-[oklch(0.45_0.25_25)] text-[0.65rem] uppercase tracking-widest font-display font-semibold mb-1">
          {product.category}
        </p>
        <h3 className="text-white text-sm font-medium leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="font-mono-price text-[oklch(0.8_0_0)] text-sm font-semibold">
          {product.price}<span className="text-[oklch(0.45_0_0)] text-xs font-normal">/dia</span>
        </p>
      </div>
    </div>
  );
}

export default function Locacao() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(carouselTimer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const nextCarousel = () => {
    setCarouselIndex(prev => (prev + 1) % featuredProducts.length);
  };

  const prevCarousel = () => {
    setCarouselIndex(prev => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* ===== HERO SECTION - LOCAÇÃO ===== */}
      <section className="relative h-[50vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00051_brightened_029b14bf.webp"
            alt="Locação"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
        </div>

        <div className="relative z-10 container h-full flex items-center">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="w-12 h-1 bg-[oklch(0.45_0.25_25)]" />
              <span className="text-[oklch(0.45_0.25_25)] text-base uppercase tracking-widest font-display font-bold">
                Aluguel de equipamentos audiovisuais
              </span>
            </div>
            <h1 className="font-display font-bold text-white leading-none mb-4"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.01em' }}>
              LOCAÇÃO DE EQUIPAMENTOS
            </h1>
            <p className="text-[oklch(0.7_0_0)] text-lg mb-8 max-w-md">
              Explore nossas categorias de equipamentos profissionais
            </p>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section
        id="categories"
        ref={setSectionRef("categories")}
        className="py-16 bg-[oklch(0.08_0_0)]"
      >
        <div className="container">
          <div className={`mb-12 transition-all duration-700 ${isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="loc7-section-title text-lg">CATEGORIAS</span>
            <div className="loc7-red-line" />
            <p className="text-[oklch(0.5_0_0)] text-sm mt-3">Escolha a categoria de equipamento que você procura</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category, i) => (
              <Link
                key={category.id}
                href={`/locacao/${category.id}`}
              >
                <a
                  className={`group relative overflow-hidden rounded-lg h-40 flex flex-col items-center justify-center text-center p-6 transition-all duration-500 hover:scale-105 cursor-pointer ${
                    isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Overlay pattern */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                    style={{
                      backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2720%27 height=%2720%27 viewBox=%270 0 20 20%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27%23000%27 fill-opacity=%270.1%27%3E%3Ccircle cx=%2710%27 cy=%2710%27 r=%271%27/%3E%3C/g%3E%3C/svg%3E')"
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <span className="text-5xl">{category.icon}</span>
                    <h3 className="text-white font-display font-bold text-lg uppercase tracking-wider">
                      {category.name}
                    </h3>
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[oklch(0.45_0.25_25)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS CAROUSEL ===== */}
      <section
        id="featured"
        ref={setSectionRef("featured")}
        className="featured-carousel py-16 bg-gradient-to-b from-[oklch(0.08_0_0)] to-[oklch(0.12_0_0)]"
      >
        <div className="container">
          <div className={`mb-12 transition-all duration-700 ${isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="loc7-section-title text-lg">DESTAQUES</span>
            <div className="loc7-red-line" />
            <p className="text-[oklch(0.5_0_0)] text-sm mt-3">Equipamentos em destaque do nosso catálogo</p>
          </div>

          <div className="relative">
            {/* Carousel */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevCarousel}
                className="loc7-carousel-button"
                aria-label="Produto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[0, 1, 2].map((offset) => {
                    const product = featuredProducts[(carouselIndex + offset) % featuredProducts.length];
                    return (
                      <div
                        key={`${product.id}-${offset}`}
                        className={`transition-all duration-500 ${
                          isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                        style={{ transitionDelay: `${offset * 100}ms` }}
                      >
                        <ProductCard product={product} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={nextCarousel}
                className="loc7-carousel-button"
                aria-label="Próximo produto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Indicators */}
            <div className="flex gap-2 justify-center mt-8">
              {featuredProducts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === carouselIndex
                      ? 'w-8 bg-[#FF0000]'
                      : 'w-2 bg-[oklch(0.3_0_0)] hover:bg-[oklch(0.4_0_0)]'
                  }`}
                  aria-label={`Ir para produto ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 bg-gradient-to-b from-[oklch(0.12_0_0)] to-[oklch(0.08_0_0)]">
        <div className="container">
          <div className="text-center">
            <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Não encontrou o que procura?
            </h2>
            <p className="text-[oklch(0.6_0_0)] text-lg mb-8 max-w-2xl mx-auto">
              Entre em contato conosco para consultar disponibilidade e fazer um orçamento personalizado
            </p>
            <a
              href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Gostaria de fazer uma consulta sobre equipamentos disponíveis"
              target="_blank"
              rel="noopener noreferrer"
              className="loc7-btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Fale Conosco
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
