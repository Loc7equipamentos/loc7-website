/*
 * LOC 7 — Catálogo Page
 * Cinema Noir Industrial style
 * Product grid with filters, search, and WhatsApp CTA
 */

import { useState } from "react";
import { Search, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const categories = ["Todos", "Câmeras", "Lentes", "Iluminação", "Áudio", "Monitores", "Movimento", "Wireless", "Modificadores"];
const brands = ["Todas", "Sony", "Canon", "RED", "Blackmagic", "Arri", "Aputure", "Zeiss", "DJI", "Godox"];

const allProducts = [
  { id: 1, name: "Sony FX9 6K Full Frame", category: "Câmeras", brand: "Sony", price: 850, badge: "FULLFRAME", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80", isNew: false },
  { id: 2, name: "Sony A7V 4K Fullframe", category: "Câmeras", brand: "Sony", price: 650, badge: "FULLFRAME", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80", isNew: true },
  { id: 3, name: "Canon C300 Mark III", category: "Câmeras", brand: "Canon", price: 950, badge: "SUPER35", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80", isNew: false },
  { id: 4, name: "RED Komodo 6K S35", category: "Câmeras", brand: "RED", price: 1000, badge: "S35", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80", isNew: false },
  { id: 5, name: "Blackmagic Pyxis 6K", category: "Câmeras", brand: "Blackmagic", price: 900, badge: "FULLFRAME", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80", isNew: true },
  { id: 6, name: "Zeiss Supreme Prime Set", category: "Lentes", brand: "Zeiss", price: 2200, badge: "PL MOUNT", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80", isNew: false },
  { id: 7, name: "Leitz Cine Hektor Set", category: "Lentes", brand: "Zeiss", price: 2100, badge: "E-MOUNT", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80", isNew: true },
  { id: 8, name: "DZO Pictor Zoom Set", category: "Lentes", brand: "Zeiss", price: 1500, badge: "EF/PL", img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80", isNew: false },
  { id: 9, name: "Aputure 600d Pro", category: "Iluminação", brand: "Aputure", price: 600, badge: "LED", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80", isNew: false },
  { id: 10, name: "Aputure Storm 700x", category: "Iluminação", brand: "Aputure", price: 800, badge: "LED", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80", isNew: true },
  { id: 11, name: "Godox AD600 Pro II", category: "Iluminação", brand: "Godox", price: 400, badge: "FLASH", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80", isNew: true },
  { id: 12, name: "Godox AD400 Pro II", category: "Iluminação", brand: "Godox", price: 300, badge: "FLASH", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80", isNew: false },
  { id: 13, name: "DJI RS 4 Pro Gimbal", category: "Movimento", brand: "DJI", price: 350, badge: "GIMBAL", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80", isNew: false },
  { id: 14, name: "Rode Wireless Pro", category: "Áudio", brand: "Sony", price: 200, badge: "WIRELESS", img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80", isNew: true },
  { id: 15, name: "SmallHD 702 Touch", category: "Monitores", brand: "Sony", price: 300, badge: "7 POLEGADAS", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80", isNew: false },
  { id: 16, name: "Tilta Nucleus M II", category: "Movimento", brand: "Sony", price: 550, badge: "FOLLOW FOCUS", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80", isNew: false },
];

export default function Catalogo() {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const filtered = allProducts.filter(p => {
    const matchCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchBrand = selectedBrand === "Todas" || p.brand === selectedBrand;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchCat && matchBrand && matchSearch && matchPrice;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* Header */}
      <div className="bg-[oklch(0.06_0_0)] border-b border-[oklch(0.15_0_0)] py-10">
        <div className="container">
          <span className="loc7-section-title text-lg">CATÁLOGO</span>
          <div className="loc7-red-line" />
          <p className="text-[oklch(0.5_0_0)] text-sm mt-3">
            {filtered.length} equipamentos disponíveis
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search and controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
            <input
              type="text"
              placeholder="Buscar equipamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] text-white pl-10 pr-4 py-3 focus:outline-none focus:border-[oklch(0.45_0.25_25)] placeholder:text-white text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.25_25)] font-display uppercase tracking-wide"
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="name">Nome A-Z</option>
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] hover:border-[oklch(0.45_0.25_25)] text-white px-4 py-3 text-sm transition-colors font-display uppercase tracking-wide"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-display font-semibold text-white uppercase tracking-widest text-xs mb-3">Marca</p>
              <div className="flex flex-wrap gap-2">
                {brands.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`text-xs px-3 py-1.5 border transition-all font-display uppercase tracking-wide ${selectedBrand === b ? 'bg-[oklch(0.45_0.25_25)] border-[oklch(0.45_0.25_25)] text-white' : 'border-[oklch(0.22_0_0)] text-[oklch(0.6_0_0)] hover:border-white hover:text-white'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-display font-semibold text-white uppercase tracking-widest text-xs mb-3">Faixa de Preço (por dia)</p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-24 bg-[oklch(0.15_0_0)] border border-[oklch(0.22_0_0)] text-white px-2 py-1.5 text-sm focus:outline-none focus:border-[oklch(0.45_0.25_25)]"
                  placeholder="Min"
                />
                <span className="text-[oklch(0.4_0_0)]">—</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-24 bg-[oklch(0.15_0_0)] border border-[oklch(0.22_0_0)] text-white px-2 py-1.5 text-sm focus:outline-none focus:border-[oklch(0.45_0.25_25)]"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 text-xs px-4 py-2 border transition-all font-display font-semibold uppercase tracking-widest ${selectedCategory === cat ? 'bg-[oklch(0.45_0.25_25)] border-[oklch(0.45_0.25_25)] text-white' : 'border-[oklch(0.22_0_0)] text-[oklch(0.6_0_0)] hover:border-white hover:text-white bg-transparent'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((product) => (
              <div key={product.id} className="loc7-product-card group">
                <div className="relative overflow-hidden aspect-square bg-[oklch(0.08_0_0)]">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:opacity-80 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="loc7-category-badge">{product.badge}</span>
                    {product.isNew && (
                      <span className="text-[0.6rem] font-display font-bold uppercase tracking-widest bg-[oklch(0.45_0.25_25)] text-white px-1.5 py-0.5">NOVO</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 gap-2">
                    <button
                      onClick={() => addItem({ id: product.id, name: product.name, price: product.price, category: product.category })}
                      className="flex-1 bg-[oklch(0.45_0.25_25)] hover:bg-[oklch(0.5_0.25_25)] text-white text-xs py-2 text-center transition-colors font-display font-semibold uppercase tracking-wide"
                    >
                      + Orcar
                    </button>
                    <a
                      href={`https://wa.me/message/WOIONHHSTABQF1?text=Olá! Tenho interesse em alugar: ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 loc7-btn-primary text-xs py-2 text-center"
                    >
                      Direto
                    </a>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-[oklch(0.45_0.25_25)] text-[0.6rem] uppercase tracking-widest font-display font-semibold mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-white text-xs font-medium leading-tight mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="font-mono-price text-[oklch(0.8_0_0)] text-sm font-semibold">
                    R$ {product.price.toLocaleString('pt-BR')},00
                    <span className="text-[oklch(0.45_0_0)] text-xs font-normal">/dia</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-display font-bold text-[oklch(0.3_0_0)] text-2xl uppercase tracking-widest mb-4">
              Nenhum equipamento encontrado
            </p>
            <p className="text-[oklch(0.4_0_0)] text-sm mb-6">Tente ajustar os filtros ou buscar por outro termo</p>
            <button
              onClick={() => { setSelectedCategory("Todos"); setSelectedBrand("Todas"); setSearchQuery(""); }}
              className="loc7-btn-outline text-sm"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="mt-16 bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] p-8 text-center">
          <h3 className="font-display font-bold text-white text-2xl uppercase tracking-wide mb-3">
            NÃO ENCONTROU O QUE PRECISA?
          </h3>
          <p className="text-[oklch(0.6_0_0)] mb-6">
            Entre em contato pelo WhatsApp e nossa equipe irá ajudá-lo a encontrar o equipamento ideal para seu projeto.
          </p>
          <a
            href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Estou procurando um equipamento específico e gostaria de ajuda."
            target="_blank"
            rel="noopener noreferrer"
            className="loc7-btn-primary inline-flex items-center gap-2 text-base"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Falar com Especialista
          </a>
        </div>
      </div>
    </div>
  );
}
