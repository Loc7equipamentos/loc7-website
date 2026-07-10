/*
 * LOC 7 — Home Page
 * Cinema Noir Industrial style
 * Hero + Carousel + Features + Categories + Products + Brands + About + CTA
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Zap,
  Star,
  ArrowRight,
  Play,
} from "lucide-react";
import { supabase, type Product } from "@/lib/supabase";

const heroSlides = [
  {
    text: "Equipamentos Cine e Broadcast",
    subtitle: "Câmeras, lentes e iluminação profissional",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00051_darkened_8a518622.webp",
  },
  {
    text: "Lentes Cine e Foto",
    subtitle: "Ópticas profissionais de alta qualidade",
    img: "",
  },
  {
    text: "Iluminação Profissional",
    subtitle: "Equipamentos de iluminação de última geração",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00186_darkened_7ce023d4.webp",
  },
];

const HERO_IMAGE = "/hero-loc7.jpg";
const CAMERAS_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/cameras-category-CAmby3gUvFFiGLofYZBGb5.webp";
const LENSES_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/lenses-category-XS4B4DC95N5eLapVz3paDn.webp";
const LIGHTING_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/lighting-category-H6my4tCPCu8QAi3aprr7QA.webp";
const ABOUT_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/about-section-6t4vsfoEi8VscrkczqbQpH.webp";

const carouselImages = [
  {
    id: 1,
    title: "RED Komodo 6K",
    category: "Câmera",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&q=80",
  },
  {
    id: 2,
    title: "Zeiss Supreme Prime Set",
    category: "Lentes",
    img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&h=400&q=80",
  },
  {
    id: 3,
    title: "Aputure 600D Pro",
    category: "Iluminação",
    img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&h=400&q=80",
  },
  {
    id: 4,
    title: "Sony FX9 6K",
    category: "Câmera",
    img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&q=80",
  },
  {
    id: 5,
    title: "Canon C300 Mark III",
    category: "Câmera",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&q=80",
  },
  {
    id: 6,
    title: "DZO Pictor Zoom",
    category: "Lentes",
    img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&h=400&q=80",
  },
  {
    id: 7,
    title: "Godox AD600 Pro",
    category: "Flash",
    img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&h=400&q=80",
  },
  {
    id: 8,
    title: "Blackmagic Pyxis 6K",
    category: "Câmera",
    img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&q=80",
  },
  {
    id: 9,
    title: "Leitz Cine Hektor",
    category: "Lentes",
    img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&h=400&q=80",
  },
];

const featuredProductsFallback = [
  {
    id: 1,
    name: "Sony FX9 6K Full Frame",
    category: "CÂMERA",
    price: "R$ 850,00",
    badge: "FULLFRAME",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
  },
  {
    id: 2,
    name: "Zeiss Supreme Prime Set",
    category: "LENTES",
    price: "R$ 2.200,00",
    badge: "PL MOUNT",
    img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80",
  },
  {
    id: 3,
    name: "Aputure 600d Pro",
    category: "ILUMINAÇÃO",
    price: "R$ 600,00",
    badge: "LED",
    img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80",
  },
  {
    id: 4,
    name: "Canon C300 Mark III",
    category: "CÂMERA",
    price: "R$ 950,00",
    badge: "SUPER35",
    img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80",
  },
  {
    id: 5,
    name: "DZO Pictor Zoom Set",
    category: "LENTES",
    price: "R$ 1.500,00",
    badge: "EF/PL",
    img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80",
  },
  {
    id: 6,
    name: "RED Komodo 6K",
    category: "CÂMERA",
    price: "R$ 1.000,00",
    badge: "S35",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
  },
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
  {
    name: "Marcos Filho",
    role: "Cliente",
    text: "Ótimo atendimento e recepção. Dispostos a ajudar e servir.",
    stars: 5,
  },
  {
    name: "Milennar Baby",
    role: "Local Guide",
    text: "Contamos com os serviços da Loc7 há 8 anos e sempre nos atendem prontamente com equipamentos sempre em ótimo estado e com preço justo. Recomendamos a Loc7 sempre!!!",
    stars: 5,
  },
  {
    name: "Raquel Carneiro",
    role: "Cliente",
    text: "Loc 7 sempre entrega tudo que promete, equipamento e atendimento impecável!",
    stars: 5,
  },
  {
    name: "Diogo Garcia de Menezes Santos",
    role: "Cliente",
    text: "Sempre solícitos e preocupados em nos proporcionar o melhor setup para a execução dos projetos na melhor excelência possível",
    stars: 5,
  },
  {
    name: "Jeniffer Carvalho",
    role: "Cliente",
    text: "Minha experiência foi ótima, foram super solicitos e sempre dispostos a ajudar, super recomendo",
    stars: 5,
  },
  {
    name: "Gabriel Silva",
    role: "Cliente",
    text: "Excelente atendimento, me ajudaram e tiraram todas minhas duvidas, otima localização!",
    stars: 5,
  },
];

const normalizeCategory = (value: string | null | undefined) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const formatProductPrice = (price?: number | null) => {
  if (price == null) return "0,00";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const getProductImages = (product: Product) => {
  const rawImages = (product as any)?.images;
  const imageUrl = product.image_url;

  const imagesFromArray = Array.isArray(rawImages)
    ? rawImages.filter((img) => typeof img === "string" && img.trim().length > 0)
    : [];

  const uniqueImages = [...imagesFromArray];

  if (imageUrl && !uniqueImages.includes(imageUrl)) {
    uniqueImages.unshift(imageUrl);
  }

  return uniqueImages;
};

type HomeFeaturedCardProps = {
  product: Product;
};

function HomeFeaturedCard({ product }: HomeFeaturedCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const productImages = useMemo(() => getProductImages(product), [product]);
  const primaryImage = productImages[0] || product.image_url || "";
  const secondaryImage = productImages[1] || primaryImage;
  const currentImage =
    isHovered && secondaryImage ? secondaryImage : primaryImage;

  return (
    <Link
      href={`/equipamentos/${product.slug || product.id}`}
      className="group block"
    >
      <div
        className="h-full overflow-hidden rounded-xl border border-black/[0.04] bg-white shadow-[0_16px_42px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out hover:-translate-y-[4px] hover:shadow-[0_22px_55px_rgba(0,0,0,0.16)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* IMAGEM */}
        <div className="relative bg-white px-3 pt-3">
          {product.badge && (
            <div className="absolute left-3 top-3 z-10">
              <span className="rounded bg-black px-2 py-1 text-[10px] font-semibold text-white">
                {product.badge}
              </span>
            </div>
          )}

          <div className="flex h-[175px] items-center justify-center sm:h-[195px] md:h-[215px]">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <span className="text-xs text-neutral-400">Sem imagem</span>
            )}
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="flex flex-col gap-2 px-4 pb-4 pt-3">
          <div>
            <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-600 sm:text-[11px]">
              {product.category}
            </p>

            <h3 className="line-clamp-2 min-h-[38px] text-[13.5px] font-semibold leading-[1.18] tracking-[-0.01em] text-neutral-950 sm:text-[14.5px]">
              {product.name}
            </h3>
          </div>

          <div className="mt-2 flex items-end justify-between gap-3">
            {Number(product.price) > 0 ? (
              <span className="text-[13px] font-semibold text-neutral-950">
                R$ {formatProductPrice(product.price)}
                <span className="ml-1 text-[10px] font-medium text-neutral-600">
                  /dia
                </span>
              </span>
            ) : (
              <span />
            )}

            <span className="shrink-0 text-[10.5px] font-bold uppercase tracking-[0.1em] text-neutral-700 transition-colors duration-300 group-hover:text-neutral-950 sm:text-[11px]">
              Ver item
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredCategoryOptions, setFeaturedCategoryOptions] = useState<
    Array<{ value: string; label: string }>
  >([{ value: "todas", label: "Todas" }]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const howToMobileScrollRef = useRef<HTMLDivElement | null>(null);
  const trabalhosMobileScrollRef = useRef<HTMLDivElement | null>(null);

  const heroSlidesContent = [
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
      setCurrentSlide((prev) => (prev + 1) % heroSlidesContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlidesContent.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(carouselTimer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));

          if (!entry.isIntersecting) {
            if (entry.target.id === "como-alugar") {
              howToMobileScrollRef.current?.scrollTo({
                left: 0,
                behavior: "auto",
              });
            }

            if (entry.target.id === "trabalhos-realizados") {
              trabalhosMobileScrollRef.current?.scrollTo({
                left: 0,
                behavior: "auto",
              });
            }
          }
        });
      },
      { threshold: 0.35 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [
          { data: productsData, error: productsError },
          { data: categoriesData, error: categoriesError },
        ] = await Promise.all([
          supabase
            .from("products")
            .select("*")
            .eq("is_featured", true)
            .order("featured_order", { ascending: true })
            .limit(4),

          supabase.from("categories").select("name").order("name"),
        ]);

        if (productsError) throw productsError;
        if (categoriesError) throw categoriesError;

        setFeaturedProducts(productsData || []);

        const options = [
          { value: "todas", label: "Todas" },
          ...((categoriesData || [])
            .map((category) => {
              const label = (category.name || "").trim();
              const value = normalizeCategory(label);
              if (!label || !value) return null;
              return { value, label };
            })
            .filter(Boolean) as Array<{ value: string; label: string }>),
        ];

        const deduped = Array.from(
          new Map(options.map((item) => [item.value, item])).values()
        );

        setFeaturedCategoryOptions(deduped);
      } catch (error) {
        console.error("Erro ao buscar dados da home:", error);
        setFeaturedProducts([]);
        setFeaturedCategoryOptions([{ value: "todas", label: "Todas" }]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchHomeData();
  }, []);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[oklch(0.08_0_0)]">
      {/* ===== HERO SECTION ===== */}
