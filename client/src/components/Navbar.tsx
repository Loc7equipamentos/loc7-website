/*
 * LOC 7 — Navbar Component
 * Cinema Noir Industrial style
 * Dark header, Oswald font, red accent on active/hover
 * CATEGORIAS DINÂMICAS DO SUPABASE
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
  ShoppingCart,
  Package,
  type LucideIcon,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
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

type DropdownCategory = {
  name: string;
  href: string;
};

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const iconMapByName: Record<string, LucideIcon> = {
  cameras: Camera,
  camera: Camera,
  lentes: Aperture,
  lente: Aperture,
  iluminacao: Zap,
  iluminacaoes: Zap,
  audio: Mic,
  monitores: Monitor,
  monitor: Monitor,
  movimento: Move,
  transmissores: Radio,
  transmissor: Radio,
  maquinaria: Clapperboard,
  maquinarias: Clapperboard,
};

const getCategoryIcon = (categoryName: string): LucideIcon => {
  const normalized = normalizeText(categoryName);
  return iconMapByName[normalized] || Package;
};

export default function Navbar() {
  const { items } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [location] = useLocation();
  const [dropdownCategories, setDropdownCategories] = useState<DropdownCategory[]>(fallbackCategories);
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
          setDropdownCategories(fallbackCategories);
        } else if (data && data.length > 0) {
          const categories = data.map((cat) => ({
            name: cat.name.toUpperCase(),
            href: `/catalogo/${cat.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
          }));
          setDropdownCategories(categories);
        } else {
          setDropdownCategories(fallbackCategories);
        }
      } catch {
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
        () => loadCategories()
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[oklch(0.06_0_0)] shadow-2xl shadow-black/50"
          : "bg-[oklch(0.08_0_0)]"
      } border-b border-[oklch(0.18_0_0)]`}
    >
      <div className="container">
        <div className="flex items-stretch justify-between">
          <Link href="/" className="flex items-center gap-2 group pr-8">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/logo-Loc-7-para-google_4_b32d3981.jpg"
              alt="Loc 7 Equipamentos"
              className="h-56 w-auto"
            />
          </Link>

          <div className="flex flex-col flex-1 relative">
            <div className="flex items-center justify-center h-16 flex-1">
              <div className="hidden md:flex items-center gap-24 justify-center flex-1 relative overflow-visible">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="relative group whitespace-nowrap"
                    onMouseEnter={() => link.hasDropdown && setIsCatalogOpen(true)}
                    onMouseLeave={() => link.hasDropdown && setIsCatalogOpen(false)}
                  >
                    {link.hasDropdown ? (
                      <button
                        className={`loc7-nav-link ${
                          location.startsWith("/catalogo") ? "active" : ""
                        }`}
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className={`loc7-nav-link ${
                          location === link.href ? "active" : ""
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}

                    {link.hasDropdown && isCatalogOpen && (
                      <div className="loc7-dropdown">
                        {loadingCategories ? (
                          <div className="px-4 py-3 text-white text-sm text-center">
                            Carregando...
                          </div>
                        ) : (
                          dropdownCategories.map((cat) => {
                            const Icon = getCategoryIcon(cat.name);

                            return (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                className="loc7-dropdown-item flex items-center gap-3"
                              >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{cat.name}</span>
                              </Link>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden p-2"
              >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            <div className="flex items-center justify-end pr-4 h-12">
              <Link href="/carrinho" className="relative">
                <ShoppingCart
                  size={26}
                  className="text-white hover:text-red-500 transition"
                />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:block border-t border-[oklch(0.2_0_0)] bg-[oklch(0.08_0_0)] min-h-20">
          <div className="flex items-center gap-3 overflow-x-auto py-3 px-2 scrollbar-hide">
            {submenuCategories.map((cat) => {
              const Icon = cat.icon;

              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="flex items-center gap-3 px-5 py-2 text-white hover:bg-[oklch(0.12_0_0)] transition-all whitespace-nowrap rounded-lg hover:scale-105"
                >
                  <Icon className="w-9 h-9 shrink-0" />
                  <span
                    style={{ fontFamily: "Oswald, sans-serif" }}
                    className="uppercase tracking-wide font-semibold text-base"
                  >
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {isMobileOpen && (
          <div className="md:hidden bg-[oklch(0.06_0_0)] border-t border-[oklch(0.18_0_0)]">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                        className="w-full text-left px-4 py-3 text-white hover:bg-[oklch(0.12_0_0)]"
                      >
                        {link.name}
                      </button>

                      {isCatalogOpen && (
                        <div className="bg-[oklch(0.04_0_0)] pl-2">
                          {dropdownCategories.map((cat) => {
                            const Icon = getCategoryIcon(cat.name);

                            return (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                className="flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-[oklch(0.08_0_0)]"
                              >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{cat.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className="block px-4 py-3 text-white hover:bg-[oklch(0.12_0_0)]"
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
