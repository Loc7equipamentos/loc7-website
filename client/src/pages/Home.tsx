import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { MapPin, Zap, Star, ArrowRight } from "lucide-react";
import { supabase, type Product } from "@/lib/supabase";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00394_darkened_19aead4d.webp";
const HERO_VIDEO = "/hero-primo.mp4";
const HERO_POSTER = "/hero-primo-poster.png";
const CAMERAS_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/cameras-category-CAmby3gUvFFiGLofYZBGb5.webp";
const LENSES_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/lenses-category-XS4B4DC95N5eLapVz3paDn.webp";
const LIGHTING_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/lighting-category-H6my4tCPCu8QAi3aprr7QA.webp";

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

const businessWorlds = [
  {
    title: "Locação",
    description:
      "Equipamentos para produções, eventos e criação de conteúdo.",
    href: "/catalogo",
  },
  {
    title: "Produção",
    description:
      "Equipe e estrutura para execução técnica completa.",
    href: "/producao",
  },
  {
    title: "XR / Imersivo",
    description:
      "Projetos visuais com tecnologia imersiva em parceria com a On Projeções.",
    href: "/xr",
  },
];

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
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
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").limit(6);

        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setFeaturedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Loc7 Equipamentos"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[oklch(0.08_0_0)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent md:from-black/75 md:via-black/30 md:to-black/10" />
        </div>

        <div className="relative z-10">
          <div className="container pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-16">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-[oklch(0.45_0.25_25)] sm:w-14" />
                <span className="text-[11px] font-display font-semibold uppercase tracking-[0.28em] text-[oklch(0.72_0_0)] sm:text-xs">
                  Loc7 Equipamentos
                </span>
              </div>
<div className="mt-10 lg:mt-0">
  <button
    type="button"
    onClick={() => setShowVideo(true)}
    className="group relative block w-full overflow-hidden rounded-[28px] border border-white/10 bg-black/30 text-left shadow-2xl"
  >
    <img
      src={HERO_POSTER}
      alt="Operação real Loc7"
      className="h-[420px] w-full object-cover object-center sm:h-[520px] lg:h-[620px]"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

    <div className="absolute bottom-0 left-0 right-0 p-5">
      <p className="text-sm text-white/80">
        Produção real • Grupo Primo
      </p>
    </div>

    <div className="absolute inset-0 flex items-center justify-center">
      <Play className="w-10 h-10 text-white opacity-80 group-hover:scale-110 transition" />
    </div>
  </button>
