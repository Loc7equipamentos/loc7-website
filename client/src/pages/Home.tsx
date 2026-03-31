/*
 * LOC 7 — Home Page
 * Cinema Noir Industrial style
 * Hero + Features + Categories + Products + Brands + About + CTA
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, MapPin, Zap, Star, ArrowRight, Play } from "lucide-react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/hero-banner-BC5ruXNS748J9BcSVbhSGK.webp";
const CAMERAS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/cameras-category-CAmby3gUvFFiGLofYZBGb5.webp";
const LENSES_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/lenses-category-XS4B4DC95N5eLapVz3paDn.webp";
const LIGHTING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/lighting-category-H6my4tCPCu8QAi3aprr7QA.webp";
const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/about-section-6t4vsfoEi8VscrkczqbQpH.webp";

const featuredProducts = [
  { id: 1, name: "Sony FX9 6K Full Frame", category: "CÂMERA", price: "R$ 850,00", badge: "FULLFRAME", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80" },
  { id: 2, name: "Zeiss Supreme Prime Set", category: "LENTES", price: "R$ 2.200,00", badge: "PL MOUNT", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80" },
  { id: 3, name: "Aputure 600d Pro", category: "ILUMINAÇÃO", price: "R$ 600,00", badge: "LED", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80" },
  { id: 4, name: "Canon C300 Mark III", category: "CÂMERA", price: "R$ 950,00", badge: "SUPER35", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80" },
  { id: 5, name: "DZO Pictor Zoom Set", category: "LENTES", price: "R$ 1.500,00", badge: "EF/PL", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80" },
  { id: 6, name: "RED Komodo 6K", category: "CÂMERA", price: "R$ 1.000,00", badge: "S35", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80" },
];

const newProducts = [
  { id: 7, name: "Sony A7V 4K Fullframe", category: "CÂMERA", price: "R$ 650,00", badge: "FULLFRAME", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80" },
  { id: 8, name: "Leitz Cine Hektor Set", category: "LENTES", price: "R$ 2.100,00", badge: "E-MOUNT", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80" },
  { id: 9, name: "Godox AD600 Pro II", category: "FLASH", price: "R$ 400,00", badge: "FLASH", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80" },
  { id: 10, name: "Blackmagic Pyxis 6K", category: "CÂMERA", price: "R$ 900,00", badge: "FULLFRAME", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80" },
];

const brands = ["SONY", "CANON", "RED", "ARRI", "BLACKMAGIC", "APUTURE", "ZEISS", "DJI"];

const testimonials = [
  { name: "Rafael Mendes", role: "Diretor de Fotografia", text: "Equipamentos sempre em perfeito estado e atendimento impecável. A Loc 7 é minha primeira opção para qualquer produção.", stars: 5 },
  { name: "Ana Beatriz", role: "Produtora Executiva", text: "Processo de locação super ágil e preços competitivos. Recomendo para qualquer profissional da área.", stars: 5 },
  { name: "Carlos Eduardo", role: "Videomaker", text: "Catálogo incrível com equipamentos de última geração. Sempre encontro o que preciso para meus projetos.", stars: 5 },
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

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const heroSlides = [
    {
      title: "EQUIPAMENTOS\nDE CINEMA",
      subtitle: "Câmeras, lentes e iluminação profissional",
      cta: "Ver Catálogo",
      ctaHref: "/catalogo",
    },
    {
      title: "LENTES\nCINEMA",
      subtitle: "Sets completos para sua produção",
      cta: "Ver Lentes",
      ctaHref: "/catalogo/lentes",
    },
    {
      title: "ILUMINAÇÃO\nPROFISSIONAL",
      subtitle: "Do set de estúdio às externas",
      cta: "Ver Iluminação",
      ctaHref: "/catalogo/iluminacao",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
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

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Equipamentos audiovisuais"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 container h-full flex items-center">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[oklch(0.45_0.25_25)]" />
              <span className="text-[oklch(0.45_0.25_25)] text-xs uppercase tracking-widest font-display font-semibold">
                São Paulo, SP
              </span>
            </div>
            
            {heroSlides.map((slide, i) => (
              <div
                key={i}
                className={`transition-all duration-700 ${i === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'}`}
              >
                {i === currentSlide && (
                  <>
                    <h1 className="font-display font-bold text-white leading-none mb-4"
                      style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '-0.01em', whiteSpace: 'pre-line' }}>
                      {slide.title}
                    </h1>
                    <p className="text-[oklch(0.7_0_0)] text-lg mb-8 max-w-md">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link href={slide.ctaHref} className="loc7-btn-primary flex items-center gap-2 text-base">
                        {slide.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <a
                        href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Gostaria de solicitar um orçamento."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="loc7-btn-outline flex items-center gap-2 text-base"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Falar no WhatsApp
                      </a>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Slide indicators */}
            <div className="flex gap-2 mt-10">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-0.5 transition-all duration-300 ${i === currentSlide ? 'w-8 bg-[oklch(0.45_0.25_25)]' : 'w-4 bg-[oklch(0.35_0_0)]'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[oklch(0.4_0_0)] text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[oklch(0.4_0_0)] to-transparent" />
        </div>
      </section>

      {/* ===== FEATURES BAR ===== */}
      <section className="bg-[oklch(0.06_0_0)] border-y border-[oklch(0.15_0_0)]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[oklch(0.15_0_0)]">
            {[
              { icon: MapPin, title: "São Paulo, SP", desc: "Estrategicamente localizado no coração da cidade" },
              { icon: Zap, title: "100% Online", desc: "Faça sua reserva em poucos cliques, sem burocracia" },
              { icon: Star, title: "Equipamentos Premium", desc: "Os principais lançamentos do mercado audiovisual" },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex items-center gap-4 px-6 py-5">
                  <div className="w-10 h-10 border border-[oklch(0.45_0.25_25)] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[oklch(0.45_0.25_25)]" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-white uppercase tracking-wide text-sm">{feat.title}</p>
                    <p className="text-[oklch(0.5_0_0)] text-xs mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section
        id="featured"
        ref={setSectionRef("featured")}
        className="py-20"
      >
        <div className="container">
          <div className={`mb-10 transition-all duration-700 ${isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="loc7-section-title text-lg">DESTAQUES</span>
            <div className="loc7-red-line" />
            <p className="text-[oklch(0.5_0_0)] text-sm mt-3">O que tá quente na cena! 🔥</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredProducts.map((product, i) => (
              <div
                key={product.id}
                className={`transition-all duration-500 ${isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link href="/catalogo" className="loc7-btn-outline flex items-center gap-2">
              Ver Catálogo Completo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section
        id="categories"
        ref={setSectionRef("categories")}
        className="py-4 pb-20"
      >
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: "CÂMERAS", img: CAMERAS_IMG, href: "/catalogo/cameras", desc: "Cinema, mirrorless e mais" },
              { title: "LENTES", img: LENSES_IMG, href: "/catalogo/lentes", desc: "Primes, zooms e anamórficos" },
              { title: "ILUMINAÇÃO", img: LIGHTING_IMG, href: "/catalogo/iluminacao", desc: "LED, flash e modificadores" },
            ].map((cat, i) => (
              <Link
                key={cat.title}
                href={cat.href}
                className={`relative overflow-hidden aspect-[4/3] group block transition-all duration-500 ${isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:opacity-80 brightness-50 group-hover:brightness-40"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h3 className="font-display font-bold text-white text-3xl uppercase tracking-widest mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-[oklch(0.6_0_0)] text-sm mb-4">{cat.desc}</p>
                  <span className="border border-white text-white text-xs uppercase tracking-widest px-4 py-2 font-display font-semibold group-hover:bg-[oklch(0.45_0.25_25)] group-hover:border-[oklch(0.45_0.25_25)] transition-all">
                    Ver {cat.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEW PRODUCTS ===== */}
      <section
        id="new-products"
        ref={setSectionRef("new-products")}
        className="py-20 bg-[oklch(0.06_0_0)]"
      >
        <div className="container">
          <div className={`mb-10 transition-all duration-700 ${isVisible['new-products'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="loc7-section-title text-lg">NOVIDADES NO CATÁLOGO</span>
            <div className="loc7-red-line" />
            <p className="text-[oklch(0.5_0_0)] text-sm mt-3">As novidades mais recentes da casa!</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newProducts.map((product, i) => (
              <div
                key={product.id}
                className={`transition-all duration-500 ${isVisible['new-products'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section className="py-10 border-y border-[oklch(0.15_0_0)] overflow-hidden">
        <div className="flex gap-16 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={i}
              className="font-display font-bold text-[oklch(0.25_0_0)] hover:text-[oklch(0.45_0.25_25)] transition-colors text-xl uppercase tracking-widest shrink-0"
            >
              {brand}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section
        id="about"
        ref={setSectionRef("about")}
        className="py-20"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 ${isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="mb-6">
                <span className="loc7-section-title text-lg">SOBRE A LOC 7</span>
                <div className="loc7-red-line" />
              </div>
              <h2 className="font-display font-bold text-white text-3xl md:text-4xl uppercase leading-tight mb-6">
                EQUIPAMENTOS PROFISSIONAIS<br />
                <span className="text-[oklch(0.45_0.25_25)]">PARA GRANDES PRODUÇÕES</span>
              </h2>
              <p className="text-[oklch(0.6_0_0)] leading-relaxed mb-4">
                A Loc 7 Equipamentos é uma locadora audiovisual especializada em equipamentos de alta performance para produções cinematográficas, publicitárias e corporativas em São Paulo.
              </p>
              <p className="text-[oklch(0.6_0_0)] leading-relaxed mb-8">
                Com um catálogo que inclui as mais recentes câmeras cinema, sets de lentes premium, iluminação profissional e muito mais, oferecemos suporte completo para sua produção.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { num: "500+", label: "Equipamentos" },
                  { num: "1000+", label: "Produções" },
                  { num: "5★", label: "Avaliação" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center border border-[oklch(0.2_0_0)] p-4">
                    <p className="font-display font-bold text-[oklch(0.45_0.25_25)] text-2xl">{stat.num}</p>
                    <p className="text-[oklch(0.5_0_0)] text-xs uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/sobre" className="loc7-btn-primary inline-flex items-center gap-2">
                Conheça a Loc 7
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className={`relative transition-all duration-700 delay-200 ${isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                <img
                  src={ABOUT_IMG}
                  alt="Estúdio Loc 7"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 border border-[oklch(0.45_0.25_25)] -translate-x-3 -translate-y-3 pointer-events-none" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[oklch(0.45_0.25_25)] p-4 text-white">
                <p className="font-display font-bold text-2xl">LOC 7</p>
                <p className="text-xs uppercase tracking-widest opacity-80">São Paulo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section
        id="testimonials"
        ref={setSectionRef("testimonials")}
        className="py-20 bg-[oklch(0.06_0_0)]"
      >
        <div className="container">
          <div className={`mb-10 text-center transition-all duration-700 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="loc7-section-title text-lg">DEPOIMENTOS</span>
            <div className="loc7-red-line mx-auto" />
            <p className="text-[oklch(0.5_0_0)] text-sm mt-3">O que nossos clientes dizem</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] p-6 transition-all duration-500 hover:border-[oklch(0.45_0.25_25)] ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[oklch(0.45_0.25_25)] fill-current" />
                  ))}
                </div>
                <p className="text-[oklch(0.7_0_0)] text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="border-t border-[oklch(0.18_0_0)] pt-4">
                  <p className="font-display font-semibold text-white text-sm uppercase tracking-wide">{t.name}</p>
                  <p className="text-[oklch(0.45_0.25_25)] text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG PREVIEW ===== */}
      <section
        id="blog"
        ref={setSectionRef("blog")}
        className="py-20"
      >
        <div className="container">
          <div className={`mb-10 flex items-end justify-between transition-all duration-700 ${isVisible.blog ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div>
              <span className="loc7-section-title text-lg">BLOG</span>
              <div className="loc7-red-line" />
              <p className="text-[oklch(0.5_0_0)] text-sm mt-3">Conteúdo para profissionais audiovisuais</p>
            </div>
            <Link href="/blog" className="text-[oklch(0.45_0.25_25)] text-sm hover:text-white transition-colors flex items-center gap-1 font-display font-semibold uppercase tracking-wide">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Como escolher a câmera certa para sua produção", date: "20 Mar 2026", category: "Câmeras", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80" },
              { title: "Guia completo de iluminação para vídeos corporativos", date: "15 Mar 2026", category: "Iluminação", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&q=80" },
              { title: "Lentes anamórficas: tudo que você precisa saber", date: "10 Mar 2026", category: "Lentes", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&q=80" },
            ].map((post, i) => (
              <Link
                key={i}
                href="/blog"
                className={`group block bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 ${isVisible.blog ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="overflow-hidden aspect-video">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:opacity-80 transition-transform duration-500 brightness-75 group-hover:brightness-90" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="loc7-category-badge text-[0.6rem]">{post.category}</span>
                    <span className="text-[oklch(0.4_0_0)] text-xs font-mono-price">{post.date}</span>
                  </div>
                  <h3 className="text-white text-sm font-medium leading-snug group-hover:text-[oklch(0.45_0.25_25)] transition-colors">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 bg-[oklch(0.45_0.25_25)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 11px)' }} />
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="font-display font-bold text-white text-4xl md:text-5xl uppercase tracking-wide mb-4">
            PRONTO PARA SUA<br />PRÓXIMA PRODUÇÃO?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Entre em contato agora e solicite um orçamento personalizado para seu projeto.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Gostaria de solicitar um orçamento para locação de equipamentos."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[oklch(0.45_0.25_25)] font-display font-bold uppercase tracking-widest px-8 py-4 text-base hover:bg-[oklch(0.95_0_0)] transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Solicitar Orçamento
            </a>
            <Link href="/catalogo" className="border-2 border-white text-white font-display font-bold uppercase tracking-widest px-8 py-4 text-base hover:bg-white hover:text-[oklch(0.45_0.25_25)] transition-colors">
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
