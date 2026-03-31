/*
 * LOC 7 — Sobre Page
 * Cinema Noir Industrial style
 * About the company, team, values
 */

import { Link } from "wouter";
import { ArrowRight, Award, Users, Package, MapPin } from "lucide-react";

const ABOUT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/about-section-6t4vsfoEi8VscrkczqbQpH.webp";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* Header */}
      <div className="bg-[oklch(0.06_0_0)] border-b border-[oklch(0.15_0_0)] py-10">
        <div className="container">
          <span className="loc7-section-title text-lg">SOBRE NÓS</span>
          <div className="loc7-red-line" />
          <p className="text-[oklch(0.5_0_0)] text-sm mt-3">
            Conheça a Loc 7 Equipamentos
          </p>
        </div>
      </div>

      <div className="container py-16">
        {/* Main about */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="font-display font-bold text-white text-3xl md:text-4xl uppercase leading-tight mb-6">
              EQUIPAMENTOS PROFISSIONAIS<br />
              <span className="text-[oklch(0.45_0.25_25)]">PARA GRANDES PRODUÇÕES</span>
            </h2>
            <p className="text-[oklch(0.65_0_0)] leading-relaxed mb-4">
              A Loc 7 Equipamentos nasceu da paixão pelo cinema e pela fotografia profissional. Fundada em São Paulo, nos tornamos referência em locação de equipamentos audiovisuais de alta performance para o mercado brasileiro.
            </p>
            <p className="text-[oklch(0.65_0_0)] leading-relaxed mb-4">
              Nossa missão é democratizar o acesso a equipamentos de cinema de alto nível, permitindo que diretores, cinegrafistas e produtores realizem seus projetos com a melhor tecnologia disponível, sem precisar investir em equipamentos próprios.
            </p>
            <p className="text-[oklch(0.65_0_0)] leading-relaxed mb-8">
              Com um catálogo constantemente atualizado com os lançamentos mais recentes do mercado, oferecemos câmeras cinema, lentes premium, iluminação profissional, áudio, monitores e muito mais para produções de todos os tamanhos.
            </p>
            <Link href="/contato" className="loc7-btn-primary inline-flex items-center gap-2">
              Entre em Contato <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="relative">
            <img
              src={ABOUT_IMG}
              alt="Estúdio Loc 7"
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="absolute inset-0 border border-[oklch(0.45_0.25_25)] -translate-x-3 -translate-y-3 pointer-events-none" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { icon: Package, num: "500+", label: "Equipamentos no Catálogo" },
            { icon: Users, num: "1000+", label: "Produções Realizadas" },
            { icon: Award, num: "5★", label: "Avaliação Média" },
            { icon: MapPin, num: "SP", label: "São Paulo, Brasil" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] p-6 text-center hover:border-[oklch(0.45_0.25_25)] transition-all">
                <Icon className="w-8 h-8 text-[oklch(0.45_0.25_25)] mx-auto mb-3" />
                <p className="font-display font-bold text-white text-3xl mb-1">{stat.num}</p>
                <p className="text-[oklch(0.5_0_0)] text-xs uppercase tracking-widest">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="mb-10">
            <span className="loc7-section-title text-base">NOSSOS VALORES</span>
            <div className="loc7-red-line" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Qualidade",
                desc: "Todos os equipamentos passam por rigorosa inspeção antes e após cada locação. Garantimos que você receberá equipamentos em perfeito estado de funcionamento.",
              },
              {
                title: "Agilidade",
                desc: "Processo de reserva simplificado e entrega rápida. Sabemos que produções têm prazos apertados e estamos preparados para atender com eficiência.",
              },
              {
                title: "Expertise",
                desc: "Nossa equipe é formada por profissionais com experiência em produção audiovisual. Oferecemos consultoria técnica para ajudá-lo a escolher o equipamento ideal.",
              },
            ].map((val, i) => (
              <div key={i} className="bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] p-6 hover:border-[oklch(0.45_0.25_25)] transition-all">
                <div className="w-10 h-10 border border-[oklch(0.45_0.25_25)] flex items-center justify-center mb-4">
                  <span className="font-display font-bold text-[oklch(0.45_0.25_25)] text-lg">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="font-display font-bold text-white text-lg uppercase tracking-wide mb-3">{val.title}</h3>
                <p className="text-[oklch(0.6_0_0)] text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brands we carry */}
        <div className="mb-20">
          <div className="mb-10">
            <span className="loc7-section-title text-base">MARCAS QUE TRABALHAMOS</span>
            <div className="loc7-red-line" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {["SONY", "CANON", "RED", "ARRI", "BLACKMAGIC", "APUTURE", "ZEISS", "DJI", "GODOX", "RODE", "TILTA", "SMALLHD"].map(brand => (
              <div key={brand} className="bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] p-4 flex items-center justify-center hover:border-[oklch(0.45_0.25_25)] transition-all">
                <span className="font-display font-bold text-[oklch(0.4_0_0)] hover:text-white transition-colors text-sm uppercase tracking-widest">{brand}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[oklch(0.45_0.25_25)] p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 11px)' }} />
          <div className="relative z-10">
            <h3 className="font-display font-bold text-white text-3xl uppercase tracking-wide mb-3">
              PRONTO PARA TRABALHAR COM A LOC 7?
            </h3>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Solicite um orçamento agora e descubra como podemos elevar a qualidade da sua próxima produção.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://wa.me/message/WOIONHHSTABQF1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[oklch(0.45_0.25_25)] font-display font-bold uppercase tracking-widest px-8 py-4 hover:bg-[oklch(0.95_0_0)] transition-colors"
              >
                Solicitar Orçamento
              </a>
              <Link href="/catalogo" className="border-2 border-white text-white font-display font-bold uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-[oklch(0.45_0.25_25)] transition-colors">
                Ver Catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