</div>
              <h1 className="max-w-4xl text-balance font-display text-[2rem] font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-[2.6rem] md:text-[3.8rem] lg:text-[4.6rem]">
                Equipamentos audiovisuais para produção profissional.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[oklch(0.78_0_0)] sm:text-base md:mt-6 md:text-lg">
                Câmeras, lentes, iluminação e suporte técnico para produções de
                todos os níveis.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-8">
                <a
                  href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Gostaria de solicitar um orçamento."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="loc7-btn-primary inline-flex min-h-[52px] items-center justify-center gap-2 px-6 text-sm sm:min-h-[54px] sm:text-base"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Solicitar orçamento
                </a>

                <Link
                  href="/catalogo"
                  className="loc7-btn-outline inline-flex min-h-[52px] items-center justify-center gap-2 px-6 text-sm sm:min-h-[54px] sm:text-base"
                >
                  Ver catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-10 md:mt-12">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[oklch(0.30_0_0)]" />
                <p className="text-[11px] uppercase tracking-[0.26em] text-[oklch(0.68_0_0)]">
                  Três formas de trabalhar com a Loc7
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                {businessWorlds.map((world, i) => (
                  <Link
                    key={world.title}
                    href={world.href}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-[2px] transition-all duration-300 hover:border-[oklch(0.45_0.25_25)] hover:bg-white/8 md:min-h-[168px] md:p-5"
                  >
                    <div className="flex h-full flex-col justify-between gap-6">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[oklch(0.62_0_0)]">
                          0{i + 1}
                        </p>
                        <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-white md:text-[1.55rem]">
                          {world.title}
                        </h2>
                        <p className="mt-3 max-w-sm text-sm leading-relaxed text-[oklch(0.76_0_0)]">
                          {world.description}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-2 text-sm font-medium text-[oklch(0.88_0_0)]">
                        Entrar
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES BAR ===== */}
      <section className="border-y border-[oklch(0.15_0_0)] bg-[oklch(0.06_0_0)]">
        <div className="container">
          <div className="grid grid-cols-1 divide-y divide-[oklch(0.15_0_0)] md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              {
                icon: MapPin,
                title: "Operação ativa",
                desc: "Atendimento rápido para demandas reais de produção",
              },
              {
                icon: Zap,
                title: "Solicitação ágil",
                desc: "Fluxo direto para orçamento e atendimento comercial",
              },
              {
                icon: Star,
                title: "Equipamentos Premium",
                desc: "Seleção profissional para diferentes escalas de projeto",
              },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex items-center gap-4 px-4 py-5 sm:px-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[oklch(0.45_0.25_25)]">
                    <Icon className="h-5 w-5 text-[oklch(0.45_0.25_25)]" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold uppercase tracking-wide text-white">
                      {feat.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[oklch(0.5_0_0)]">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS FROM SUPABASE ===== */}
      <section className="bg-[oklch(0.95_0_0)] py-16">
        <div className="container">
          <div className="mb-12">
            <span className="loc7-section-title text-lg text-[oklch(0.08_0_0)]">
              DESTAQUES
            </span>
            <div className="loc7-red-line" />
          </div>

          {loadingProducts ? (
            <div className="py-12 text-center">
              <p className="text-[oklch(0.5_0_0)]">Carregando produtos...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[oklch(0.5_0_0)]">Nenhum produto disponível</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/equipamentos/${product.slug || product.id}`}
                  className="group block"
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
                    <div className="relative aspect-square overflow-hidden bg-[oklch(0.92_0_0)]">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[oklch(0.9_0_0)]">
                          <span className="text-sm text-[oklch(0.7_0_0)]">
                            Sem imagem
                          </span>
                        </div>
                      )}

                      {product.badge && (
                        <div className="absolute left-3 top-3">
                          <span className="rounded bg-[#FF0000] px-2 py-1 text-xs font-bold text-white">
                            {product.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[oklch(0.45_0.25_25)]">
                          {product.category}
                        </p>
                        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-[oklch(0.08_0_0)]">
                          {product.name}
                        </h3>
                      </div>

                      <p className="text-lg font-bold text-[#FF0000]">
                        R$ {product.price?.toFixed(2) || "0,00"}
                        <span className="ml-1 text-xs font-normal text-[oklch(0.5_0_0)]">
                          /dia
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CATEGORIES GRID ===== */}
      <section
        id="categories"
        ref={setSectionRef("categories")}
        className="pb-20 pt-4"
      >
        <div className="container">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
                className={`group relative block aspect-[4/3] overflow-hidden transition-all duration-500 ${
                  isVisible.categories
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className={`h-full w-full object-cover transition-transform duration-700 group-hover:opacity-80 ${
                    i === 0 || i === 1
                      ? "brightness-75 group-hover:brightness-65"
                      : "brightness-50 group-hover:brightness-40"
                  }`}
                />

                {i === 1 && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/30" />
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h3 className="mb-2 font-display text-3xl font-bold uppercase tracking-widest text-white">
                    {cat.title}
                  </h3>
                  <p className="mb-4 text-sm text-[oklch(0.6_0_0)]">
                    {cat.desc}
                  </p>
                  <span className="border border-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-all group-hover:border-[oklch(0.45_0.25_25)] group-hover:bg-[oklch(0.45_0.25_25)]">
                    Ver {cat.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CLIENTS ===== */}
      <section className="border-b border-[oklch(0.15_0_0)] bg-[oklch(0.08_0_0)] py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="loc7-section-title text-lg">CLIENTES</span>
            <div className="loc7-red-line mx-auto" />
            <p className="mt-3 text-sm text-[oklch(0.5_0_0)]">
              Confiança de grandes produtoras e emissoras
            </p>
          </div>

          <div className="grid grid-cols-2 items-center justify-items-center gap-8 md:grid-cols-5">
            <div className="group flex w-full items-center justify-center rounded-lg border border-[oklch(0.15_0_0)] bg-[oklch(0.1_0_0)] p-4 transition-all duration-300 hover:border-[oklch(0.45_0.25_25)]">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/rZjUsXiiUSg0_64759b6c.png"
                alt="TV Globo"
                className="h-12 w-auto opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            <div className="group flex w-full items-center justify-center rounded-lg border border-[oklch(0.15_0_0)] bg-[oklch(0.1_0_0)] p-4 transition-all duration-300 hover:border-[oklch(0.45_0.25_25)]">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/aXzIbfu8r1Jl_8c062083.png"
                alt="Multishow"
                className="h-12 w-auto opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            <div className="group flex w-full items-center justify-center rounded-lg border border-[oklch(0.15_0_0)] bg-[oklch(0.1_0_0)] p-4 transition-all duration-300 hover:border-[oklch(0.45_0.25_25)]">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/raZRe9yIQ4W6_5ab3e16e.png"
                alt="SporTV"
                className="h-12 w-auto opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            <div className="group flex w-full items-center justify-center rounded-lg border border-[oklch(0.15_0_0)] bg-[oklch(0.1_0_0)] p-4 transition-all duration-300 hover:border-[oklch(0.45_0.25_25)]">
              <span className="text-sm font-semibold text-[oklch(0.45_0_0)] opacity-50">
                + Clientes
              </span>
            </div>

            <div className="group flex w-full items-center justify-center rounded-lg border border-[oklch(0.15_0_0)] bg-[oklch(0.1_0_0)] p-4 transition-all duration-300 hover:border-[oklch(0.45_0.25_25)]">
              <span className="text-sm font-semibold text-[oklch(0.45_0_0)] opacity-50">
                + Clientes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section className="cement-texture overflow-hidden border-y border-[oklch(0.15_0_0)] bg-gradient-to-b from-[oklch(0.22_0_0)] to-[oklch(0.25_0_0)] py-10">
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={i}
              className={`flex-shrink-0 text-2xl font-bold uppercase tracking-widest text-[oklch(0.45_0_0)] ${brand.fontClass}`}
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
        className="cement-texture bg-gradient-to-b from-[oklch(0.25_0_0)] to-[oklch(0.22_0_0)] py-20"
      >
        <div className="container">
          <div
            className={`mb-12 transition-all duration-700 ${
              isVisible.testimonials
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <span className="loc7-section-title text-lg">DEPOIMENTOS</span>
            <div className="loc7-red-line" />
            <p className="mt-3 text-sm text-[oklch(0.5_0_0)]">
              O que nossos clientes dizem sobre a gente
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials
                .slice(testimonialIndex, testimonialIndex + 3)
                .map((testimonial, i) => (
                  <div
                    key={i}
                    className={`flex min-h-[280px] flex-col justify-between rounded-lg border border-[oklch(0.15_0_0)] bg-[oklch(0.06_0_0)] p-6 transition-all duration-500 ${
                      isVisible.testimonials
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="mb-4 flex gap-1">
                      {[...Array(testimonial.stars)].map((_, j) => (
                        <span key={j} className="text-2xl" style={{ color: "#FFD700" }}>
                          ★
                        </span>
                      ))}
                    </div>

                    <p className="mb-4 text-sm italic leading-relaxed text-[oklch(0.7_0_0)]">
                      "{testimonial.text}"
                    </p>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-[oklch(0.5_0_0)]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center gap-2">
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
