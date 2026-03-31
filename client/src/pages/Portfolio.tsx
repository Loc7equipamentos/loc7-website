/*
 * LOC 7 — Portfólio Page
 * Cinema Noir Industrial style
 * Cases de sucesso e depoimentos
 */

import { useState } from "react";
import { Star, Play, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const portfolioCategories = ["Todos", "Publicidade", "Cinema", "Documentário", "Corporativo", "Eventos"];

const cases = [
  {
    id: 1,
    title: "Campanha Publicitária — Marca Premium",
    client: "Agência XYZ",
    category: "Publicidade",
    equipment: ["Sony FX9", "Zeiss Supreme Primes", "Aputure 600d"],
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    hasVideo: true,
    description: "Produção de campanha publicitária para marca de luxo, utilizando câmera Sony FX9 com lentes Zeiss Supreme para look cinematográfico premium.",
  },
  {
    id: 2,
    title: "Curta-Metragem — Festival de Cinema SP",
    client: "Produtora Independente",
    category: "Cinema",
    equipment: ["RED Komodo 6K", "DZO Pictor Zoom Set", "Aputure Storm 700x"],
    img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    hasVideo: false,
    description: "Curta-metragem premiado no Festival de Cinema de São Paulo, rodado em 6K com lentes DZO para look orgânico e cinematográfico.",
  },
  {
    id: 3,
    title: "Documentário — Série Streaming",
    client: "Plataforma de Streaming",
    category: "Documentário",
    equipment: ["Canon C300 Mark III", "Canon RF Primes", "DJI RS 4 Pro"],
    img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80",
    hasVideo: true,
    description: "Série documental para plataforma de streaming, com gravações em múltiplas locações em São Paulo e interior do estado.",
  },
  {
    id: 4,
    title: "Vídeo Institucional — Empresa Fortune 500",
    client: "Multinacional",
    category: "Corporativo",
    equipment: ["Sony A7V", "Sony GM Primes", "Godox AD600"],
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    hasVideo: false,
    description: "Vídeo institucional para empresa multinacional, com entrevistas e b-roll em ambiente corporativo.",
  },
  {
    id: 5,
    title: "Cobertura de Evento — Conferência Internacional",
    client: "Organizadora de Eventos",
    category: "Eventos",
    equipment: ["Blackmagic Pyxis 6K", "Canon RF Zoom", "Rode Wireless Pro"],
    img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    hasVideo: true,
    description: "Cobertura completa de conferência internacional com múltiplas câmeras e transmissão ao vivo.",
  },
  {
    id: 6,
    title: "Clipe Musical — Artista Independente",
    client: "Gravadora Independente",
    category: "Cinema",
    equipment: ["RED Komodo 6K", "Leitz Cine Hektor Set", "Aputure 1200d"],
    img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&q=80",
    hasVideo: true,
    description: "Clipe musical com estética cinematográfica, utilizando lentes vintage Leitz para look artístico único.",
  },
];

const testimonials = [
  {
    name: "Rafael Mendes",
    role: "Diretor de Fotografia",
    company: "Produtora Lumina",
    text: "A Loc 7 tem sido minha parceira em todas as produções. Equipamentos sempre em perfeito estado, atendimento ágil e preços competitivos. Indispensável para qualquer projeto audiovisual em SP.",
    stars: 5,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    name: "Ana Beatriz Costa",
    role: "Produtora Executiva",
    company: "Studio ABC",
    text: "Processo de locação super ágil, catálogo incrível e equipe muito prestativa. A Loc 7 entende as necessidades de produção e sempre tem a solução certa.",
    stars: 5,
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80q=80",
  },
  {
    name: "Carlos Eduardo Silva",
    role: "Videomaker",
    company: "CE Films",
    text: "Desde que descobri a Loc 7, não preciso mais me preocupar com equipamentos. Sempre encontro o que preciso, com qualidade garantida e suporte técnico excepcional.",
    stars: 5,
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  },
];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filtered = cases.filter(c =>
    selectedCategory === "Todos" || c.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* Header */}
      <div className="bg-[oklch(0.06_0_0)] border-b border-[oklch(0.15_0_0)] py-10">
        <div className="container">
          <span className="loc7-section-title text-lg">PORTFÓLIO</span>
          <div className="loc7-red-line" />
          <p className="text-[oklch(0.5_0_0)] text-sm mt-3">
            Cases de sucesso e produções realizadas com nossos equipamentos
          </p>
        </div>
      </div>

      <div className="container py-10">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10">
          {portfolioCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 text-xs px-4 py-2 border transition-all font-display font-semibold uppercase tracking-widest ${selectedCategory === cat ? 'bg-[oklch(0.45_0.25_25)] border-[oklch(0.45_0.25_25)] text-white' : 'border-[oklch(0.22_0_0)] text-[oklch(0.6_0_0)] hover:border-white hover:text-white bg-transparent'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cases grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((item) => (
            <div key={item.id} className="group bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300 overflow-hidden">
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-transform duration-700 brightness-60 group-hover:brightness-75"
                />
                <div className="absolute top-3 left-3">
                  <span className="loc7-category-badge">{item.category}</span>
                </div>
                {item.hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-[oklch(0.45_0.25_25)]/80 rounded-full flex items-center justify-center group-hover:bg-[oklch(0.45_0.25_25)] transition-colors">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-[oklch(0.45_0.25_25)] text-[0.65rem] uppercase tracking-widest font-display font-semibold mb-1">{item.client}</p>
                <h3 className="font-display font-bold text-white text-base uppercase leading-tight mb-3">{item.title}</h3>
                <p className="text-[oklch(0.55_0_0)] text-sm leading-relaxed mb-4 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.equipment.map(eq => (
                    <span key={eq} className="text-[0.6rem] text-[oklch(0.6_0_0)] border border-[oklch(0.22_0_0)] px-2 py-0.5 font-mono-price">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="mb-8">
            <span className="loc7-section-title text-base">DEPOIMENTOS</span>
            <div className="loc7-red-line" />
            <p className="text-[oklch(0.5_0_0)] text-sm mt-3">O que nossos clientes dizem</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] p-6 hover:border-[oklch(0.45_0.25_25)] transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[oklch(0.45_0.25_25)] fill-current" />
                  ))}
                </div>
                <p className="text-[oklch(0.7_0_0)] text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-[oklch(0.18_0_0)] pt-4">
                  <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover grayscale" />
                  <div>
                    <p className="font-display font-semibold text-white text-sm uppercase tracking-wide">{t.name}</p>
                    <p className="text-[oklch(0.45_0.25_25)] text-xs">{t.role} — {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] p-10 text-center">
          <h3 className="font-display font-bold text-white text-2xl uppercase tracking-wide mb-3">
            QUER FAZER PARTE DO NOSSO PORTFÓLIO?
          </h3>
          <p className="text-[oklch(0.6_0_0)] mb-6 max-w-lg mx-auto">
            Alugue nossos equipamentos para sua próxima produção e junte-se a centenas de profissionais que confiam na Loc 7.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/catalogo" className="loc7-btn-primary flex items-center gap-2">
              Ver Catálogo <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/message/WOIONHHSTABQF1"
              target="_blank"
              rel="noopener noreferrer"
              className="loc7-btn-outline flex items-center gap-2"
            >
              Solicitar Orçamento
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
