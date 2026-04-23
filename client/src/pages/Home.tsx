/*
 * LOC 7 — Home Page
 * Refino visual da seção Destaques:
 * - 4 colunas no desktop
 * - cards menores
 * - menos padding
 * - maior densidade
 * - hover apenas com troca de imagem
 */

import { useEffect, useMemo, useState } from "react";
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

type CategoryItem = {
  id?: string | number;
  name: string;
  slug?: string;
};

const heroSlides = [
  {
    text: "Equipamentos Cine e Broadcast",
    subtitle: "Câmeras, lentes e iluminação profissional",
    img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    text: "Locação Premium para Produções Reais",
    subtitle: "Equipamentos confiáveis para sets exigentes",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
  },
  {
    text: "Soluções para Conteúdo, Publicidade e Broadcast",
    subtitle: "Do creator avançado à grande produtora",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
  },
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatPrice(price?: number | null) {
  if (price == null) return null;

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getProductHref(product: Product) {
  const slug = (product as any).slug;
  if (slug && typeof slug === "string") {
    return `/equipamentos/${slug}`;
  }

  return `/equipamentos/${slugify(product.name)}`;
}

function getProductImages(product: Product): string[] {
  const rawImages = (product as any)?.images;
  const imageUrl = (product as any)?.image_url;

  const imagesFromArray = Array.isArray(rawImages)
    ? rawImages.filter((img) => typeof img === "string" && img.trim().length > 0)
    : [];

  const finalImages = [...imagesFromArray];

  if (typeof imageUrl === "string" && imageUrl.trim()) {
    if (!finalImages.includes(imageUrl)) {
      finalImages.unshift(imageUrl);
    }
  }

  return finalImages.filter(Boolean);
}

function FeaturedProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const images = useMemo(() => getProductImages(product), [product]);

  const primaryImage = images[0] || "";
  const secondaryImage = images[1] || images[0] || "";
  const imageToShow = hovered && secondaryImage ? secondaryImage : primaryImage;

  return (
    <Link href={getProductHref(product)}>
      <a
        className="group block h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <article className="h-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.10)]">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#f4f4f4]">
            {imageToShow ? (
              <img
                src={imageToShow}
                alt={product.name}
                className="h-full w-full object-contain p-3 sm:p-4"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                Sem imagem
              </div>
            )}

            {(product as any)?.badge && (
              <span className="absolute left-2.5 top-2.5 rounded-full border border-black/10 bg-white/92 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-800 backdrop-blur-sm">
                {(product as any).badge}
              </span>
            )}
          </div>

          <div className="space-y-2 px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
            <div className="space-y-1">
              {(product as any)?.category && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  {(product as any).category}
                </p>
              )}

              <h3 className="line-clamp-2 min-h-[2.6rem] text-[13px] font-semibold leading-[1.3] text-neutral-950 sm:text-[14px]">
                {product.name}
              </h3>
            </div>

            <div className="flex items-end justify-between gap-2 pt-0.5">
              <div className="min-h-[1.2rem]">
                {typeof (product as any)?.price === "number" && (
                  <p className="text-[13px] font-bold text-neutral-950 sm:text-[14px]">
                    R$ {formatPrice((product as any).price)}
                  </p>
                )}
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 transition-colors group-hover:text-black">
                Ver item
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </article>
      </a>
    </Link>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadFeaturedProducts();
    loadCategories();
  }, []);

  async function loadFeaturedProducts() {
    try {
      setLoadingFeatured(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .limit(8);

      if (error) {
        console.error("Erro ao carregar destaques:", error);
        setFeaturedProducts([]);
        return;
      }

      setFeaturedProducts((data || []) as Product[]);
    } catch (error) {
      console.error("Erro inesperado ao carregar destaques:", error);
      setFeaturedProducts([]);
    } finally {
      setLoadingFeatured(false);
    }
  }

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Erro ao carregar categorias:", error);
        setCategories([]);
        return;
      }

      setCategories((data || []) as CategoryItem[]);
    } catch (error) {
      console.error("Erro inesperado ao carregar categorias:", error);
      setCategories([]);
    }
  }

  const currentHero = heroSlides[currentSlide];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* HERO */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <img
            src={currentHero.img}
            alt={currentHero.text}
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" />
              São Paulo • Locação Audiovisual Profissional
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              {currentHero.text}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base lg:text-lg">
              {currentHero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogo">
                <a className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200">
                  Ver catálogo
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Link>

              <Link href="/producao">
                <a className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15">
                  <Play className="h-4 w-4" />
                  Soluções em produção
                </a>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                aria-label="Slide anterior"
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === 0 ? heroSlides.length - 1 : prev - 1
                  )
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                aria-label="Próximo slide"
                onClick={() =>
                  setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="ml-2 flex items-center gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Ir para slide ${index + 1}`}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentSlide
                        ? "w-8 bg-white"
                        : "w-2 bg-white/35 hover:bg-white/55"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="border-b border-black/6 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Navegação rápida
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-neutral-950">
                Categorias
              </h2>
            </div>

            <Link href="/catalogo">
              <a className="hidden text-sm font-semibold text-neutral-700 transition hover:text-black sm:inline-flex sm:items-center sm:gap-1">
                Ver catálogo completo
                <ArrowRight className="h-4 w-4" />
              </a>
            </Link>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const href = `/catalogo/${category.slug || slugify(category.name)}`;

              return (
                <Link key={category.id ?? category.name} href={href}>
                  <a className="shrink-0 rounded-full border border-black/10 bg-[#f7f7f7] px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-black/20 hover:bg-[#efefef]">
                    {category.name}
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="mb-6 flex items-end justify-between gap-4 sm:mb-7">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700 shadow-sm">
                <Star className="h-3.5 w-3.5" />
                Destaques
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-3xl">
                Equipamentos em evidência
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
                Seleção rápida dos itens mais relevantes para produções que exigem agilidade, confiabilidade e padrão profissional.
              </p>
            </div>

            <Link href="/catalogo">
              <a className="hidden items-center gap-1 text-sm font-semibold text-neutral-700 transition hover:text-black md:inline-flex">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </a>
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_28px_rgba(0,0,0,0.04)]"
                >
                  <div className="aspect-[4/3] animate-pulse bg-neutral-100" />
                  <div className="space-y-2 px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
                    <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
                    <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
                    <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                {featuredProducts.slice(0, 8).map((product) => (
                  <FeaturedProductCard
                    key={(product as any).id ?? product.name}
                    product={product}
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-center md:hidden">
                <Link href="/catalogo">
                  <a className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50">
                    Ver catálogo completo
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/10 bg-white px-6 py-10 text-center">
              <p className="text-sm text-neutral-600">
                Nenhum produto em destaque encontrado no momento.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-8 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Estrutura profissional
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-3xl">
              O que sustenta uma locação confiável
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-black/8 bg-[#fafafa] p-5">
              <Zap className="h-5 w-5 text-neutral-900" />
              <h3 className="mt-4 text-base font-semibold text-neutral-950">
                Agilidade real
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Resposta rápida, operação objetiva e fluxo pensado para quem precisa produzir sem perder tempo.
              </p>
            </div>

            <div className="rounded-2xl border border-black/8 bg-[#fafafa] p-5">
              <Star className="h-5 w-5 text-neutral-900" />
              <h3 className="mt-4 text-base font-semibold text-neutral-950">
                Curadoria de equipamento
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Equipamentos selecionados para atender sets, publicidade, conteúdo, transmissão e operação técnica exigente.
              </p>
            </div>

            <div className="rounded-2xl border border-black/8 bg-[#fafafa] p-5">
              <MapPin className="h-5 w-5 text-neutral-900" />
              <h3 className="mt-4 text-base font-semibold text-neutral-950">
                Base em São Paulo
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Atendimento próximo ao mercado audiovisual, com linguagem técnica e foco em solução prática para produção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Atendimento consultivo
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Precisa montar a solução ideal para a sua produção?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/72 sm:text-base">
              Fale com a Loc7 para alinhar equipamento, operação e estrutura conforme a demanda do seu job.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/orcamento">
                <a className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200">
                  Solicitar orçamento
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Link>

              <Link href="/catalogo">
                <a className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/12">
                  Explorar catálogo
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
