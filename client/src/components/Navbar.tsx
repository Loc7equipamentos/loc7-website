/*
 * LOC 7 — Navbar Component
 * Cinema Noir Industrial style
 * Dark header, Oswald font, red accent on active/hover
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Camera, Aperture, Zap, Mic, Monitor, Move, Radio, Package, Clapperboard, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const submenuCategories = [
  { name: "Câmeras", icon: Camera, href: "/catalogo/cameras" },
  { name: "Lentes", icon: Aperture, href: "/catalogo/lentes" },
  { name: "Iluminação", icon: Zap, href: "/catalogo/iluminacao" },
  { name: "Áudio", icon: Mic, href: "/catalogo/audio" },
  { name: "Monitores", icon: Monitor, href: "/catalogo/monitores" },
  { name: "Movimento", icon: Move, href: "/catalogo/movimento" },
  { name: "Wireless", icon: Radio, href: "/catalogo/wireless" },
  { name: "Modificadores", icon: Package, href: "/catalogo/modificadores" },
  { name: "Maquinária", icon: Clapperboard, href: "/catalogo/maquinaria" },
];

const dropdownCategories = [
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
  { name: "LENTES", href: "/catalogo/lentes" },
  { name: "MAQUINÁRIA", href: "/catalogo/maquinaria" },
  { name: "MATTEBOX", href: "/catalogo/mattebox" },
  { name: "MONITORES", href: "/catalogo/monitores" },
  { name: "SUPORTE E MOVIMENTO", href: "/catalogo/movimento" },
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
                        <div 
                          className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 w-64 shadow-2xl z-50 overflow-hidden"
                          style={{
                            backgroundColor: '#615e5e',
                            borderColor: '#615e5e',
                            backgroundImage: `
                              linear-gradient(to right, rgba(0,0,0,0.5), transparent 30%, transparent 70%, rgba(0,0,0,0.5)),
                              linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 30%, transparent 70%, rgba(0,0,0,0.5))
                            `,
                            backgroundSize: '100% 100%, 100% 100%',
                            backgroundPosition: '0 0, 0 0',
                            backgroundRepeat: 'no-repeat, no-repeat'
                          }}
                        >
                          <div className="flex flex-col">
                            {dropdownCategories.map((cat) => (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                className="px-4 py-3 text-white font-bold transition-transform duration-100 text-sm tracking-wide text-center"
                                onMouseEnter={(e) => {
                                  let scale = 1.35;
                                  if (['COMPUTADORES E TABLETS', 'HDS E CARTÕES DE MEMÓRIA'].includes(cat.name)) scale = 1.15;
                                  e.currentTarget.style.transform = `scale(${scale})`;
                                  e.currentTarget.style.color = '#ffffff';
                                  e.currentTarget.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.4)';
                                  e.currentTarget.style.fontWeight = '900';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.color = '#ffffff';
                                  e.currentTarget.style.textShadow = 'none';
                                  e.currentTarget.style.fontWeight = 'bold';
                                }}
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Contador de Orçamento */}
                  <Link
                    href="/orcamento"
                    className="loc7-nav-link flex items-center gap-2 relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Orçamento
                    {items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[oklch(0.45_0.25_25)] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {items.length}
                      </span>
                    )}
                  </Link>

                  {/* Link Cadastro */}
                  <Link
                    href="/cadastro"
                    className="loc7-nav-link"
                  >
                    Cadastro
                  </Link>
                </div>

                {/* Mobile menu button */}
                <button
                  className="md:hidden text-white p-2"
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                  {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>



              {/* Submenu horizontal - ORIGINAL COM ÍCONES */}
              <div className="hidden md:block border-t border-[oklch(0.2_0_0)] bg-[oklch(0.08_0_0)] h-16">
                <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
                  {submenuCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="flex items-center gap-2 px-4 py-2 text-white hover:text-white hover:bg-[oklch(0.12_0_0)] transition-all whitespace-nowrap text-sm rounded hover:scale-105"
                      >
                        <Icon className="w-7 h-7 transition-transform duration-150 hover:scale-125" />
                        <span style={{ fontFamily: 'Oswald, sans-serif' }} className="uppercase tracking-wide font-semibold">
                          {cat.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="md:hidden bg-[oklch(0.06_0_0)] border-t border-[oklch(0.18_0_0)]">
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="loc7-nav-link py-3 border-b border-[oklch(0.15_0_0)] text-base"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <a
                  href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Gostaria de solicitar um orçamento."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="loc7-btn-primary text-center py-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Orçamento WhatsApp
                </a>
              </div>
              {/* Mobile categories */}
              <div className="pt-4 grid grid-cols-3 gap-2">
                {submenuCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="flex flex-col items-center gap-1 p-3 bg-[oklch(0.1_0_0)] rounded border border-[oklch(0.18_0_0)]"
                    >
                      <Icon className="w-8 h-8 text-[oklch(0.45_0.25_25)] transition-transform duration-300 hover:scale-125" />
                      <span className="text-[0.6rem] uppercase tracking-wider text-[oklch(0.7_0_0)]" style={{ fontFamily: 'Oswald, sans-serif' }}>
                        {cat.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
