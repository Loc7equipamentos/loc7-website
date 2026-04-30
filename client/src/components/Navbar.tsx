/*
 * LOC 7 — Navbar Component
 * Header premium com logo maior, sem linhas visuais
 * Mantém estrutura atual: logo + menu principal + submenu categorias + mobile
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
          const categories = data.map((cat: { name: string }) => ({
            name: cat.name.toUpperCase(),
            href: `/catalogo/${cat.name.toLowerCase().replace(/\s+/g, "-")}`,
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

  return (
    <nav
      className={`sticky top-0 z-50 bg-black transition-all duration-300 ${
        isScrolled ? "shadow-lg shadow-black/30" : ""
      }`}
    >
      <div className="container">
        <div className="flex items-stretch justify-between">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center py-3 pr-8">
            <img
              src="/loc7-logo-header.png"
              alt="Loc7 Câmeras & Acessórios"
              className="h-[64px] w-auto object-contain opacity-95 transition-opacity duration-200 group-hover:opacity-100 md:h-[82px]"
            />
          </Link>

          {/* Navegação desktop / mobile trigger */}
          <div className="relative flex flex-1 flex-col">
            <div className="flex h-[54px] flex-1 items-center justify-center md:h-[58px]">
              <div className="relative hidden flex-1 items-center justify-center gap-10 overflow-visible md:flex lg:gap-12">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="group pointer-events-auto relative overflow-visible whitespace-nowrap"
                    onMouseEnter={() => link.hasDropdown && setIsCatalogOpen(true)}
                    onMouseLeave={() => link.hasDropdown && setIsCatalogOpen(false)}
                  >
                    {link.hasDropdown ? (
                      <button
                        className={`flex items-center gap-1 text-sm font-medium text-white transition hover:text-gray-300 ${
                          location.startsWith("/catalogo") ? "text-gray-300" : ""
                        }`}
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className={`text-sm font-medium text-white transition hover:text-gray-300 ${
                          location === link.href ? "text-gray-300" : ""
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}

                    {link.hasDropdown && isCatalogOpen && (
                      <div className="absolute left-1/2 top-full z-[9999] mt-3 min-w-[260px] -translate-x-1/2 rounded-xl bg-black/95 py-2 shadow-2xl backdrop-blur-md">
                        {loadingCategories ? (
                          <div className="px-4 py-3 text-center text-sm text-white">
                            Carregando...
                          </div>
                        ) : (
                          dropdownCategories.map((cat) => (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              className="block px-4 py-2 text-xs font-medium tracking-wide text-white transition hover:bg-gray-900"
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

              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="ml-auto p-2 text-white md:hidden"
                aria-label="Abrir menu"
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Submenu horizontal com ícones */}
            <div className="hidden bg-black md:block">
              <div className="flex items-center justify-center gap-1 py-2 lg:gap-2">
                {submenuCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="flex items-center gap-1.5 whitespace-nowrap rounded px-2.5 py-1.5 text-[11px] text-white transition-all hover:bg-gray-900 hover:text-gray-300 lg:px-3"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="font-medium uppercase tracking-[0.12em]">
                        {cat.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="bg-gray-950 md:hidden">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-gray-900"
                      >
                        {link.name}
                      </button>
                      {isCatalogOpen && (
                        <div className="bg-black pl-4">
                          {dropdownCategories.map((cat) => (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              className="block px-4 py-2 text-xs text-white transition hover:bg-gray-900"
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
                      className="block px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-900"
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
