/*
 * LOC 7 — Navbar Component
 * Premium, elegant, dark aesthetic
 * Preto dominante, branco limpo, identidade Loc7
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Camera, Aperture, Zap, Mic, Monitor, Move, Radio, Clapperboard } from "lucide-react";
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

const slugToCategoryName: Record<string, string> = {
  'cameras': 'Câmeras',
  'lentes': 'Lentes',
  'iluminacao': 'Iluminação',
  'audio': 'Áudio',
  'monitores': 'Monitores',
  'movimento': 'Movimento',
  'transmissores': 'Transmissores',
  'maquinaria': 'Maquinária',
};

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
          const categories = data.map((cat: any) => ({
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
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black shadow-lg shadow-black/40' : 'bg-black'}`}>
        <div className="container">
          <div className="flex items-stretch justify-between">
            {/* Logo - Loc 7 Brand - Maior e com mais presença */}
            <Link href="/" className="flex items-center py-3 group">
              <img
                src="/logo-loc7-navbar.png"
                alt="Loc 7 Equipamentos"
                className="h-[6.5rem] w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Right side: nav */}
            <div className="flex flex-col flex-1 relative">
              {/* Main nav */}
              <div className="flex items-center justify-center h-20 flex-1">
                {/* Desktop nav - Centralizado e elegante */}
                <div className="hidden md:flex items-center gap-16 justify-center flex-1 relative overflow-visible">
                  {navLinks.map((link) => (
                    <div 
                      key={link.name} 
                      className="relative group whitespace-nowrap overflow-visible pointer-events-auto"
                      onMouseEnter={() => link.hasDropdown && setIsCatalogOpen(true)}
                      onMouseLeave={() => link.hasDropdown && setIsCatalogOpen(false)}
                    >
                      {link.hasDropdown ? (
                        <Link href={link.href} className={`text-base font-semibold tracking-wide text-white hover:text-white hover:scale-105 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.25)] transition-all duration-200 ease-out ${location.startsWith('/catalogo') ? 'text-gray-300' : ''}`}>
                          {link.name}
                        </Link>
                      ) : (
                        <Link href={link.href} className={`text-base font-semibold tracking-wide text-white hover:text-white hover:scale-105 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.25)] transition-all duration-200 ease-out ${location === link.href ? 'text-gray-300' : ''}`}>
                          {link.name}
                        </Link>
                      )}
                      
                      {/* Dropdown vertical - Abaixo de LOCAÇÃO */}
                      {link.hasDropdown && isCatalogOpen && (
                        <div className="loc7-dropdown z-[9999] bg-black border border-gray-800 shadow-2xl backdrop-blur-none" style={{pointerEvents: 'auto'}}>
                          {loadingCategories ? (
                            <div className="px-4 py-3 text-white text-sm text-center">Carregando...</div>
                          ) : (
                            dropdownCategories.map((cat) => (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                className="loc7-dropdown-item hover:bg-gray-900 hover:text-white transition-all duration-150 hover:pl-6 hover:tracking-wide"
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
                  className="md:hidden p-2 text-white"
                >
                  {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submenu horizontal com ícones - Centralizado e refinado */}
          <div className="hidden md:block bg-black h-16">
            <div className="flex items-center justify-center gap-2 py-2">
              {submenuCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="flex items-center gap-2 px-3 py-2 text-white hover:text-white hover:bg-gray-900/80 hover:scale-105 hover:shadow-[0_0_10px_rgba(255,255,255,0.15)] transition-all duration-200 whitespace-nowrap text-xs rounded group"
                  >
                    <Icon className="w-5 h-5 transition-transform duration-150 group-hover:scale-110" />
                    <span className="font-medium uppercase tracking-wider">
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
                                className="block px-4 py-2 text-white text-xs hover:bg-gray-900 transition"
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link href={link.href} className="block px-4 py-3 text-white hover:bg-gray-900 transition text-sm font-medium">
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
