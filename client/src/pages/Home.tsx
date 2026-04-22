/*
 * LOC 7 — Home Page
 * Hero refinado para linguagem premium/broadcast
 * Estrutura preservada + hero ajustado
 */

import { useState, useEffect } from "react";
import { Star, Play, X } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

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
    <div className="min-h-screen bg-[oklch(0.08_0_0)] pointer-events-auto">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-black">
        {/* Vídeo de fundo */}
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            src="/hero-primo.mp4"
            poster="/hero-primo-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        {/* Overlay principal */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Gradientes para leitura premium */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_32%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.74)_40%,rgba(0,0,0,0.50)_68%,rgba(0,0,0,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.18)_22%,rgba(0,0,0,0.44)_100%)]" />

        {/* Grid sutil */}
        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 pb-16 pt-32 sm:px-6 md:px-8 md:pt-36 lg:px-10 lg:pt-40">
          <div className="w-full max-w-4xl">
            {/* Kicker */}
            <div className="mb-7">
              <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-white/58 sm:text-[11px] md:text-xs">
                CINE • FOTO • BROADCAST
              </p>
            </div>

            {/* Headline hierárquica */}
            <div className="max-w-[980px]">
              <div className="text-white">
                <div className="mb-1 sm:mb-2">
                  <span className="block text-[0.78rem] font-medium uppercase tracking-[0.38em] text-white/74 sm:text-[0.86rem] md:text-[0.96rem]">
                    LOCADORA DE
                  </span>
                </div>

                <div className="leading-[0.90]">
                  <span className="block text-[2.9rem] font-semibold tracking-[-0.06em] text-white sm:text-[4.25rem] md:text-[5.4rem] lg:text-[6.1rem] xl:text-[6.55rem]">
                    EQUIPAMENTOS
                  </span>
                </div>

                <div className="mt-1 leading-[0.92] sm:mt-2">
                  <span className="block text-[2.05rem] font-semibold tracking-[-0.05em] text-white/92 sm:text-[3rem] md:text-[4rem] lg:text-[4.75rem] xl:text-[5rem]">
                    AUDIOVISUAIS
                  </span>
                </div>

                <div className="mt-2 sm:mt-3">
                  <span className="block text-[0.84rem] font-normal uppercase tracking-[0.26em] text-white/66 sm:text-[0.94rem] md:text-[1.04rem]">
                    EM SÃO PAULO
                  </span>
                </div>
              </div>
            </div>

            {/* Linha institucional */}
            <div className="mt-8 max-w-2xl">
              <p className="text-base font-light leading-relaxed text-white/78 sm:text-[1.05rem] md:text-[1.14rem]">
                Estrutura, acervo e operação técnica para produções que exigem precisão de set,
                agilidade de atendimento e padrão profissional de entrega.
              </p>
            </div>

            {/* Assinatura */}
            <div className="mt-8">
              <p className="text-[0.98rem] font-normal tracking-[0.01em] text-white/82 md:text-[1.05rem]">
                No set, nada é detalhe.
              </p>
            </div>

            {/* Ações */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => setIsVideoOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/18 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:border-white/28 hover:bg-white/16"
              >
                <Play className="h-4 w-4" />
                Ver operação
              </button>

              <button
                onClick={() => navigate("/catalogo")}
                className="inline-flex items-center justify-center rounded-sm border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-black"
              >
                Ver catálogo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de vídeo */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 p-4 pointer-events-auto">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-12 right-0 text-white transition hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <video
              src="/hero-primo.mp4"
              poster="/hero-primo-poster.jpg"
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Categories Section */}
      <section className="bg-[oklch(0.08_0_0)] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Categorias</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/catalogo`}
                className="group relative aspect-square overflow-hidden rounded-lg border border-[oklch(0.2_0_0)] bg-[oklch(0.15_0_0)] transition hover:border-[oklch(0.45_0.25_25)] hover:bg-[oklch(0.2_0_0)]"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white transition group-hover:text-[oklch(0.45_0.25_25)]">
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
      <section className="bg-[oklch(0.1_0_0)] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Produtos em Destaque</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-lg border border-[oklch(0.2_0_0)] bg-[oklch(0.12_0_0)] transition hover:border-[oklch(0.45_0.25_25)] hover:bg-[oklch(0.15_0_0)]"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[oklch(0.45_0.25_25)]">
                    {product.brand}
                  </p>
                  <h3 className="mb-2 line-clamp-2 font-semibold text-white">{product.name}</h3>
                  <p className="font-bold text-[oklch(0.8_0_0)]">
                    R$ {product.price.toFixed(2)}
                    <span className="text-xs font-normal text-[oklch(0.45_0_0)]">/dia</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[oklch(0.08_0_0)] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">O que nossos clientes dizem</h2>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {getVisibleTestimonials().map((testimonial, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-lg border border-[oklch(0.2_0_0)] bg-[oklch(0.12_0_0)] p-6 text-center transition hover:border-[oklch(0.3_0_0)]"
              >
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="mb-4 h-16 w-16 rounded-full border-2 border-white"
                />
                <h3 className="mb-1 font-semibold text-white">{testimonial.name}</h3>
                <p className="mb-4 text-sm text-[oklch(0.45_0.25_25)]">{testimonial.role}</p>

                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-5 w-5 fill-white text-white" />
                  ))}
                </div>

                <p className="text-sm leading-relaxed text-[oklch(0.7_0_0)]">{testimonial.text}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => setTestimonialIndex(0)}
              className={`h-2 w-2 rounded-full transition ${
                testimonialIndex === 0 ? "bg-white" : "bg-[oklch(0.3_0_0)] hover:bg-white"
              }`}
            />
            <button
              onClick={() => setTestimonialIndex(3)}
              className={`h-2 w-2 rounded-full transition ${
                testimonialIndex === 3 ? "bg-white" : "bg-[oklch(0.3_0_0)] hover:bg-white"
              }`}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[oklch(0.1_0_0)] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">Pronto para começar?</h2>
          <p className="mb-8 text-lg text-[oklch(0.7_0_0)]">
            Entre em contato conosco para solicitar um orçamento ou agendar uma visita
          </p>
          <a
            href="https://wa.me/message/WOIONHHSTABQF1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded bg-[oklch(0.45_0.25_25)] px-8 py-3 font-semibold text-white transition hover:bg-[oklch(0.5_0.25_25)]"
          >
            Enviar Mensagem no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
