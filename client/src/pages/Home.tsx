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
            <div className="absolute inset-y-0left-2 top-2 z-10 sm:left-3 sm:top-3">
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
    <div className="min-h-screen overflow-x-hidden bg-[oklch(0.08_0_0)]">
           {/* ===== HERO SECTION ===== */}
     <section className="relative h-[620px] overflow-hidden bg-black md:h-[680px] lg:h-[720px]">
        <img
          src={HERO_IMAGE}
          alt="Loc7 Equipamentos Audiovisuais"
         className="absolute inset-y-0 right-0 h-full w-[72%] object-cover object-[55%_center] md:object-[80%_center]"
        />

        <div className="absolute inset-y-0 left-0 w-[92%] bg-gradient-to-r from-black via-black/85 to-transparent md:w-[58%] md:via-black/85" />

        <div className="relative z-10 container flex h-full items-center">
          <div className="max-w-[560px]">
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">
              LOCAÇÃO DE EQUIPAMENTOS AUDIOVISUAIS
            </p>

            <h1 className="mt-2 font-display text-[28px] font-medium leading-none tracking-[0.1em] text-white md:text-[30px] lg:text-[32px]">
              CINE · FOTO · BROADCAST
            </h1>

            <div className="mt-10">
              <Link
                href="/catalogo"
                className="inline-flex min-w-[240px] items-center justify-center border border-white/50 px-10 py-4 text-[12px] font-medium uppercase tracking-[0.28em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
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
                <div className="overflow-x-auto">
                 <div className="flex min-w-max gap-2 pb-1 px-4">
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

      
{/* ===== TRABALHOS REALIZADOS ===== */}
<section className="bg-black py-16">
  <div className="container">
    <div className="mb-8">
      <span className="loc7-section-title text-lg text-white">
        ALGUNS TRABALHOS REALIZADOS POR NÓS
      </span>
      <div className="loc7-red-line" />
    </div>

    <div className="flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          className="relative min-w-[85%] overflow-hidden rounded-xl bg-neutral-900 md:min-w-[31.5%]"
        >
          <img
            src={item.img}
            alt={item.title}
            className="h-[360px] w-full object-cover md:h-[300px]"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
            <span className="text-sm font-medium text-white">
              {item.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
    

         </div>
  );
}
