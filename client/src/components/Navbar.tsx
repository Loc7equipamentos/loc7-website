/*
 * LOC 7 — Navbar Component
 * Cinema Noir Industrial style
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
  audio: Mic,
  monitores: Monitor,
  movimento: Move,
  transmissores: Radio,
  maquinaria: Clapperboard,
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
  const [dropdownCategories, setDropdownCategories] = useState<DropdownCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const { data } = await supabase
          .from("categories")
          .select("name")
          .order("name");

        if (data && data.length > 0) {
          setDropdownCategories(
            data.map((cat) => ({
              name: cat.name,
              href: `/catalogo/${normalizeText(cat.name).replace(/\s+/g, "-")}`,
            }))
          );
        }
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <Link href="/">LOC7</Link>

        <div className="hidden md:flex gap-10">
          {navLinks.map((link) => (
            <div
              key={link.name}
              onMouseEnter={() => link.hasDropdown && setIsCatalogOpen(true)}
              onMouseLeave={() => link.hasDropdown && setIsCatalogOpen(false)}
              className="relative"
            >
              {link.hasDropdown ? (
                <span className="cursor-pointer">{link.name}</span>
              ) : (
                <Link href={link.href}>{link.name}</Link>
              )}

              {link.hasDropdown && isCatalogOpen && (
                <div className="absolute bg-black p-4 border border-gray-800 min-w-[220px]">
                  {loadingCategories ? (
                    <div className="text-sm text-gray-400">Carregando...</div>
                  ) : (
                    dropdownCategories.map((cat) => {
                      const Icon = getCategoryIcon(cat.name);

                      return (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="flex items-center gap-3 py-2 group"
                        >
                          <Icon className="w-4 h-4 text-white group-hover:text-red-500 transition" />
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

        <div className="flex items-center gap-4">
          <Link href="/carrinho" className="relative">
            <ShoppingCart className="text-white" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* BARRA DE ÍCONES */}
      <div className="hidden md:flex gap-6 px-6 py-4 border-t border-gray-800">
        {submenuCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex items-center gap-2 group"
            >
              <Icon className="w-6 h-6 text-white group-hover:text-red-500 transition" />
              <span>{cat.name}</span>
            </Link>
          );
        })}
      </div>

      {/* MOBILE */}
      {isMobileOpen && (
        <div className="md:hidden px-6 pb-4">
          {dropdownCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.name);
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex items-center gap-3 py-2 group"
              >
                <Icon className="w-4 h-4 text-white group-hover:text-red-500 transition" />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
