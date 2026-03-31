/*
 * LOC 7 — Blog Page
 * Cinema Noir Industrial style
 * Blog posts with categories and SEO-optimized content
 */

import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";

const blogCategories = ["Todos", "Câmeras", "Lentes", "Iluminação", "Técnicas", "Equipamentos", "Tendências"];

const posts = [
  {
    id: 1,
    title: "Como escolher a câmera certa para sua produção audiovisual",
    excerpt: "Guia completo para profissionais que precisam selecionar o equipamento ideal entre as opções disponíveis no mercado, desde câmeras cinema até mirrorless.",
    category: "Câmeras",
    date: "20 Mar 2026",
    readTime: "8 min",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    featured: true,
    tags: ["Sony FX9", "RED Komodo", "Cinema"],
  },
  {
    id: 2,
    title: "Guia completo de iluminação para vídeos corporativos",
    excerpt: "Aprenda as técnicas essenciais de iluminação para produzir vídeos corporativos com qualidade profissional, mesmo com orçamento limitado.",
    category: "Iluminação",
    date: "15 Mar 2026",
    readTime: "6 min",
    img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80",
    featured: false,
    tags: ["Aputure", "LED", "Corporativo"],
  },
  {
    id: 3,
    title: "Lentes anamórficas: tudo que você precisa saber antes de alugar",
    excerpt: "Entenda as diferenças entre lentes anamórficas e esféricas, como escolher o ratio correto e quais são as melhores opções para cada tipo de projeto.",
    category: "Lentes",
    date: "10 Mar 2026",
    readTime: "10 min",
    img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&q=80",
    featured: false,
    tags: ["Anamórfico", "Cinema", "Lentes"],
  },
  {
    id: 4,
    title: "RED vs Blackmagic: qual câmera cinema escolher em 2026?",
    excerpt: "Comparativo detalhado entre as duas principais fabricantes de câmeras cinema do mercado, analisando qualidade de imagem, fluxo de trabalho e custo-benefício.",
    category: "Câmeras",
    date: "05 Mar 2026",
    readTime: "12 min",
    img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    featured: false,
    tags: ["RED", "Blackmagic", "Comparativo"],
  },
  {
    id: 5,
    title: "Tendências em produção audiovisual para 2026",
    excerpt: "As principais tendências que estão moldando o mercado audiovisual: vertical video, IA na pós-produção, câmeras de alta resolução e muito mais.",
    category: "Tendências",
    date: "01 Mar 2026",
    readTime: "7 min",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    featured: false,
    tags: ["Tendências", "2026", "Mercado"],
  },
  {
    id: 6,
    title: "Como montar um kit de iluminação profissional para locação",
    excerpt: "Dicas práticas para montar um kit de iluminação versátil e profissional, ideal para diferentes tipos de produção.",
    category: "Iluminação",
    date: "25 Fev 2026",
    readTime: "9 min",
    img: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80",
    featured: false,
    tags: ["Kit", "Iluminação", "Locação"],
  },
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filtered = posts.filter(p =>
    selectedCategory === "Todos" || p.category === selectedCategory
  );

  const featured = filtered.find(p => p.featured);
  const regular = filtered.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* Header */}
      <div className="bg-[oklch(0.06_0_0)] border-b border-[oklch(0.15_0_0)] py-10">
        <div className="container">
          <span className="loc7-section-title text-lg">BLOG</span>
          <div className="loc7-red-line" />
          <p className="text-[oklch(0.5_0_0)] text-sm mt-3">
            Conteúdo especializado para profissionais audiovisuais
          </p>
        </div>
      </div>

      <div className="container py-10">
        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10">
          {blogCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 text-xs px-4 py-2 border transition-all font-display font-semibold uppercase tracking-widest ${selectedCategory === cat ? 'bg-[oklch(0.45_0.25_25)] border-[oklch(0.45_0.25_25)] text-white' : 'border-[oklch(0.22_0_0)] text-[oklch(0.6_0_0)] hover:border-white hover:text-white bg-transparent'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <div className="mb-10">
            <Link href={`/blog/${featured.id}`} className="group block relative overflow-hidden">
              <div className="aspect-[21/9] overflow-hidden">
                <img
                  src={featured.img}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-transform duration-700 brightness-50"
                />
              </div>
              <div className="absolute inset-0 flex items-end p-8 md:p-12">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="loc7-category-badge">{featured.category}</span>
                    <span className="text-[oklch(0.5_0_0)] text-xs font-mono-price flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {featured.date}
                    </span>
                    <span className="text-[oklch(0.5_0_0)] text-xs font-mono-price flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featured.readTime}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-white text-2xl md:text-4xl uppercase leading-tight mb-3 group-hover:text-[oklch(0.45_0.25_25)] transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-[oklch(0.7_0_0)] text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
                    {featured.excerpt}
                  </p>
                  <span className="text-[oklch(0.45_0.25_25)] text-sm font-display font-semibold uppercase tracking-widest flex items-center gap-2">
                    Ler artigo <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regular.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group block bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] hover:border-[oklch(0.45_0.25_25)] transition-all duration-300"
            >
              <div className="overflow-hidden aspect-video">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-transform duration-500 brightness-60 group-hover:brightness-75"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="loc7-category-badge text-[0.6rem]">{post.category}</span>
                  <span className="text-[oklch(0.4_0_0)] text-xs font-mono-price">{post.date}</span>
                </div>
                <h3 className="font-display font-semibold text-white text-base uppercase leading-tight mb-2 group-hover:text-[oklch(0.45_0.25_25)] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[oklch(0.55_0_0)] text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[0.6rem] text-[oklch(0.45_0.25_25)] border border-[oklch(0.45_0.25_25)]/30 px-2 py-0.5 font-mono-price">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-[oklch(0.4_0_0)] text-xs font-mono-price flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* YouTube embed section */}
        <div className="mt-16 bg-[oklch(0.06_0_0)] border border-[oklch(0.15_0_0)] p-8">
          <div className="mb-6">
            <span className="loc7-section-title text-base">CANAL NO YOUTUBE</span>
            <div className="loc7-red-line" />
            <p className="text-[oklch(0.5_0_0)] text-sm mt-3">Conteúdo em vídeo para profissionais audiovisuais</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Review: Sony FX9 — Vale a pena alugar?", videoId: "dQw4w9WgXcQ" },
              { title: "Tutorial: Iluminação para entrevistas corporativas", videoId: "dQw4w9WgXcQ" },
            ].map((video, i) => (
              <div key={i} className="bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] overflow-hidden">
                <div className="aspect-video bg-[oklch(0.08_0_0)] flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[oklch(0.45_0.25_25)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p className="text-[oklch(0.5_0_0)] text-xs">Clique para assistir no YouTube</p>
                  </div>
                  <a
                    href={`https://youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wide">{video.title}</h4>
                  <p className="text-[oklch(0.45_0.25_25)] text-xs mt-1 font-mono-price">Loc 7 Equipamentos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
