/*
 * LOC 7 — Navbar Component
 * Header premium com logo maior, sem linhas visuais
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
  { name: "ILUMINAÇÃO", href: "/catalogo/iluminacao" },
  { name: "LENTES", href: "/catalogo/lentes" },
  { name: "MONITORES", href: "/catalogo/monitores" },
  { name: "MOVIMENTO", href: "/catalogo/movimento" },
  { name: "TRANSMISSORES", href: "/catalogo/transmissores" },
  { name: "MAQUINÁRIA", href: "/catalogo/maquinaria" },
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
  const [dropdownCategories, setDropdownCategories] = useState(fallbackCategories);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const { data, error } = await supabase
          .from("categories")
          .select("name")
          .order("name");

        if (error || !data || data.length === 0) {
          setDropdownCategories(fallbackCategories);
        } else {
          const categories = data.map((cat: any) => ({
            name: cat.name.toUpperCase(),
            href: `/catalogo/${cat.name.toLowerCase().replace(/\s+/g, "-")}`,
          }));
          setDropdownCategories(categories);
        }
      } catch {
        setDropdownCategories(fallbackCategories);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
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
    <nav className={`sticky top-0 z-50 bg-black ${isScrolled ? "shadow-lg shadow-black/30" : ""}`}>
      <div className="container">
        <div className="flex items-stretch justify-between">

          {/* LOGO */}
          <Link href="/" className="group flex shrink-0 items-center py-1 pr-8">
            <img
              src="/loc7-logo-header.png"
              alt="Loc7"
              className="h-[90px] w-auto object-contain"
            />
          </Link>

          {/* MENU */}
          <div className="relative flex flex-1 flex-col">

            {/* NAV PRINCIPAL */}
            <div className="flex h-[54px] flex-1 items-center justify-center md:h-[58px]">
              <div className="relative hidden flex-1 items-center justify-center gap-10 md:flex">

                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    onMouseEnter={() => link.hasDropdown && setIsCatalogOpen(true)}
                    onMouseLeave={() => link.hasDropdown && setIsCatalogOpen(false)}
                  >
                    {link.hasDropdown ? (
                      <button className="text-sm font-medium text-white hover:text-gray-300">
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-white hover:text-gray-300"
                      >
                        {link.name}
                      </Link>
                    )}

                    {link.hasDropdown && isCatalogOpen && (
                      <div className="absolute left-1/2 mt-3 -translate-x-1/2 rounded-xl bg-black/95 py-2 shadow-2xl">
                        {loadingCategories ? (
                          <div className="px-4 py-2 text-white">Carregando...</div>
                        ) : (
                          dropdownCategories.map((cat) => (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              className="block px-4 py-2 text-xs text-white hover:bg-gray-900"
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

              {/* MOBILE BTN */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="ml-auto p-2 text-white md:hidden"
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* SUBMENU */}
            <div className="hidden bg-black md:block">
              <div className="flex items-center justify-center gap-2 py-2">
                {submenuCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="flex items-center gap-1 text-xs text-white hover:text-gray-300"
                    >
                      <Icon className="h-4 w-4" />
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* MOBILE MENU */}
        {isMobileOpen && (
          <div className="bg-gray-950 md:hidden">
            {navLinks.map((link) => (
              <div key={link.name}>
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-white hover:bg-gray-900"
                >
                  {link.name}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
