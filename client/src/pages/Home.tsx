/*
 * LOC 7 — Home Page
 * Cinema Noir Industrial style
 * Hero + Categorias + Produtos em Destaque + Depoimentos + CTA
 */

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials = [
    {
      name: "Marcos Filho",
      role: "Cliente",
      text: "Ótimo atendimento e recepção. Dispostos a ajudar e servir.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos",
    },
    {
      name: "Milennar Baby",
      role: "Local Guide",
      text: "Contamos com os serviços da Loc7 há 8 anos e sempre nos atendem prontamente com equipamentos sempre em ótimo estado e com preço justo. Recomendamos a Loc7 sempre!!!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milennar",
    },
    {
      name: "Raquel Carneiro",
      role: "Cliente",
      text: "Loc 7 sempre entrega tudo que promete, equipamento e atendimento impecável!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Raquel",
    },
    {
      name: "Diogo Garcia de Menezes Santos",
      role: "Cliente",
      text: "Sempre solícitos e preocupados em nos proporcionar o melhor setup para a execução dos projetos na melhor excelência possível",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diogo",
    },
    {
      name: "Jeniffer Carvalho",
      role: "Cliente",
      text: "Minha experiência foi ótima, foram super solicitos e sempre dispostos a ajudar, super recomendo",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeniffer",
    },
    {
      name: "Gabriel Silva",
      role: "Cliente",
      text: "Excelente atendimento, me ajudaram e tiraram todas minhas duvidas, otima localização!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriel",
    },
  ];

  const heroSlides = [
    {
      title: "EQUIPAMENTOS\nCINE E BROADCAST",
      subtitle: "Câmeras, lentes e iluminação profissional",
      image:
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00051_brightened_029b14bf.webp",
    },
    {
      title: "LENTES\nCINE E FOTO",
      subtitle: "Sets completos para sua produção",
      image:
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00394_darkened_19aead4d.webp",
    },
    {
      title: "ILUMINAÇÃO\nPROFISSIONAL",
      subtitle: "Do set de estúdio às externas",
      image:
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00358_brightened_afa8c25b.webp",
    },
  ];

  const categories = [
    { id: 1, name: "Câmeras", slug: "cameras" },
    { id: 2, name: "Lentes", slug: "lentes" },
    { id: 3, name: "Iluminação", slug: "iluminacao" },
    { id: 4, name: "Áudio", slug: "audio" },
    { id: 5, name: "Estabilização", slug: "estabilizacao" },
    { id: 6, name: "Transmissão", slug: "transmissao" },
    { id: 7, name: "Acessórios", slug: "acessorios" },
    { id: 8, name: "Suportes", slug: "suportes" },
  ];

  const products = [
    {
      id: 1,
      name: "Sony FX9 6K Full Frame",
      brand: "SONY",
      price: 850,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    },
    {
      id: 2,
      name: "Zeiss Supreme Prime Set",
      brand: "ZEISS",
      price: 2200,
      image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80",
    },
    {
      id: 3,
      name: "Aputure 600D Pro",
      brand: "APUTURE",
      price: 600,
      image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80",
    },
    {
      id: 4,
      name: "Canon C300 Mark III",
      brand: "CANON",
      price: 950,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80",
    },
    {
      id: 5,
      name: "DZO Pictor Zoom Set",
      brand: "DZO",
      price: 1500,
      image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&q=80",
    },
    {
      id: 6,
      name: "RED Komodo 6K",
      brand: "RED",
      price: 1000,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    },
    {
      id: 7,
      name: "Godox AD600 Pro II",
      brand: "GODOX",
      price: 400,
      image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80",
    },
    {
      id: 8,
      name: "Blackmagic Pyxis 6K",
      brand: "BLACKMAGIC",
      price: 900,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    },
  ];

  // Hero slides auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Testimonials auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev === 0 ? 3 : 0));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(testimonialIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[400px] overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, i) => (
            <img
              key={i}
              src={slide.image}
              alt={slide.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                i === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
        </div>

        {/* Content */}
        <div className="relative z-10 container h-full flex items-center px-4">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="w-12 h-1 bg-[oklch(0.45_0.25_25)]" />
              <span className="text-[oklch(0.45_0.25_25)] text-base uppercase tracking-widest font-bold">
                Locadora de equipamentos audiovisuais em São Paulo
              </span>
            </div>

            {heroSlides.map((slide, i) => (
              <div
                key={i}
                className={`transition-all duration-700 ${
                  i === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute"
                }`}
              >
                {i === currentSlide && (
                  <>
                    <h1
                      className="font-bold text-white leading-none mb-4 whitespace-pre-line"
                      style={{ fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: "-0.01em" }}
                    >
                      {slide.title}
                    </h1>
                    <p className="text-[oklch(0.7_0_0)] text-lg mb-8 max-w-md">{slide.subtitle}</p>
                    <a
                      href="/catalogo"
                      className="inline-block px-8 py-3 bg-[oklch(0.45_0.25_25)] text-white rounded hover:bg-[oklch(0.5_0.25_25)] transition font-semibold"
                    >
                      Ver Catálogo
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/catalogo`}
                className="group relative overflow-hidden rounded-lg aspect-square bg-[oklch(0.15_0_0)] hover:bg-[oklch(0.2_0_0)] transition border border-[oklch(0.2_0_0)] hover:border-[oklch(0.45_0.25_25)]"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-white font-bold text-lg group-hover:text-[oklch(0.45_0.25_25)] transition">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-[oklch(0.1_0_0)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[oklch(0.12_0_0)] rounded-lg overflow-hidden hover:bg-[oklch(0.15_0_0)] transition border border-[oklch(0.2_0_0)] hover:border-[oklch(0.45_0.25_25)]"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-[oklch(0.45_0.25_25)] text-xs uppercase tracking-widest font-semibold mb-2">
                    {product.brand}
                  </p>
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-[oklch(0.8_0_0)] font-bold">
                    R$ {product.price.toFixed(2)}
                    <span className="text-xs text-[oklch(0.45_0_0)] font-normal">/dia</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">O que nossos clientes dizem</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {getVisibleTestimonials().map((testimonial, i) => (
              <div
                key={i}
                className="bg-[oklch(0.12_0_0)] rounded-lg p-6 border border-[oklch(0.2_0_0)] hover:border-[oklch(0.3_0_0)] transition flex flex-col items-center text-center"
              >
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full border-2 border-white mb-4"
                />
                <h3 className="text-white font-semibold mb-1">{testimonial.name}</h3>
                <p className="text-[oklch(0.45_0.25_25)] text-sm mb-4">{testimonial.role}</p>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-white text-white" />
                  ))}
                </div>

                <p className="text-[oklch(0.7_0_0)] text-sm leading-relaxed">{testimonial.text}</p>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setTestimonialIndex(0)}
              className={`w-2 h-2 rounded-full transition ${
                testimonialIndex === 0 ? "bg-white" : "bg-[oklch(0.3_0_0)] hover:bg-white"
              }`}
            />
            <button
              onClick={() => setTestimonialIndex(3)}
              className={`w-2 h-2 rounded-full transition ${
                testimonialIndex === 3 ? "bg-white" : "bg-[oklch(0.3_0_0)] hover:bg-white"
              }`}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[oklch(0.1_0_0)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Pronto para começar?</h2>
          <p className="text-[oklch(0.7_0_0)] text-lg mb-8">
            Entre em contato conosco para solicitar um orçamento ou agendar uma visita
          </p>
          <a
            href="https://wa.me/message/WOIONHHSTABQF1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-[oklch(0.45_0.25_25)] text-white rounded hover:bg-[oklch(0.5_0.25_25)] transition font-semibold"
          >
            Enviar Mensagem no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
