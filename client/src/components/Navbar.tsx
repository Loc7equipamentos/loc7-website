/*
 * LOC 7 — Navbar Component
 * Versão compactada para melhor densidade visual em telas menores
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
  Flag,
  User,
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
  { name: "Maquinária", icon: Flag, href: "/catalogo/maquinaria" },
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
      className={`relative lg:fixed lg:top-0 lg:left-0 lg:right-0 z-50 overflow-visible transition-all duration-300 ${
        isScrolled ? "bg-black shadow-lg shadow-black/30" : "bg-black"
      }`}
    >
      <div className="container">
        <div className="flex items-stretch justify-between overflow-visible">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex items-center group shrink-0 w-[150px] md:w-[180px] h-20 md:h-[72px] overflow-visible"
          >
            <img
  src="/loc7-logo-header.png"
  alt="Loc 7 Equipamentos"
  className="absolute left-[-6px] md:left-[-12px] top-[85%] -translate-y-1/2 scale-[1.25] md:scale-[1.35] origin-left transition-transform duration-300 group-hover:scale-[1.28] md:group-hover:scale-[1.38]"
/>
          </Link>

          {/* Navegação desktop / mobile trigger */}
          <div className="flex flex-col flex-1 relative">
            <div className="flex items-center justify-center h-20 md:h-[72px] flex-1">
              <div className="hidden md:flex items-center gap-10 lg:gap-12 justify-center flex-1 relative overflow-visible">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="relative group whitespace-nowrap overflow-visible pointer-events-auto"
                    onMouseEnter={() => link.hasDropdown && setIsCatalogOpen(true)}
                    onMouseLeave={() => link.hasDropdown && setIsCatalogOpen(false)}
                  >
                    {link.hasDropdown ? (
                      <button
                        className={`flex items-center gap-1 text-sm font-medium text-white hover:text-gray-300 transition ${
                          location.startsWith("/catalogo") ? "text-gray-300" : ""
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
                      <div className="absolute left-1/2 top-full -translate-x-1/2 mt-0 min-w-[260px] rounded-xl border border-gray-800 bg-black/95 backdrop-blur-md shadow-2xl z-[9999] py-2">
                        {loadingCategories ? (
                          <div className="px-4 py-3 text-white text-sm text-center">
                            Carregando...
                          </div>
                        ) : (
                          dropdownCategories.map((cat) => (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              className="block px-4 py-2 text-xs font-medium tracking-wide text-white hover:bg-gray-900 transition"
                            >
                              {cat.name}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Acesso sistema */}
                <Link href="/admin-panel">
                  <div className="ml-3 flex items-center justify-center w-8 h-8 rounded-full border border-white/10 hover:border-white/25 hover:bg-white/5 transition cursor-pointer">
  <User className="w-4 h-4 text-white/60 hover:text-white/80" />
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

        {/* Submenu horizontal com ícones */}
        <div className="hidden md:block bg-black">
          <div className="flex items-center justify-center gap-4 lg:gap-6 py-2 md:pl-[180px]">
            {submenuCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="flex flex-col items-center justify-center px-2 lg:px-3 py-1 text-white/70 hover:text-white transition-all duration-200 hover:scale-[1.05]"
                >
                  <Icon
  className={`w-5 h-5 mb-1 ${
    cat.name === "Maquinária" ? "rotate-[-10deg]" : ""
  }`}
/>
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em]">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile menu */}
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
                        {link.name}
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
