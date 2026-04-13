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
import { useParams } from "wouter";

const brands = ["Todas", "Sony", "Canon", "RED", "Blackmagic", "Arri", "Aputure", "Zeiss", "DJI", "Godox"];

export default function Catalogo() {
  const { addItem } = useCart();
  const params = useParams<{ category?: string }>();
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

  // Atualizar categoria selecionada quando URL mudar
  useEffect(() => {
    if (params.category) {
      // Converter URL slug para nome de categoria
      const categoryName = params.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      console.log('[DEBUG] Categoria da URL:', { slug: params.category, name: categoryName });
      setSelectedCategory(categoryName);
    } else {
      setSelectedCategory("Todos");
    }
  }, [params.category]);

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
    // Filtro de categoria: comparar case-insensitive
    const matchCat = selectedCategory === "Todos" || 
      (p.category?.toLowerCase() === selectedCategory.toLowerCase());
    const matchBrand = selectedBrand === "Todas" || (p.name?.toLowerCase().includes(selectedBrand.toLowerCase()) ?? false);
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    
    if (selectedCategory !== "Todos" && !matchCat) {
      console.log('[DEBUG] Produto não corresponde à categoria:', { product: p.name, productCat: p.category, selectedCat: selectedCategory });
    }
    
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
            {filtered.map((product) => {
              const productLink = product.slug ? `/equipamentos/${product.slug}` : null;
              return (
              <a
                key={product.id}
                href={productLink || '#'}
                className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative overflow-hidden aspect-square bg-gray-100">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/400x400?text=Sem+imagem'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">
                    {product.category}
                  </p>
                  <h3 className="text-gray-900 text-sm font-semibold leading-tight mb-3 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.badge && (
                    <p className="text-blue-600 text-xs font-semibold mb-3">{product.badge}</p>
                  )}
                  <p className="text-gray-900 text-lg font-bold">
                    R$ {product.price.toFixed(2)}<span className="text-gray-500 text-sm font-normal">/dia</span>
                  </p>
                </div>
              </a>
            );
            })}
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
