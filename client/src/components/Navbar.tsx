/*
 * LOC 7 — Navbar Component
 * Versão compactada para melhor densidade visual em telas menores
 * Mantém estrutura atual: logo + menu principal + submenu categorias + mobile
 */

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Aperture,
  Camera,
  ChevronDown,
  Fan,
  Menu,
  Mic,
  Monitor,
  Move,
  Radio,
  SatelliteDish,
  Search,
  User,
  X,
  Zap,
  Tower,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type SubmenuChild = {
  name: string;
  href: string;
};

type SubmenuCategory = {
  name: string;
  icon: React.ElementType;
  href?: string;
  children?: SubmenuChild[];
};

type NavLink = {
  name: string;
  href?: string;
  disabled?: boolean;
};

const slugifyCategoryPath = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const mainSubmenuCategories: SubmenuCategory[] = [
  { name: "Câmeras", icon: Camera, href: "/catalogo/cameras" },
  { name: "Lentes", icon: Aperture, href: "/catalogo/lentes" },
  {
    name: "Iluminação",
    icon: Zap,
    children: [
      { name: "Luzes", href: "/catalogo/iluminacao" },
      { name: "Modificadores", href: "/catalogo/modificadores" },
    ],
  },
  { name: "Monitores", icon: Monitor, href: "/catalogo/monitores" },
  { name: "Transmissores", icon: Radio, href: "/catalogo/transmissores" },
  { name: "Drones", icon: Fan, href: "/catalogo/drones" },
  {
    name: "Estabilizadores",
    icon: Move,
    href: "/catalogo/estabilizadores",
  },
  { name: "Áudio", icon: Mic, href: "/catalogo/audio" },
  { name: "Live & Broadcast", icon: Radio, href: "/catalogo/live-broadcast" },
];

const mainMobileEquipmentLinks: SubmenuChild[] = [
  { name: "Câmeras", href: "/catalogo/cameras" },
  { name: "Lentes", href: "/catalogo/lentes" },
  { name: "Iluminação", href: "/catalogo/iluminacao" },
  { name: "Monitores", href: "/catalogo/monitores" },
  { name: "Transmissores", href: "/catalogo/transmissores" },
  { name: "Drones", href: "/catalogo/drones" },
  { name: "Estabilizadores", href: "/catalogo/estabilizadores" },
  { name: "Áudio", href: "/catalogo/audio" },
  { name: "Live & Broadcast", href: "/catalogo/live-broadcast" },
];

const mainCategoryNames = new Set(
  mainSubmenuCategories.map((category) => category.name)
);

