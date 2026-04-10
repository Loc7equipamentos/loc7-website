/*
 * LOC 7 — Catálogo Page
 * Cinema Noir Industrial style
 * Product grid with filters, search, and WhatsApp CTA
 * Integrado com Supabase para sincronização em tempo real
 */

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, ArrowRight, Loader } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase, type Product } from "@/lib/supabase";

const brands = ["Todas", "Sony", "Canon", "RED", "Blackmagic", "Arri", "Aputure", "Zeiss", "DJI", "Godox"];

export default function Catalogo() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  // Carregar dados do Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar categorias
        const { data: categoriesData, error: catError } = await supabase
          .from('categories')
          .select('name')
          .order('name');

        if (catError) throw catError;

        const categoryNames = categoriesData?.map(c => c.name) || [];
        setCategories(["Todos", ...categoryNames]);

        // Buscar produtos
        const { data: productsData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (prodError) throw prodError;

        setProducts(productsData || []);

        // Atualizar preço máximo baseado nos produtos
        if (productsData && productsData.length > 0) {
          const maxPrice = Math.max(...productsData.map(p => p.price));
          setPriceRange([0, Math.ceil(maxPrice / 100) * 100]);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Inscrever em mudanças em tempo real
    const subscription = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          loadData(); // Recarregar quando houver mudanças
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchBrand = selectedBrand === "Todas" || (p.name?.toLowerCase().includes(selectedBrand.toLowerCase()) ?? false);
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchCat && matchBrand && matchSearch && matchPrice;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-[oklch(0.08_0_0)] pt-32 pb-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Erro ao carregar catálogo</h1>
            <p className="text-[oklch(0.7_0_0)] mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="loc7-btn-primary"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] pt-32 pb-16">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">CATÁLOGO</h1>
          <p className="text-[oklch(0.7_0_0)] text-lg">
            {loading ? 'Carregando produtos...' : `${filtered.length} produtos encontrados`}
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8 flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(0.45_0_0)]" />
            <input
              type="text"
              placeholder="Buscar equipamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[oklch(0.12_0_0)] border border-[oklch(0.18_0_0)] rounded text-white placeholder-[oklch(0.45_0_0)] focus:outline-none focus:border-[oklch(0.45_0.25_25)]"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-[oklch(0.45_0.25_25)] hover:text-white transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.18_0_0)] rounded p-6 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-white font-semibold mb-3">Categorias</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[oklch(0.45_0.25_25)] text-white'
                          : 'bg-[oklch(0.18_0_0)] text-[oklch(0.7_0_0)] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="text-white font-semibold mb-3">Marcas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        selectedBrand === brand
                          ? 'bg-[oklch(0.45_0.25_25)] text-white'
                          : 'bg-[oklch(0.18_0_0)] text-[oklch(0.7_0_0)] hover:text-white'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-white font-semibold mb-3">Faixa de Preço</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                </div>
                <p className="text-[oklch(0.7_0_0)] text-sm mt-2">
                  R$ {priceRange[0]} - R$ {priceRange[1]}
                </p>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-white font-semibold mb-3">Ordenar por</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-[oklch(0.18_0_0)] border border-[oklch(0.18_0_0)] rounded text-white focus:outline-none focus:border-[oklch(0.45_0.25_25)]"
                >
                  <option value="relevance">Relevância</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name-asc">Nome A-Z</option>
                  <option value="name-desc">Nome Z-A</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 text-[oklch(0.45_0.25_25)] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[oklch(0.7_0_0)] text-lg">Nenhum produto encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="loc7-product-card group">
                <div className="relative overflow-hidden aspect-square bg-[oklch(0.08_0_0)]">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/400x400?text=Sem+imagem'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:opacity-80 opacity-80 group-hover:opacity-100"
                  />
                  {product.badge && (
                    <div className="absolute top-2 left-2">
                      <span className="loc7-category-badge">{product.badge}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <a
                      href={`https://wa.me/message/WOIONHHSTABQF1?text=Olá! Tenho interesse em alugar: ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full loc7-btn-primary text-xs py-2 text-center flex items-center justify-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Orçamento
                    </a>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-[oklch(0.45_0.25_25)] text-[0.65rem] uppercase tracking-widest font-display font-semibold mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-white text-sm font-medium leading-tight mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="font-mono-price text-[oklch(0.8_0_0)] text-sm font-semibold">
                    R$ {product.price.toFixed(2)}<span className="text-[oklch(0.45_0_0)] text-xs font-normal">/dia</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[oklch(0.12_0_0)] to-[oklch(0.08_0_0)] border border-[oklch(0.18_0_0)] rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Não encontrou o que procura?</h2>
          <p className="text-[oklch(0.7_0_0)] mb-6">Fale com nossos especialistas para soluções customizadas</p>
          <a href="https://wa.me/5511997237850" target="_blank" rel="noopener noreferrer" className="loc7-btn-primary inline-flex items-center gap-2">
            Falar com especialista
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
