/*
 * LOC 7 — Navbar Component
 * Versão compactada para melhor densidade visual em telas menores
 * Mantém estrutura atual: logo + menu principal + submenu categorias + mobile
 */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Camera,
  Aperture,
  Zap,
  Mic,
  Monitor,
  Move,
  Radio,
  Flag,
  Fan,
  Cog,
  User,
  Search,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// LEGADO — antigo menu horizontal com categorias + ícones.
// Mantido temporariamente como referência visual.
// Não utilizado no fluxo atual (Equipamentos → dropdown).

const submenuCategories = [
  { name: "Câmeras", icon: Camera, href: "/catalogo/cameras" },
  { name: "Lentes", icon: Aperture, href: "/catalogo/lentes" },
  { name: "Iluminação", icon: Zap, href: "/catalogo/iluminacao" },
  { name: "Monitores", icon: Monitor, href: "/catalogo/monitores" },
  { name: "Transmissores", icon: Radio, href: "/catalogo/transmissores" },
  { name: "Drones", icon: Fan, href: "/catalogo/drones" },
  { name: "Estabilizadores", icon: Move, href: "/catalogo/estabilizadores" },
  { name: "Áudio", icon: Mic, href: "/catalogo/audio" },
  { name: "Comunicadores", icon: Radio, href: "/catalogo/comunicadores" },
  { name: "Maquinária", icon: Flag, href: "/catalogo/maquinaria" },
  { name: "Acessórios", icon: Cog, href: "/catalogo" },
];

