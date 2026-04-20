/*
 * LOC 7 — Home Page
 * Cinema Noir Industrial style
 * Hero + Carousel + Features + Categories + Products + Brands + About + CTA
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, MapPin, Zap, Star, ArrowRight, Play } from "lucide-react";

// Hero images - alternating based on text
const heroSlides = [
  { text: "Equipamentos Cine e Broadcast", subtitle: "Câmeras, lentes e iluminação profissional", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00051_darkened_8a518622.webp" },
  { text: "Lentes Cine e Foto", subtitle: "Ópticas profissionais de alta qualidade", img: "" },
  { text: "Iluminação Profissional", subtitle: "Equipamentos de iluminação de última geração", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00186_darkened_7ce023d4.webp" },
];

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/hero-banner-BC5ruXNS748J9BcSVbhSGK.webp";
const CAMERAS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/cameras-category-CAmby3gUvFFiGLofYZBGb5.webp";
const LENSES_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/lenses-category-XS4B4DC95N5eLapVz3paDn.webp";
const LIGHTING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/lighting-category-H6my4tCPCu8QAi3aprr7QA.webp";
const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/about-section-6t4vsfoEi8VscrkczqbQpH.webp";

const carouselImages = [
  { id: 1, title: "RED Komodo 6K", category: "Câmera", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&q=80" },
  { id: 2, title: "Zeiss Supreme Prime Set", category: "Lentes", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&h=400&q=80" },
  { id: 3, title: "Aputure 600D Pro", category: "Iluminação", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&h=400&q=80" },
  { id: 4, title: "Sony FX9 6K", category: "Câmera", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&q=80" },
  { id: 5, title: "Canon C300 Mark III", category: "Câmera", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&q=80" },
  { id: 6, title: "DZO Pictor Zoom", category: "Lentes", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&h=400&q=80" },
  { id: 7, title: "Godox AD600 Pro", category: "Flash", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&h=400&q=80" },
  { id: 8, title: "Blackmagic Pyxis 6K", category: "Câmera", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&q=80" },
  { id: 9, title: "Leitz Cine Hektor", category: "Lentes", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&h=400&q=80" },
];

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

const brands = [
  { name: "SONY", fontClass: "font-sony" },
  { name: "CANON", fontClass: "font-canon" },
  { name: "RED", fontClass: "font-red" },
  { name: "ARRI", fontClass: "font-arri" },
  { name: "BLACKMAGIC", fontClass: "font-blackmagic" },
  { name: "APUTURE", fontClass: "font-aputure" },
  { name: "ZEISS", fontClass: "font-zeiss" },
  { name: "DJI", fontClass: "font-dji" },
  { name: "RODE", fontClass: "font-rode" },
  { name: "HOLLYLAND", fontClass: "font-hollyland" },
  { name: "ATOMOS", fontClass: "font-atomos" },
  { name: "SENNHEISER", fontClass: "font-sennheiser" },
  { name: "SMALLHD", fontClass: "font-smallhd" },
  { name: "TILTA", fontClass: "font-tilta" },
  { name: "TIFFEN", fontClass: "font-tiffen" },
];

const testimonials = [
  { name: "Marcos Filho", role: "Cliente", text: "Ótimo atendimento e recepção. Dispostos a ajudar e servir.", stars: 5 },
  { name: "Milennar Baby", role: "Local Guide", text: "Contamos com os serviços da Loc7 há 8 anos e sempre nos atendem prontamente com equipamentos sempre em ótimo estado e com preço justo. Recomendamos a Loc7 sempre!!!", stars: 5 },
  { name: "Raquel Carneiro", role: "Cliente", text: "Loc 7 sempre entrega tudo que promete, equipamento e atendimento impecável!", stars: 5 },
  { name: "Diogo Garcia de Menezes Santos", role: "Cliente", text: "Sempre solícitos e preocupados em nos proporcionar o melhor setup para a execução dos projetos na melhor excelência possível", stars: 5 },
  { name: "Jeniffer Carvalho", role: "Cliente", text: "Minha experiência foi ótima, foram super solicitos e sempre dispostos a ajudar, super recomendo", stars: 5 },
  { name: "Gabriel Silva", role: "Cliente", text: "Excelente atendimento, me ajudaram e tiraram todas minhas duvidas, otima localização!", stars: 5 },
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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const heroSlides = [
    {
      title: "EQUIPAMENTOS\nCINE E BROADCAST",
      subtitle: "Câmeras, lentes e iluminação profissional",
      cta: "Ver Catálogo",
      ctaHref: "/catalogo",
    },
    {
      title: "LENTES\nCINE E FOTO",
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
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % carouselImages.length);
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
    setCarouselIndex(prev => (prev + 3) % carouselImages.length);
  };

  const prevCarousel = () => {
    setCarouselIndex(prev => (prev - 3 + carouselImages.length) % carouselImages.length);
  };

  const getVisibleImages = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(carouselImages[(carouselIndex + i) % carouselImages.length]);
    }
    return visible;
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[70vh] min-h-[400px] overflow-hidden">
        {/* Background - Alternating Images */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, i) => {
            const heroSlideData = [
              { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00051_brightened_029b14bf.webp" },
              { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00394_darkened_19aead4d.webp" },
              { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00358_brightened_afa8c25b.webp" },
            ];
            return (
              <img
                key={i}
                src={heroSlideData[i]?.img}
                alt={slide.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  i === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
        </div>

        {/* Content */}
        <div className="relative z-10 container h-full flex items-center">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="w-12 h-1 bg-[oklch(0.45_0.25_25)]" />
              <span className="text-[oklch(0.45_0.25_25)] text-base uppercase tracking-widest font-display font-bold">
                Locadora de equipamentos audiovisuais em São Paulo
              </span>
            </div>
            
            {heroSlides.map((slide, i) => (
              <div
                key={i}
                className={`transition-all duration-700 ${i === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute'}`}
              >
                {i === currentSlide && (
                  <>
                    <h1 className="font-display font-bold text-white leading-none mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight whitespace-pre-line">
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
                        Falar agora
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
          <span className="text-[oklch(0.8_0_0)] text-xs uppercase tracking-widest font-semibold">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[oklch(0.8_0_0)] to-transparent" />
        </div>
      </section>

      {/* ===== FEATURES BAR ===== */}
      <section className="bg-[oklch(0.06_0_0)] border-y border-[oklch(0.15_0_0)]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[oklch(0.15_0_0)]">
            {[
              { icon: MapPin, title: "São Paulo, SP", desc: "Estrategicamente no polo audiovisual de SP" },
              { icon: Zap, title: "RESERVE ONLINE", desc: "Faça sua reserva em poucos cliques, sem burocracia" },
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

      {/* ===== CAROUSEL SECTION - 3 IMAGES ===== */}
      <section className="py-8 bg-gradient-to-b from-[oklch(0.06_0_0)] to-[oklch(0.22_0_0)] cement-texture">
        <div className="container">
          <div className="mb-8">
            <span className="loc7-section-title text-lg">DESTAQUES</span>
            <div className="loc7-red-line" />
          </div>

          <div className="relative group">
            {/* 3-Image Carousel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {getVisibleImages().map((image, i) => (
                <div
                  key={`${carouselIndex}-${i}`}
                  className="relative overflow-hidden rounded-lg aspect-video bg-[oklch(0.08_0_0)] group/card transition-all duration-500 hover:shadow-lg hover:shadow-[#FF0000]/20"
                >
                  <img
                    src={image.img}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover/card:opacity-80 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                    <p className="text-[oklch(0.45_0.25_25)] text-xs uppercase tracking-widest font-display font-semibold mb-1">
                      {image.category}
                    </p>
                    <h3 className="text-white text-sm font-bold font-display mb-2 line-clamp-2">
                      {image.title}
                    </h3>
                    <a
                      href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Gostaria de solicitar um orçamento."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="loc7-btn-primary inline-flex items-center gap-1 text-xs py-1 px-3"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Orçar
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={prevCarousel}
                className="bg-black/50 hover:bg-[#FF0000] text-white p-2 rounded-full transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextCarousel}
                className="bg-black/50 hover:bg-[#FF0000] text-white p-2 rounded-full transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
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
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:opacity-80 ${
                    i === 0 || i === 1 ? 'brightness-75 group-hover:brightness-65' : 'brightness-50 group-hover:brightness-40'
                  }`}
                />
                {i === 1 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/30 pointer-events-none" />
                )}
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



      {/* ===== CLIENTS ===== */}
      <section className="py-16 bg-[oklch(0.08_0_0)] border-b border-[oklch(0.15_0_0)]">
        <div className="container">
          <div className="text-center mb-12">
            <span className="loc7-section-title text-lg">CLIENTES</span>
            <div className="loc7-red-line mx-auto" />
            <p className="text-[oklch(0.5_0_0)] text-sm mt-3">Confiança de grandes produtoras e emissoras</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            {/* TV Globo */}
            <div className="w-full flex items-center justify-center p-4 bg-[oklch(0.1_0_0)] rounded-lg border border-[oklch(0.15_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 group">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/rZjUsXiiUSg0_64759b6c.png"
                alt="TV Globo"
                className="h-12 w-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            
            {/* Multishow */}
            <div className="w-full flex items-center justify-center p-4 bg-[oklch(0.1_0_0)] rounded-lg border border-[oklch(0.15_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 group">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/aXzIbfu8r1Jl_8c062083.png"
                alt="Multishow"
                className="h-12 w-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            
            {/* SporTV */}
            <div className="w-full flex items-center justify-center p-4 bg-[oklch(0.1_0_0)] rounded-lg border border-[oklch(0.15_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 group">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/raZRe9yIQ4W6_5ab3e16e.png"
                alt="SporTV"
                className="h-12 w-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            
            {/* Placeholder 4 */}
            <div className="w-full flex items-center justify-center p-4 bg-[oklch(0.1_0_0)] rounded-lg border border-[oklch(0.15_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 group">
              <span className="text-[oklch(0.45_0_0)] text-sm font-semibold opacity-50">+ Clientes</span>
            </div>
            
            {/* Placeholder 5 */}
            <div className="w-full flex items-center justify-center p-4 bg-[oklch(0.1_0_0)] rounded-lg border border-[oklch(0.15_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 group">
              <span className="text-[oklch(0.45_0_0)] text-sm font-semibold opacity-50">+ Clientes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section className="py-10 border-y border-[oklch(0.15_0_0)] overflow-hidden bg-gradient-to-b from-[oklch(0.22_0_0)] to-[oklch(0.25_0_0)] cement-texture">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={i}
              className={`text-[oklch(0.45_0_0)] text-2xl font-bold uppercase tracking-widest flex-shrink-0 ${brand.fontClass}`}
            >
              {brand.name}
            </span>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section
        id="testimonials"
        ref={setSectionRef("testimonials")}
        className="py-20 bg-gradient-to-b from-[oklch(0.25_0_0)] to-[oklch(0.22_0_0)] cement-texture"
      >
        <div className="container">
          <div className={`mb-12 transition-all duration-700 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="loc7-section-title text-lg">DEPOIMENTOS</span>
            <div className="loc7-red-line" />
            <p className="text-[oklch(0.5_0_0)] text-sm mt-3">O que nossos clientes dizem sobre a gente</p>
          </div>

          <div className="relative">
            {/* Grid de 3 Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.slice(testimonialIndex, testimonialIndex + 3).map((testimonial, i) => (
                <div
                  key={i}
                  className={`p-6 bg-[oklch(0.06_0_0)] border border-[oklch(0.15_0_0)] rounded-lg transition-all duration-500 min-h-[280px] flex flex-col justify-between ${
                    isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Stars - Golden */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.stars)].map((_, j) => (
                      <span key={j} className="text-2xl" style={{ color: '#FFD700' }}>★</span>
                    ))}
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-[oklch(0.7_0_0)] text-sm mb-4 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Author */}
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-[oklch(0.5_0_0)] text-xs">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicators - Grupos de 3 */}
            <div className="flex gap-2 justify-center mt-8">
              {[0, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === testimonialIndex
                      ? 'w-8 bg-[#FF0000]'
                      : 'w-2 bg-[oklch(0.3_0_0)] hover:bg-[oklch(0.4_0_0)]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
