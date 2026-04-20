/*
 * LOC 7 — Navbar Component
 * Premium, elegant, dark aesthetic
 * Preto dominante, branco limpo, identidade Loc7
 */

import { useState, useEffect } from "react";
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
  Clapperboard,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const submenuCategories = [
  { name: "Câmeras", icon: Camera, href: "/catalogo/cameras" },
  { name: "Lentes", icon: Aperture, href: "/catalogo/lentes" },
  { name: "Iluminação", icon: Zap, href: "/catalogo/iluminacao" },
  { name: "Áudio", icon: Mic, href: "/catalogo/audio" },
  { name: "Monitores", icon: Monitor, href: "/catalogo/monitores" },
  { name: "Movimento", icon: Move, href: "/catalogo/movimento" },
  { name: "Transmissores", icon: Radio, href: "/catalogo/transmissores" },
  { name: "Maquinária", icon: Clapperboard, href: "/catalogo/maquinaria" },
];

const fallbackCategories = [
  { name: "ÁUDIO", href: "/catalogo/audio" },
  { name: "CÂMERAS", href: "/catalogo/cameras" },
  { name: "COMPUTADORES E TABLETS", href: "/catalogo/computadores" },
  { name: "COMUNICADORES", href: "/catalogo/comunicadores" },
  { name: "CONVERSORES", href: "/catalogo/conversores" },
  { name: "ESTABILIZADORES", href: "/catalogo/estabilizadores" },
  { name: "FILTROS", href: "/catalogo/filtros" },
  { name: "FOLLOW FOCUS", href: "/catalogo/follow-focus" },
  { name: "GRAVADORES", href: "/catalogo/gravadores" },
  { name: "HDS E CARTÕES DE MEMÓRIA", href: "/catalogo/hds-cartoes" },
  { name: "ILUMINAÇÃO", href: "/catalogo/iluminacao" },
  { name: "LENTES", href: "/catalogo/lentes" },
  { name: "MAQUINÁRIA", href: "/catalogo/maquinaria" },
  { name: "MATTEBOX", href: "/catalogo/mattebox" },
  { name: "MONITORES", href: "/catalogo/monitores" },
  { name: "MOVIMENTO", href: "/catalogo/movimento" },
  { name: "SWITCHES", href: "/catalogo/switches" },
  { name: "TELE-PROMPTER", href: "/catalogo/tele-prompter" },
  { name: "TRANSMISSORES", href: "/catalogo/transmissores" },
  { name: "TRIPÉS", href: "/catalogo/tripes" },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Locação", href: "/catalogo", hasDropdown: true },
  { name: "Produção", href: "/producao" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [location] = useLocation();
  const [dropdownCategories, setDropdownCategories] = useState<
    Array<{ name: string; href: string }>
  >(fallbackCategories);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const { data, error } = await supabase
          .from("categories")
          .select("name")
          .order("name");

        if (error) {
          console.warn("[DEBUG] Erro ao carregar categorias:", error);
          setDropdownCategories(fallbackCategories);
        } else if (data && data.length > 0) {
          const categories = data.map((cat: any) => ({
            name: String(cat.name).toUpperCase(),
            href: `/catalogo/${String(cat.name)
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/\s+/g, "-")}`,
          }));
          setDropdownCategories(categories);
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
  }, [location]);

  const isActiveMainLink = (href: string) => {
    if (href === "/") return location === "/";
    return location === href || location.startsWith(`${href}/`);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-[0_10px_30px_rgba(0,0,0,0.32)]" : "bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Linha principal */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center min-h-[110px] md:min-h-[128px] gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="Loc7 Equipamentos"
              className="h-20 sm:h-24 md:h-28 lg:h-[120px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Menu principal desktop */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center gap-10 lg:gap-14">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setIsCatalogOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setIsCatalogOpen(false)}
                >
                  {link.hasDropdown ? (
                    <button
                      type="button"
                      className={`text-[15px] font-semibold tracking-[0.04em] leading-none transition-colors ${
                        location.startsWith("/catalogo")
                          ? "text-white"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-[15px] font-semibold tracking-[0.04em] leading-none transition-colors ${
                        isActiveMainLink(link.href)
                          ? "text-white"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}

                  {link.hasDropdown && isCatalogOpen && (
                    <div className="absolute left-1/2 top-full z-50 mt-4 -translate-x-1/2 min-w-[280px] rounded-xl bg-[#0b0b0b] p-2 shadow-2xl">
                      {loadingCategories ? (
                        <div className="px-4 py-3 text-sm text-white/70 text-center">
                          Carregando...
                        </div>
                      ) : (
                        dropdownCategories.map((cat) => (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            className="block rounded-lg px-4 py-2.5 text-[13px] font-medium tracking-wide text-white/82 transition hover:bg-white/5 hover:text-white"
                          >
                            {cat.name}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile button */}
          <div className="flex justify-end md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="inline-flex items-center justify-center w-10 h-10 text-white/90 hover:text-white transition"
              aria-label={isMobileOpen ? "Fechar menu" : "Abrir menu"}
              type="button"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Submenu desktop centralizado */}
        <div className="hidden md:block border-t border-white/[0.04]">
          <div className="min-h-[54px] flex items-center justify-center">
            <div className="flex items-center justify-center gap-4 lg:gap-6 flex-wrap py-3">
              {submenuCategories.map((cat) => {
                const Icon = cat.icon;
                const active = location === cat.href;

                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className={`inline-flex items-center gap-2 transition-colors whitespace-nowrap ${
                      active ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Icon className="w-[15px] h-[15px]" />
                    <span className="text-[11px] font-medium tracking-[0.12em] uppercase">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-white/[0.04] bg-black">
            <div className="py-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-white hover:bg-white/5 transition"
                        type="button"
                      >
                        {link.name}
                      </button>

                      {isCatalogOpen && (
                        <div className="bg-[#070707] border-t border-white/[0.04] border-b border-white/[0.04]">
                          {loadingCategories ? (
                            <div className="px-6 py-3 text-xs text-white/70">
                              Carregando...
                            </div>
                          ) : (
                            dropdownCategories.map((cat) => (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                className="block px-6 py-2.5 text-xs tracking-wide text-white/80 hover:text-white hover:bg-white/5 transition"
                              >
                                {cat.name}
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className="block px-4 py-3 text-sm font-medium text-white hover:bg-white/5 transition"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}

              <div className="border-t border-white/[0.04] mt-2 pt-2 pb-2">
                {submenuCategories.map((cat) => {
                  const Icon = cat.icon;

                  return (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-white/82 hover:text-white hover:bg-white/5 transition"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