<section className="relative h-[360px] overflow-hidden bg-black md:h-[500px] lg:h-[560px]">
  {/* DESKTOP VIDEO FULL */}
  <video
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
  >
    <source src="/videos/loc7-hero-drone-v1.mp4" type="video/mp4" />
  </video>

  {/* MOBILE VIDEO */}
  <video
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    className="absolute inset-0 block h-full w-full object-cover object-center md:hidden"
  >
    <source src="/videos/loc7-hero-mobi-vert-v1.mp4" type="video/mp4" />
  </video>

  {/* OVERLAY GERAL */}
  <div className="absolute inset-0 bg-black/35" />

  {/* GRADIENT DESKTOP — invade o vídeo, sem corte reto */}
  <div className="absolute inset-y-0 left-0 hidden w-[70%] bg-gradient-to-r from-black via-black/80 to-transparent md:block" />

{/* GRADIENT INFERIOR */}
<div className="absolute inset-x-0 bottom-0 hidden h-[90px] bg-gradient-to-t from-black/55 via-black/15 to-transparent md:block" />
  
  {/* GRADIENT MOBILE — protege texto */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/40 md:hidden" />

  {/* CONTENT */}
  <div className="container relative z-10 flex h-full items-start pt-[42px] md:pt-32 lg:pt-36">
    <div className="max-w-[560px]">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white/65">
        LOCAÇÃO DE EQUIPAMENTOS AUDIOVISUAIS
      </p>

      <h1 className="mt-3 font-display text-[28px] font-medium leading-none tracking-[0.1em] text-white md:text-[30px] lg:text-[32px]">
        CINE · FOTO · BROADCAST
      </h1>
    </div>
  </div>
</section>

      {/* ===== DESTAQUES ===== */}
      <section className="bg-black py-10 md:py-12">
        <div className="container">
          {/* Título */}
          <div className="relative z-30 mb-6 md:mb-8 md:-translate-y-[52px]">
            <div className="flex items-center gap-3">
              <span className="text-[13px] uppercase tracking-[0.2em] text-white/80 font-medium">
                EQUIPAMENTOS EM DESTAQUE
              </span>

              <div className="h-[1px] flex-1 bg-white/15" />
            </div>

            <div className="mt-2 h-[2px] w-10 bg-red-700" />
          </div>

          {/* Categorias */}
          <div className="mb-6 sm:hidden">
            <div className="overflow-x-auto">
              <div className="flex gap-2 pb-1">
                {featuredCategoryOptions.map((category) =>
                  category.value === "todas" ? (
                    <button
                      key={category.value}
                      type="button"
                      className="whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-[12px] font-semibold tracking-[0.01em] text-white transition-colors"
                    >
                      {category.label}
                    </button>
                  ) : (
                    <Link
                      key={category.value}
                      href={`/catalogo/${category.value}`}
                      className="whitespace-nowrap rounded-full border border-neutral-300 bg-white px-4 py-2 text-[12px] font-semibold tracking-[0.01em] text-neutral-800 transition-colors hover:border-black hover:text-black"
                    >
                      {category.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-4 md:gap-5 lg:grid-cols-4 lg:gap-5">
            {featuredProducts.slice(0, 4).map((product) => (
              <HomeFeaturedCard key={product.id} product={product} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/catalogo"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "auto",
                });
              }}
             className="inline-flex items-center justify-center border border-white/45 px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.22em] text-white transition-all duration-300 ease-out hover:border-white hover:bg-white hover:text-black hover:shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
            >
              Ver catálogo completo
            </Link>
          </div>
        </div>
      </section>

{/* ===== TRABALHOS REALIZADOS ===== */}
      <section
        id="trabalhos-realizados"
        ref={setSectionRef("trabalhos-realizados")}
        className="bg-black py-8 md:py-10"
      >
        <div className="container">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-[13px] uppercase tracking-[0.2em] text-white/80">
                ALGUNS TRABALHOS REALIZADOS
              </span>

              <div className="h-[1px] flex-1 bg-white/15" />
            </div>

            <div className="mt-2 h-[2px] w-10 bg-red-700" />
          </div>

          <div
            ref={trabalhosMobileScrollRef}
            className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible"
          >
            {[
              {
                img: "/images/trabalhos/the-voice-globo.jpg",
                title: "The Voice Brasil — TV Globo",
              },
              {
                img: "/images/trabalhos/esquadrao-moda-sbt.jpg",
                title: "Esquadrão da Moda — SBT",
              },
              {
                img: "/images/trabalhos/pesadelo-cozinha-band.jpg",
                title: "Pesadelo na Cozinha — Band",
              },
              {
                img: "/images/trabalhos/bbb-globo.jpg",
                title: "Big Brother Brasil — TV Globo",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`snap-start relative min-w-[88%] overflow-hidden rounded-xl bg-neutral-900 md:min-w-0 transition-all duration-700 ease-out ${
                  isVisible["trabalhos-realizados"]
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-[-40px]"
                }`}
                style={{
                  transitionDelay: `${index * 0.08}s`,
                }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-[420px] md:h-[480px] w-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.02]"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4">
                  <span className="text-sm font-medium text-white">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ===== COMO ALUGAR ===== */}
      <section
        id="como-alugar"
        ref={setSectionRef("como-alugar")}
       className="scroll-mt-28 bg-[oklch(0.95_0_0)] py-8 md:scroll-mt-0 md:py-10"
      >
        <div className="container">
          <div
            className={`transition-all duration-700 ease-out ${
              isVisible["como-alugar"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Título padrão da Home */}
            <div className="mb-7 md:mb-8">
              <div className="flex items-center gap-3">
                <span className="text-[13px] uppercase tracking-[0.2em] text-black/90">
                  COMO ALUGAR
                </span>

                <div className="h-[1px] flex-1 bg-black/25" />
              </div>

              <div className="mt-2 h-[2px] w-12 bg-red-700" />
            </div>

            <h2 className="max-w-[720px] text-[34px] font-semibold leading-[1.08] tracking-[-0.045em] text-neutral-950 md:text-[42px] lg:text-[48px]">
              Locação simples, ágil e sem burocracia.
            </h2>

            {/* DESKTOP — faixa editorial */}
            <div className="mt-10 hidden lg:block">
              <div className="grid grid-cols-4 divide-x divide-black/15">
                  {[
                    {
                      number: "01",
                      title: "Escolha os equipamentos",
                      text: "Monte seu setup e envie sua solicitação.",
                    },
                    {
                      number: "02",
                      title: "Solicite seu orçamento",
                      text: "Verificamos disponibilidade e condições para sua produção.",
                    },
                    {
                      number: "03",
                      title: "Cadastre-se",
                      text: "Preencha algumas informações para conhecermos melhor você.",
                      href: "/cadastro-locacao",
                    },
                    {
                      number: "04",
                      title: "Agende a retirada",
                      text: "Escolha a melhor data para retirar seus equipamentos.",
                    },
                  ].map((step, index) => (
                    <div
                      key={step.number}
                      className={`relative min-h-[235px] px-7 py-8 transition-all duration-700 ease-out ${
                        isVisible["como-alugar"]
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-5"
                      }`}
                      style={{ transitionDelay: `${index * 0.45}s` }}
                    >
                      <span className="block text-[24px] font-bold uppercase tracking-[0.16em] text-red-700">
                        {step.number}
                      </span>

                      <div className="mt-8">
                        {step.href ? (
                          <h3 className="text-[26px] font-semibold uppercase leading-[1.05] tracking-[0.02em] text-neutral-950">
                            {step.title}
                          </h3>
                        ) : (
                          <h3 className="text-[26px] font-semibold uppercase leading-[1.05] tracking-[0.02em] text-neutral-950">
                            {step.title}
                          </h3>
                        )}

                        <p className="mt-4 max-w-[265px] text-[16px] leading-6 text-black/90">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-10 mb-6 flex justify-center">
                <Link
                  href="/cadastro-locacao"
                  className="inline-flex items-center justify-center gap-3 border border-black/45 px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.26em] text-black transition-all duration-300 ease-out hover:border-black hover:bg-black hover:text-white"
                >
                  Iniciar cadastro
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* MOBILE — swipe com vazamento */}
            <div className="mt-8 lg:hidden">
              <div
                ref={howToMobileScrollRef}
                className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {[
                  {
                    number: "01",
                    title: "Escolha os equipamentos",
                    text: "Monte seu setup e envie sua solicitação.",
                  },
                  {
                    number: "02",
                    title: "Solicite seu orçamento",
                    text: "Verificamos disponibilidade e condições para sua produção.",
                  },
                  {
                    number: "03",
                    title: "Cadastre-se",
                    text: "Preencha algumas informações para conhecermos melhor você.",
                    href: "/cadastro-locacao",
                  },
                  {
                    number: "04",
                    title: "Agende a retirada",
                    text: "Escolha a melhor data para retirar seus equipamentos.",
                  },
                ].map((step, index) => (
                  <div
                    key={step.number}
                    className={`snap-start min-h-[235px] min-w-[76%] shrink-0 border-l border-black/15 px-5 py-4 transition-all duration-700 ease-out ${
                      isVisible["como-alugar"]
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-[-40px]"
                    }`}
                    style={{ transitionDelay: `${index * 0.45}s` }}
                  >
                    <span className="block text-[22px] font-bold uppercase tracking-[0.16em] text-red-700">
                      {step.number}
                    </span>

                    <div className="mt-8">
                      {step.href ? (
                        <h3 className="text-[25px] font-semibold uppercase leading-[1.05] tracking-[0.02em] text-neutral-950">
                          {step.title}
                        </h3>
                      ) : (
                        <h3 className="text-[25px] font-semibold uppercase leading-[1.05] tracking-[0.02em] text-neutral-950">
                          {step.title}
                        </h3>
                      )}

                      <p className="mt-4 max-w-[260px] text-[15.5px] leading-6 text-black/75">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-center">
                <Link
                  href="/cadastro-locacao"
                  className="inline-flex w-full max-w-[300px] items-center justify-center gap-3 border border-black/45 px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.26em] text-black transition-all duration-300 ease-out hover:border-black hover:bg-black hover:text-white"
                >
                  Iniciar cadastro
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* ===== MAPA ===== */}
<section className="relative overflow-hidden bg-black pt-10 pb-0 md:pt-12">
  <video
  autoPlay
  muted
  loop
  playsInline
  preload="auto"
  className="absolute inset-0 hidden h-full w-full object-cover opacity-[0.75] md:block"
>
    <source src="/video-expedicao-loc7.mp4" type="video/mp4" />
  </video>

<div className="absolute inset-0 bg-black md:bg-black/12" />
<div className="absolute inset-0 hidden bg-gradient-to-b from-black/20 via-transparent to-black/35 md:block" />

  <div className="container relative z-10 pb-12 md:pb-14">
    {/* Título padrão */}
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <span className="text-[13px] uppercase tracking-[0.22em] text-white">
          LOCALIZAÇÃO
        </span>

        <div className="h-[1px] flex-1 bg-white/35" />
      </div>

      <div className="mt-2 h-[2px] w-12 bg-red-700" />
    </div>

    {/* Mapa */}
    <div className="overflow-hidden rounded-xl border border-white/15 bg-black shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
     <iframe
  title="Mapa da Loc7 Equipamentos - Vila Leopoldina, São Paulo"
  src="https://www.google.com/maps?q=Av.%20Imperatriz%20Leopoldina,%20957,%20Vila%20Leopoldina,%20São%20Paulo%20-%20SP&output=embed"
  width="100%"
  height="380"
  style={{ border: 0 }}
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>
    </div>
  </div>
</section>
    </div>
  );
}
