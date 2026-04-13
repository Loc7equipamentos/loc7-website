/*
 * LOC 7 — Navbar Component
 * Cinema Noir Industrial style
 * Dark header, Oswald font, red accent on active/hover
 * CATEGORIAS DINÂMICAS DO SUPABASE
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Camera, Aperture, Zap, Mic, Monitor, Move, Radio, Package, Clapperboard, ShoppingCart } from "lucide-react";
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

// Fallback categories (usado se Supabase falhar)
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
  const { items } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [location] = useLocation();
  const [dropdownCategories, setDropdownCategories] = useState<Array<{ name: string; href: string }>>(fallbackCategories);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Carregar categorias do Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const { data, error } = await supabase
          .from('categories')
          .select('name')
          .order('name');

        if (error) {
          console.warn('[DEBUG] Erro ao carregar categorias:', error);
          setDropdownCategories(fallbackCategories);
        } else if (data && data.length > 0) {
          console.log('[DEBUG] Categorias carregadas do Supabase:', data);
          const categories = data.map(cat => ({
            name: cat.name.toUpperCase(),
            href: `/catalogo/${cat.name.toLowerCase().replace(/\s+/g, '-')}`
          }));
          setDropdownCategories(categories);
        } else {
          console.warn('[DEBUG] Nenhuma categoria encontrada, usando fallback');
          setDropdownCategories(fallbackCategories);
        }
      } catch (err) {
        console.error('[DEBUG] Erro ao carregar categorias:', err);
        setDropdownCategories(fallbackCategories);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();

    // Inscrever em mudanças em tempo real
    const subscription = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        () => {
          console.log('[DEBUG] Categorias atualizadas, recarregando...');
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
    <>
      {/* Main navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[oklch(0.06_0_0)] shadow-2xl shadow-black/50' : 'bg-[oklch(0.08_0_0)]'} border-b border-[oklch(0.18_0_0)]`}>
        <div className="container">
          <div className="flex items-stretch justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group pr-8">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/logo-Loc-7-para-google_4_b32d3981.jpg"
                alt="Loc 7 Equipamentos"
                className="h-56 w-auto"
              />
            </Link>

            {/* Right side: nav */}
            <div className="flex flex-col flex-1 relative">
              {/* Main nav */}
              <div className="flex items-center justify-center h-16 flex-1">
                {/* Desktop nav - Centralizado */}
                <div className="hidden md:flex items-center gap-24 justify-center flex-1 relative">
                  {navLinks.map((link) => (
                    <div 
                      key={link.name} 
                      className="relative group whitespace-nowrap"
                      onMouseEnter={() => link.hasDropdown && setIsCatalogOpen(true)}
                      onMouseLeave={() => link.hasDropdown && setIsCatalogOpen(false)}
                    >
                      {link.hasDropdown ? (
                        <button
                          className={`loc7-nav-link flex items-center gap-1 ${location.startsWith('/catalogo') ? 'active' : ''}`}
                        >
                          {link.name}
                        </button>
                      ) : (
                        <Link href={link.href} className={`loc7-nav-link ${location === link.href ? 'active' : ''}`}>
                          {link.name}
                        </Link>
                      )}
                      
                      {/* Dropdown vertical - Abaixo de LOCAÇÃO */}
                      {link.hasDropdown && isCatalogOpen && (
                        <div className="loc7-dropdown">
                          {loadingCategories ? (
                            <div className="px-4 py-3 text-white text-sm text-center">Carregando...</div>
                          ) : (
                            dropdownCategories.map((cat) => (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                className="loc7-dropdown-item"
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

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                  className="md:hidden p-2"
                >
                  {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>

              {/* Cart icon */}
              <div className="flex items-center justify-end pr-4 h-12">
                <Link href="/carrinho" className="relative">
                  <ShoppingCart size={24} className="text-white hover:text-red-500 transition" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileOpen && (
            <div className="md:hidden bg-[oklch(0.06_0_0)] border-t border-[oklch(0.18_0_0)]">
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.hasDropdown ? (
                      <>
                        <button
                          onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                          className="w-full text-left px-4 py-3 text-white hover:bg-[oklch(0.12_0_0)] transition"
                        >
                          {link.name}
                        </button>
                        {isCatalogOpen && (
                          <div className="bg-[oklch(0.04_0_0)] pl-4">
                            {dropdownCategories.map((cat) => (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                className="block px-4 py-2 text-white text-sm hover:bg-[oklch(0.08_0_0)] transition"
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link href={link.href} className="block px-4 py-3 text-white hover:bg-[oklch(0.12_0_0)] transition">
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
    </>
  );
}
