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

const HERO_IMAGE = "/hero-loc7.png";
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
  const currentImage = isHovered && secondaryImage ? secondaryImage : primaryImage;

  return (
    <Link
      href={`/equipamentos/${product.slug || product.id}`}
      className="group block"
    >
      <div
        className="h-full overflow-hidden rounded-xl bg-white shadow-[0_6px_18px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_10px_24px_rgba(0,0,0,0.09)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative bg-white px-3 pt-3 sm:px-4 sm:pt-4">
          {product.badge && (
            <div className="absolute left-2 top-2 z-10 sm:left-3 sm:top-3">
              <span className="rounded bg-[#FF0000] px-2 py-1 text-[9px] font-bold text-white sm:text-[10px]">
                {product.badge}
              </span>
            </div>
          )}

          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-white">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white">
                <span className="text-xs text-[oklch(0.7_0_0)] sm:text-sm">
                  Sem imagem
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex min-h-[106px] flex-col justify-between bg-white px-3 pb-3 pt-2.5 sm:min-h-[114px] sm:px-4 sm:pb-4 sm:pt-3">
          <div>
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.45_0.25_25)] sm:text-[10px]">
              {product.category}
            </p>

            <h3 className="line-clamp-2 min-h-[2rem] text-[12px] font-semibold leading-snug text-[oklch(0.08_0_0)] sm:min-h-[2.2rem] sm:text-[13px]">
              {product.name}
            </h3>
          </div>

          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-[14px] font-bold leading-none text-[#FF0000] sm:text-[15px]">
              R$ {formatProductPrice(product.price)}
              <span className="ml-1 text-[9px] font-normal text-[oklch(0.5_0_0)] sm:text-[10px]">
                /dia
              </span>
            </p>

            <span className="text-[10px] font-semibold text-[oklch(0.35_0_0)] transition-colors duration-300 group-hover:text-[oklch(0.08_0_0)] sm:text-[11px]">
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
  const [selectedFeaturedCategory, setSelectedFeaturedCategory] = useState("todas");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [{ data: productsData, error: productsError }, { data: categoriesData, error: categoriesError }] =
          await Promise.all([
            supabase.from("products").select("*").limit(6),
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

  const filteredFeaturedProducts = useMemo(() => {
    if (selectedFeaturedCategory === "todas") return featuredProducts;

    return featuredProducts.filter(
      (product) => normalizeCategory(product.category) === selectedFeaturedCategory
    );
  }, [featuredProducts, selectedFeaturedCategory]);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
            {/* ===== HERO SECTION ===== */}
<section className="relative h-[72vh] min-h-[520px] overflow-hidden bg-black">
  <div className="absolute inset-0">
    <img
      src="/hero-loc7.png"
      alt="Loc7 Equipamentos Audiovisuais"
      className="absolute inset-y-0 right-0 h-full w-[72%] object-contain object-right"
    />

    {/* Gradiente apenas para leitura do texto */}
    <div className="absolute inset-y-0 left-0 w-[52%] bg-gradient-to-r from-black via-black/80 to-transparent" />
  </div>

  <div className="relative z-10 container flex h-full items-center">
    <div className="max-w-[560px]">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
        LOCAÇÃO DE EQUIPAMENTOS AUDIOVISUAIS
      </p>

     <h1 className="font-display whitespace-nowrap text-[28px] font-semibold leading-none tracking-[0.08em] text-white md:text-[32px] lg:text-[36px]">
  CINE · FOTO · BROADCAST
</h1>

      <div className="mt-8">
        <Link
          href="/catalogo"
          className="inline-flex min-w-[240px] items-center justify-center border border-white/30 bg-white/10 px-10 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
        >
          Catálogo
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* ===== FEATURED PRODUCTS FROM SUPABASE ===== */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[oklch(0.95_0_0)]">
        <div className="container">
          <div className="mb-6 sm:mb-8">
            <span className="loc7-section-title text-lg text-[oklch(0.08_0_0)]">
              DESTAQUES
            </span>
            <div className="loc7-red-line" />
          </div>

          {loadingProducts ? (
            <div className="text-center py-12">
              <p className="text-[oklch(0.5_0_0)]">Carregando produtos...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[oklch(0.5_0_0)]">Nenhum produto disponível</p>
            </div>
          ) : (
            <>
              <div className="mb-4 sm:hidden">
                <div className="-mx-4 overflow-x-auto px-4">
                  <div className="flex min-w-max gap-2 pb-1">
                    {featuredCategoryOptions.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedFeaturedCategory(category.value)}
                        className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
                          selectedFeaturedCategory === category.value
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-300 bg-white text-neutral-700"
                        }`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                {filteredFeaturedProducts.map((product) => (
                  <HomeFeaturedCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
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
              {
                title: "CÂMERAS",
                img: CAMERAS_IMG,
                href: "/catalogo/cameras",
                desc: "Cinema, mirrorless e mais",
              },
              {
                title: "LENTES",
                img: LENSES_IMG,
                href: "/catalogo/lentes",
                desc: "Primes, zooms e anamórficos",
              },
              {
                title: "ILUMINAÇÃO",
                img: LIGHTING_IMG,
                href: "/catalogo/iluminacao",
                desc: "LED, flash e modificadores",
              },
            ].map((cat, i) => (
              <Link
                key={cat.title}
                href={cat.href}
                className={`relative overflow-hidden aspect-[4/3] group block transition-all duration-500 ${
                  isVisible.categories ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:opacity-80 ${
                    i === 0 || i === 1
                      ? "brightness-75 group-hover:brightness-65"
                      : "brightness-50 group-hover:brightness-40"
                  }`}
                />
                {i === 1 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/30 pointer-events-none" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h3 className="font-display font-bold text-white text-3xl uppercase tracking-widest mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-[oklch(0.6_0_0)] text-sm mb-4">
                    {cat.desc}
                  </p>
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
            <p className="text-[oklch(0.5_0_0)] text-sm mt-3">
              Confiança de grandes produtoras e emissoras
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
            <div className="w-full flex items-center justify-center p-4 bg-[oklch(0.1_0_0)] rounded-lg border border-[oklch(0.15_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 group">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/rZjUsXiiUSg0_64759b6c.png"
                alt="TV Globo"
                className="h-12 w-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <div className="w-full flex items-center justify-center p-4 bg-[oklch(0.1_0_0)] rounded-lg border border-[oklch(0.15_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 group">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/aXzIbfu8r1Jl_8c062083.png"
                alt="Multishow"
                className="h-12 w-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <div className="w-full flex items-center justify-center p-4 bg-[oklch(0.1_0_0)] rounded-lg border border-[oklch(0.15_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 group">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/raZRe9yIQ4W6_5ab3e16e.png"
                alt="SporTV"
                className="h-12 w-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <div className="w-full flex items-center justify-center p-4 bg-[oklch(0.1_0_0)] rounded-lg border border-[oklch(0.15_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 group">
              <span className="text-[oklch(0.45_0_0)] text-sm font-semibold opacity-50">
                + Clientes
              </span>
            </div>

            <div className="w-full flex items-center justify-center p-4 bg-[oklch(0.1_0_0)] rounded-lg border border-[oklch(0.15_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 group">
              <span className="text-[oklch(0.45_0_0)] text-sm font-semibold opacity-50">
                + Clientes
              </span>
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
          <div
            className={`mb-12 transition-all duration-700 ${
              isVisible.testimonials ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="loc7-section-title text-lg">DEPOIMENTOS</span>
            <div className="loc7-red-line" />
            <p className="text-[oklch(0.5_0_0)] text-sm mt-3">
              O que nossos clientes dizem sobre a gente
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.slice(testimonialIndex, testimonialIndex + 3).map((testimonial, i) => (
                <div
                  key={i}
                  className={`p-6 bg-[oklch(0.06_0_0)] border border-[oklch(0.15_0_0)] rounded-lg transition-all duration-500 min-h-[280px] flex flex-col justify-between ${
                    isVisible.testimonials ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.stars)].map((_, j) => (
                      <span key={j} className="text-2xl" style={{ color: "#FFD700" }}>
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="text-[oklch(0.7_0_0)] text-sm mb-4 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-[oklch(0.5_0_0)] text-xs">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-center mt-8">
              {[0, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === testimonialIndex
                      ? "w-8 bg-[#FF0000]"
                      : "w-2 bg-[oklch(0.3_0_0)] hover:bg-[oklch(0.4_0_0)]"
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