type NavigationCategoryRow = {
  id: string;
  name: string;
  navbar_group?: "main" | "more" | "hidden" | null;
  menu_order?: number | null;
};

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Como alugar", href: "/#como-alugar" },
  { name: "Produção", disabled: true },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileView, setMobileView] = useState<
    "main" | "equipment" | "allCategories"
  >("main");
  const [activeAllCategoryIndex, setActiveAllCategoryIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();
  const [moreCategoryLinks, setMoreCategoryLinks] = useState<SubmenuChild[]>([]);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const allCategoriesScrollRef = useRef<HTMLDivElement | null>(null);

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    setMobileView("main");
    setActiveAllCategoryIndex(0);
  };

  const scrollToHomeTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToComoAlugar = () => {
    const section = document.getElementById("como-alugar");

    if (!section) return;

    const headerOffset = window.innerWidth >= 768 ? 230 : 92;
    const sectionTop =
      section.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(sectionTop, 0),
      behavior: "smooth",
    });
  };

  const handleHomeNavigation = (event?: React.MouseEvent) => {
    closeMobileMenu();

    if (location === "/") {
      event?.preventDefault();
      scrollToHomeTop();
      return;
    }

    window.location.href = "/";
  };

  const handleComoAlugarNavigation = (event?: React.MouseEvent) => {
    event?.preventDefault();
    closeMobileMenu();

    if (location === "/") {
      window.setTimeout(() => {
        scrollToComoAlugar();
      }, 260);
      return;
    }

    window.location.href = "/#como-alugar";
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setMobileView("main");
    setActiveAllCategoryIndex(0);
    setIsSearchOpen(false);

    if (location === "/" && window.location.hash === "#como-alugar") {
      window.setTimeout(() => {
        scrollToComoAlugar();
      }, 80);
    }
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadMoreCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, navbar_group, menu_order")
          .order("menu_order", { ascending: true, nullsFirst: false })
          .order("name", { ascending: true });

        if (error) throw error;

        const dynamicLinks = ((data as NavigationCategoryRow[]) || [])
          .filter((category) => {
            if (!category.name) return false;
            if (mainCategoryNames.has(category.name)) return false;
            return (category.navbar_group || "more") === "more";
          })
          .sort((a, b) => {
            const orderA = a.menu_order ?? Number.POSITIVE_INFINITY;
            const orderB = b.menu_order ?? Number.POSITIVE_INFINITY;

            if (orderA !== orderB) return orderA - orderB;

            return a.name.localeCompare(b.name, "pt-BR");
          })
          .map((category) => ({
            name: category.name,
            href: `/catalogo/${slugifyCategoryPath(category.name)}`,
          }));

        setMoreCategoryLinks(dynamicLinks);
      } catch (err) {
        console.error("Erro ao carregar Mais Categorias:", err);
      }
    };

    loadMoreCategories();
  }, []);

  const submenuCategories: SubmenuCategory[] = [
    ...mainSubmenuCategories,
    {
      name: "Mais Categorias",
      icon: Menu,
      children: moreCategoryLinks,
    },
  ];

  const mobileEquipmentLinks: SubmenuChild[] = [
    ...mainMobileEquipmentLinks,
    ...moreCategoryLinks,
  ];

  const handleAllCategoriesScroll = () => {
    const container = allCategoriesScrollRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-all-category-index]"),
    );

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2;
      const distance = Math.abs(containerCenter - itemCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = Number(item.dataset.allCategoryIndex || 0);
      }
    });

    setActiveAllCategoryIndex(closestIndex);
  };

  const handleSearchSubmit = async () => {
    const rawQuery = searchQuery.trim();

    const normalizedQuery = rawQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (!normalizedQuery) return;

    const categoryMap: Record<string, string> = {
      camera: "/catalogo/cameras",
      cameras: "/catalogo/cameras",
      lente: "/catalogo/lentes",
      lentes: "/catalogo/lentes",
      iluminacao: "/catalogo/iluminacao",
      luz: "/catalogo/iluminacao",
      luzes: "/catalogo/iluminacao",
      audio: "/catalogo/audio",
      microfone: "/catalogo/audio",
      microfones: "/catalogo/audio",
      mic: "/catalogo/audio",
      monitor: "/catalogo/monitores",
      monitores: "/catalogo/monitores",
      movimento: "/catalogo/movimento",
      gimbal: "/catalogo/movimento",
      estabilizador: "/catalogo/movimento",
      transmissor: "/catalogo/transmissores",
      transmissores: "/catalogo/transmissores",
      maquinaria: "/catalogo/maquinaria",
      tripe: "/catalogo/tripes-de-camera",
      tripes: "/catalogo/tripes-de-camera",
    };

    const matchedCategory = Object.entries(categoryMap).find(([key]) =>
      normalizedQuery.includes(key),
    );

    if (matchedCategory) {
      window.location.href = matchedCategory[1];
      return;
    }

    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("name, slug, category, subcategory");

      if (error) throw error;

      const matchedProducts = (products || []).filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          product.subcategory,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        return searchableText.includes(normalizedQuery);
      });

      if (matchedProducts.length === 1 && matchedProducts[0].slug) {
        const categorySlug =
          matchedProducts[0].category
            ?.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .replace(/-{2,}/g, "-") || "catalogo";

        window.location.href = `/equipamentos/${categorySlug}/${matchedProducts[0].slug}`;
        return;
      }

      if (matchedProducts.length > 1) {
        window.location.href = `/catalogo?search=${encodeURIComponent(rawQuery)}`;
        return;
      }
    } catch (err) {
      console.error("Erro busca produto:", err);
    }

    window.location.href = `/catalogo?search=${encodeURIComponent(rawQuery)}`;
  };

  return (
    <nav
      className={`relative lg:fixed lg:left-0 lg:right-0 lg:top-0 z-50 overflow-visible transition-all duration-300 ${
        isScrolled
          ? "bg-black shadow-lg shadow-black/30"
          : "bg-black shadow-[0_18px_35px_rgba(0,0,0,0.45)]"
      }`}
    >
      <div className="container md:min-h-[195px]">
        <div className="flex items-stretch justify-between overflow-visible">
          <Link
  href="/"
  onClick={handleHomeNavigation}
  aria-label="Página inicial da Loc7 Equipamentos"
  className="relative flex h-[92px] w-[150px] shrink-0 items-center overflow-visible md:h-[72px] md:w-[180px]"
>
            <img
              src="/loc7-logo-header.png"
              alt="Loc 7 Equipamentos"
             className="absolute left-[-6px] top-[56%] origin-left -translate-y-1/2 scale-[1.25] transition-transform duration-300 md:left-[-12px] md:top-[108%] md:scale-[1.35]"
            />
          </Link>

          <div className="relative flex flex-1 flex-col">
            <div className="flex h-20 flex-1 items-center justify-center md:h-[82px] md:translate-y-[32px]">
              <div className="relative hidden flex-1 items-center justify-center gap-10 overflow-visible md:flex lg:gap-12">
                {navLinks.map((link) =>
                  link.disabled ? (
                    <div
                      key={link.name}
                      className="group relative cursor-default text-sm font-medium text-white/62 transition hover:text-white/82"
                    >
                      <span>{link.name}</span>

                      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white/60 opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
                        Em breve
                      </span>
                    </div>
                  ) : (
                    <Link
                      key={link.name}
                      href={link.href || "/"}
                      onClick={(event) => {
                        if (link.name === "Home") {
                          handleHomeNavigation(event);
                          return;
                        }

                        if (link.name === "Como alugar") {
                          handleComoAlugarNavigation(event);
                        }
                      }}
                      className={`text-sm font-medium text-white/72 transition hover:text-white ${
                        location === link.href ? "text-white/88" : ""
                      }`}
                    >
                      {link.name}
                    </Link>
                  ),
                )}

                <div
                  ref={searchRef}
                  className="ml-6 hidden items-center md:flex"
                >
                  {isSearchOpen ? (
                    <div className="flex items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md transition-all duration-300">
                      <Search className="h-4 w-4 text-white/45" />

                      <input
                        type="text"
                        placeholder="Buscar"
                        autoFocus
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleSearchSubmit();
                          }
                        }}
                        className="ml-2 w-[180px] bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="group flex items-center text-white/68 transition-all duration-200 hover:text-white"
                      aria-label="Abrir busca"
                    >
                      <Search className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    </button>
                  )}
                </div>
              </div>

              <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 md:flex">
                <Link
  href="/admin-panel"
  aria-label="Área administrativa"