const fallbackCategories = [
  { name: "ÁUDIO", href: "/catalogo/audio" },
  { name: "CÂMERAS", href: "/catalogo/cameras" },
  { name: "COMUNICADORES", href: "/catalogo/comunicadores" },
  { name: "DRONES", href: "/catalogo/drones" },
  { name: "ESTABILIZADORES", href: "/catalogo/estabilizadores" },
  { name: "FILTROS", href: "/catalogo/filtros" },
  { name: "FOLLOW FOCUS", href: "/catalogo/follow-focus" },
  { name: "ILUMINAÇÃO", href: "/catalogo/iluminacao" },
  { name: "LENTES", href: "/catalogo/lentes" },
  { name: "MAQUINÁRIA", href: "/catalogo/maquinaria" },
  { name: "MATTEBOX", href: "/catalogo/mattebox" },
  { name: "MONITORES", href: "/catalogo/monitores" },
  { name: "MOVIMENTO", href: "/catalogo/movimento" },
  { name: "SWITCHERS", href: "/catalogo/switchers" },
  { name: "TELEPROMPTER", href: "/catalogo/teleprompter" },
  { name: "TRANSMISSORES", href: "/catalogo/transmissores" },
  { name: "TRIPÉS DE CÂMERA", href: "/catalogo/tripes" },
  { name: "SUPORTE DE CÂMERA", href: "/catalogo/suporte-de-camera" },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Como alugar", href: "/catalogo", hasDropdown: true },
  { name: "Produção", href: "/producao" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [location] = useLocation();

  const searchRef = useRef<HTMLDivElement | null>(null);

  const [dropdownCategories, setDropdownCategories] = useState<
    Array<{ name: string; href: string }>
  >(fallbackCategories);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const handleMobileHomeReload = () => {
    const isMobile = window.innerWidth < 768;

    if (isMobile && location === "/") {
      window.location.reload();
      return;
    }

    window.location.href = "/";
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const { data, error } = await supabase
          .from("categories")
          .select("name, slug")
          .order("name");

        if (error) {
          console.warn("[DEBUG] Erro ao carregar categorias:", error);
          setDropdownCategories(fallbackCategories);
        } else if (data && data.length > 0) {
          const categories = data
            .filter(
              (cat: { name?: string | null; slug?: string | null }) =>
                !!cat.name?.trim() && !!cat.slug?.trim()
            )
            .map((cat: { name: string; slug: string }) => ({
              name: cat.name.toUpperCase(),
              href: `/catalogo/${cat.slug}`,
            }));

          setDropdownCategories(
            categories.length > 0 ? categories : fallbackCategories
          );
        } else {
          setDropdownCategories(fallbackCategories);
        }
      } catch (err) {
        console.error("[DEBUG] Erro ao carregar categorias:", err);
        setDropdownCategories(fallbackCategories);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();

    const subscription = supabase
      .channel("categories-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => {
          loadCategories();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsCatalogOpen(false);
    setIsSearchOpen(false);
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
      tripe: "/catalogo/maquinaria",
      tripes: "/catalogo/maquinaria",
    };

    const matchedCategory = Object.entries(categoryMap).find(([key]) =>
      normalizedQuery.includes(key)
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
      className={`relative lg:fixed lg:top-0 lg:left-0 lg:right-0 z-50 overflow-visible transition-all duration-300 ${
        isScrolled ? "bg-black shadow-lg shadow-black/30" : "bg-black"
      }`}
    >
      <div className="container md:min-h-[195px]">
        <div className="flex items-stretch justify-between overflow-visible">
          <Link
            href="/"
            onClick={(event) => {
              const isMobile = window.innerWidth < 768;

              if (isMobile) {
                event.preventDefault();
                handleMobileHomeReload();
              }
            }}
            className="relative flex items-center group shrink-0 w-[150px] md:w-[180px] h-[92px] md:h-[72px] overflow-visible"
          >
            <img
              src="/loc7-logo-header.png"
              alt="Loc 7 Equipamentos"
              className="absolute left-[-6px] md:left-[-12px] top-[62%] md:top-[108%] -translate-y-1/2 scale-[1.25] md:scale-[1.35] origin-left transition-transform duration-300 group-hover:scale-[1.28] md:group-hover:scale-[1.38]"
            />
          </Link>

          <div className="flex flex-col flex-1 relative">
            <div className="flex items-center justify-center h-20 md:h-[82px] flex-1 md:translate-y-[48px]">
              <div className="hidden md:flex items-center gap-10 lg:gap-12 justify-center flex-1 relative overflow-visible">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="relative group whitespace-nowrap overflow-visible pointer-events-auto"
                    onMouseEnter={() =>
                      link.hasDropdown && setIsCatalogOpen(true)
                    }
                    onMouseLeave={() =>
                      link.hasDropdown && setIsCatalogOpen(false)
                    }
                  >
                    {link.hasDropdown ? (
                      <button
                        className={`flex items-center gap-1 text-sm font-medium text-white hover:text-gray-300 transition ${
                          location.startsWith("/catalogo")
                            ? "text-gray-300"
                            : ""
                        }`}
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className={`text-sm font-medium text-white hover:text-gray-300 transition ${
                          location === link.href ? "text-gray-300" : ""
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}

                    {link.hasDropdown && isCatalogOpen && (
                      <div className="absolute left-1/2 top-full -translate-x-1/2 mt-0 max-h-[58vh] w-[280px] overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-black/95 py-2 shadow-2xl backdrop-blur-md z-[9999] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex items-center justify-center gap-1 py-1 text-white/35">
                          <ChevronDown className="w-3 h-3 animate-bounce" />
                        </div>

                        {loadingCategories ? (
                          <div className="px-4 py-3 text-white text-sm text-center">
                            Carregando...
                          </div>
                        ) : (
                          dropdownCategories.map((cat) => (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              className="block px-4 py-2 text-center text-xs font-medium tracking-wide text-white/70 transition-all duration-150 hover:scale-[1.05] hover:text-white"
                            >
                              {cat.name}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div ref={searchRef} className="ml-6 hidden items-center md:flex">
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
                      className="group flex items-center text-white/70 transition-all duration-200 hover:text-white"
                      aria-label="Abrir busca"
                    >
                      <Search className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    </button>
                  )}
                </div>
              </div>

              <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 md:flex">
                <Link href="/admin-panel">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 hover:border-white/25 hover:bg-white/5 transition cursor-pointer">
                    <User className="w-4 h-4 text-white/45 hover:text-white/70" />
                  </div>
                </Link>
              </div>

              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden p-2 text-white translate-x-6 translate-y-[10px]"
                aria-label="Abrir menu"
              >
                {isMobileOpen ? <X size={34} /> : <Menu size={34} />}
              </button>
            </div>
          </div>
        </div>

     <div className="hidden md:block w-full pt-[76px] pb-8">
  <div className="mx-auto w-full max-w-[1240px] px-6">
    <div className="flex w-full items-start justify-center gap-4 xl:gap-5">
      {submenuCategories.map((cat) => {
        const Icon = cat.icon;

        return (
          <Link
            key={cat.name}
            href={cat.href}
            className="group flex w-[88px] shrink-0 flex-col items-center justify-start gap-2 rounded-md py-1 text-center text-white/78 transition-transform duration-200 hover:scale-[1.035] hover:text-white"
          >
            <Icon className="h-[19px] w-[19px] shrink-0 text-white/75 transition-colors duration-200 group-hover:text-white" />

           <span className="block text-[14px] font-medium leading-tight tracking-[0.025em] text-white/90 transition-colors duration-200 group-hover:text-white">
              {cat.name}
            </span>
          </Link>
        );
      })}
    </div>
  </div>
</div>
        
        {isMobileOpen && (
          <div className="md:hidden bg-gray-950 border-t border-gray-800">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                        className="w-full text-left px-4 py-3 text-white hover:bg-gray-900 transition text-sm font-medium"
                      >
                        {link.name === "Como alugar" ? "Equipamentos" : link.name}
                      </button>

                      {isCatalogOpen && (
                        <div className="bg-black pl-4">
                          {dropdownCategories.map((cat) => (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              className="block px-4 py-2 text-xs font-medium tracking-wide text-white/80 hover:text-white transition-all duration-200 hover:scale-[1.03]"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={(event) => {
                        if (link.href === "/") {
                          event.preventDefault();
                          handleMobileHomeReload();
                        }
                      }}
                      className="block px-4 py-3 text-white hover:bg-gray-900 transition text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