>
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 transition hover:border-white/25 hover:bg-white/5">
                    <User className="h-4 w-4 text-white/45 hover:text-white/70" />
                  </div>
                </Link>
              </div>

              <div className="absolute right-[-6px] top-1/2 flex -translate-y-1/2 items-center gap-3 md:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen((prev) => !prev);
                    setIsMobileOpen(false);
                    setMobileView("main");
                    setActiveAllCategoryIndex(0);
                  }}
                  className="flex h-10 w-10 items-center justify-center text-white/75 transition hover:text-white active:text-white"
                  aria-label={isSearchOpen ? "Fechar busca" : "Abrir busca"}
                >
                  {isSearchOpen ? <X size={24} /> : <Search size={22} />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setIsMobileOpen((prev) => !prev);
                  }}
                  className="flex h-11 w-11 items-center justify-center text-white"
                  aria-label="Abrir menu"
                >
                  {isMobileOpen ? <X size={34} /> : <Menu size={34} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isSearchOpen && !isMobileOpen && (
          <div className="px-3 pb-3 md:hidden">
            <div className="flex h-10 items-center rounded-full border border-white/15 bg-white/[0.055] px-4 backdrop-blur-md">
              <Search className="h-4 w-4 text-white/45" />

              <input
                type="text"
                placeholder="Buscar equipamento, marca ou categoria"
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                className="ml-3 w-full bg-transparent text-[14px] text-white placeholder:text-white/35 focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="hidden w-full pt-[54px] pb-5 md:block">
          <div className="mx-auto w-full max-w-[1240px] px-6">
            <div className="flex w-full items-start justify-center gap-4 xl:gap-5">
              {submenuCategories.map((cat) => {
                const Icon = cat.icon;
                const hasChildren = !!cat.children?.length;
                const dropdownIsLarge = (cat.children?.length || 0) > 4;
                const categoryButtonWidth =
                  cat.name === "Live & Broadcast"
                    ? "w-[132px]"
                    : cat.name === "Mais Categorias"
                      ? "w-[96px]"
                      : "w-[80px]";

                return (
                  <div key={cat.name} className="relative group">
                    {hasChildren ? (
                      <button
                        type="button"
                        className={`flex ${categoryButtonWidth} shrink-0 flex-col items-center justify-start gap-2 rounded-md py-1 text-center text-white/86 transition-transform duration-200 group-hover:scale-[1.035] group-hover:text-white`}
                      >
                        <Icon className="h-[19px] w-[19px] shrink-0 text-white/82 transition-colors duration-200 group-hover:text-white" />

                        <span className="block text-[14px] font-medium leading-tight tracking-[0.025em] text-white/92 transition-colors duration-200 group-hover:text-white">
                          {cat.name}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = cat.href || "/catalogo";
                        }}
                        className={`flex ${categoryButtonWidth} shrink-0 flex-col items-center justify-start gap-2 rounded-md py-1 text-center text-white/86 transition-transform duration-200 hover:scale-[1.035] hover:text-white`}
                      >
                        <Icon className="h-[19px] w-[19px] shrink-0 text-white/82 transition-colors duration-200 group-hover:text-white" />

                        <span className="block text-[14px] font-medium leading-tight tracking-[0.025em] text-white/92 transition-colors duration-200 group-hover:text-white">
                          {cat.name}
                        </span>
                      </button>
                    )}

                    {hasChildren && (
                      <div
                       className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 pointer-events-none translate-y-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0"
                      >
                        {cat.name === "Mais Categorias" || cat.name === "Iluminação" ? (
                          <div className="relative w-[240px] bg-[#050505] px-3 py-4 shadow-[0_18px_45px_rgba(0,0,0,0.42)] backdrop-blur-md">
                            <div className="mb-3 px-3">
                              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
                                {cat.name}
                              </span>
                            </div>

                            <div
                              className={`space-y-1 ${
                                cat.name === "Mais Categorias"
                                  ? "max-h-[390px] overflow-y-auto overscroll-contain pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                  : ""
                              }`}
                            >
                              {cat.children?.map((child) => (
                                <button
                                  key={child.name}
                                  type="button"
                                  onClick={() => {
                                    window.location.href = child.href;
                                  }}
                                  className="block w-full rounded-md px-3 py-3 text-center text-[14px] font-semibold tracking-[0.015em] text-white/90 transform-gpu transition-all duration-200 ease-out hover:scale-[1.035] hover:bg-white/[0.05] hover:text-white"
                                >
                                  {child.name}
                                </button>
                              ))}
                            </div>

                            {cat.name === "Mais Categorias" && (
                              <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-white/30 transition-colors duration-200 group-hover:text-white/45">
                                <ChevronDown size={15} strokeWidth={2} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className={`rounded-xl border border-white/10 bg-black/95 p-2 shadow-2xl backdrop-blur-md ${
                              dropdownIsLarge
                                ? "grid min-w-[360px] grid-cols-2 gap-1"
                                : "min-w-[210px]"
                            }`}
                          >
                            {cat.children?.map((child) => (
                              <button
                                key={child.name}
                                type="button"
                                onClick={() => {
                                  window.location.href = child.href;
                                }}
                                className="block w-full rounded-md px-4 py-2.5 text-center text-[12px] font-medium tracking-[0.06em] text-white/75 transition hover:bg-white/5 hover:text-white"
                              >
                                {child.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {isMobileOpen && (
          <div className="border-t border-white/10 bg-black/95 md:hidden">
            {mobileView === "main" && (
              <div className="px-6 pb-8 pt-5">
                <div className="mb-6">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    Menu LOC7
                  </p>
                  <span className="mt-2 block h-[2px] w-10 bg-red-600" />
                </div>

                <button
                  type="button"
                  onClick={handleHomeNavigation}
                  className="group block w-full py-3.5 text-left"
                >
                  <span className="block text-[18px] font-medium tracking-[0.01em] text-white/85 transition duration-200 group-hover:text-white group-active:text-white">
                    Home
                  </span>
                  <span className="mt-2 block h-px w-8 bg-white/10 transition-all duration-200 group-hover:w-14 group-hover:bg-white/35 group-active:w-14 group-active:bg-white/35" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileView("equipment");
                  }}
                  className="group block w-full py-3.5 text-left"
                >
                  <span className="block text-[18px] font-medium tracking-[0.01em] text-white/85 transition duration-200 group-hover:text-white group-active:text-white">
                    Equipamentos
                  </span>
                  <span className="mt-2 block h-px w-8 bg-white/10 transition-all duration-200 group-hover:w-14 group-hover:bg-white/35 group-active:w-14 group-active:bg-white/35" />
                </button>

                <button
                  type="button"
                  onClick={handleComoAlugarNavigation}
                  className="group block w-full py-3.5 text-left"
                >
                  <span className="block text-[18px] font-medium tracking-[0.01em] text-white/85 transition duration-200 group-hover:text-white group-active:text-white">
                    Como alugar
                  </span>
                  <span className="mt-2 block h-px w-8 bg-white/10 transition-all duration-200 group-hover:w-14 group-hover:bg-white/35 group-active:w-14 group-active:bg-white/35" />
                </button>

                <div className="block w-full py-3.5 text-left">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="block text-[18px] font-medium tracking-[0.01em] text-white/45">
                      Produção
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      Em breve
                    </span>
                  </div>
                  <span className="mt-2 block h-px w-8 bg-white/10" />
                </div>
              </div>
            )}

            {mobileView === "equipment" && (
              <div className="px-6 pb-8 pt-5">
                <button
                  type="button"
                  onClick={() => setMobileView("main")}
                  className="group mb-7 block text-left"
                >
                  <span className="block text-[13px] font-semibold uppercase tracking-[0.22em] text-white/70 transition duration-200 group-hover:text-white group-active:text-white">
                    Menu
                  </span>
                  <span className="mt-2 block h-[2px] w-7 bg-red-600" />
                </button>

                <div className="space-y-1">
                  {[
                    { name: "Câmeras", href: "/catalogo/cameras" },
                    { name: "Lentes", href: "/catalogo/lentes" },
                    { name: "Iluminação", href: "/catalogo/iluminacao" },
                    { name: "Áudio", href: "/catalogo/audio" },
                    { name: "Movimento", href: "/catalogo/movimento" },
                  ].map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        window.location.href = item.href;
                      }}
                      className="group block w-full py-3 text-left"
                    >
                      <span className="block text-[18px] font-medium tracking-[0.01em] text-white/82 transition duration-200 group-hover:text-white group-active:text-white">
                        {item.name}
                      </span>
                      <span className="mt-2 block h-px w-7 bg-white/10 transition-all duration-200 group-hover:w-14 group-hover:bg-white/35 group-active:w-14 group-active:bg-white/35" />
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileView("allCategories");
                      setActiveAllCategoryIndex(0);
                    }}
                    className="group block w-full pt-5 pb-3 text-left"
                  >
                    <span className="block text-[16px] font-medium tracking-[0.01em] text-white/62 transition duration-200 group-hover:text-white group-active:text-white">
                      Todas as categorias +
                    </span>
                    <span className="mt-2 block h-px w-7 bg-white/10 transition-all duration-200 group-hover:w-14 group-hover:bg-white/35 group-active:w-14 group-active:bg-white/35" />
                  </button>
                </div>
              </div>
            )}

            {mobileView === "allCategories" && (
              <div className="px-6 pb-7 pt-5">
                <button
                  type="button"
                  onClick={handleHomeNavigation}
                  className="group mb-5 block text-left"
                >
                  <span className="block text-[12px] font-semibold uppercase tracking-[0.22em] text-white/55 transition duration-200 group-hover:text-white group-active:text-white">
                    Home
                  </span>
                </button>

                <div className="mb-4">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/72">
                    Todas as categorias
                  </p>
                  <span className="mt-2 block h-[2px] w-24 bg-red-600" />
                </div>

                <div
                  ref={allCategoriesScrollRef}
                  onScroll={handleAllCategoriesScroll}
                  className="max-h-[58vh] overflow-y-auto overscroll-contain pr-1 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [touch-action:pan-y] [&::-webkit-scrollbar]:hidden"
                >
                  <div className="space-y-1 pb-8">
                    {mobileEquipmentLinks.map((item, index) => {
                      const isActive = index === activeAllCategoryIndex;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          data-all-category-index={index}
                          onClick={() => {
                            window.location.href = item.href;
                          }}
                          className="group block w-full py-2.5 text-left"
                        >
                          <span
                            className={`block font-medium tracking-[0.01em] transition duration-200 group-hover:text-white group-active:text-white ${
                              isActive
                                ? "text-[20px] text-white"
                                : "text-[17px] text-white/58"
                            }`}
                          >
                            {item.name}
                          </span>
                          <span
                            className={`mt-2 block h-px transition-all duration-200 ${
                              isActive
                                ? "w-12 bg-white/38"
                                : "w-7 bg-white/10 group-hover:w-12 group-hover:bg-white/30 group-active:w-12 group-active:bg-white/30"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
