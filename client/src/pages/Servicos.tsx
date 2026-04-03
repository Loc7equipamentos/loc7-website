/*
 * LOC 7 — Página Serviços
 * Cinema Noir Industrial style
 * Vídeo 16:9 + Carrossel de produções + Serviços
 */

import { useState, useRef, useEffect } from "react";
import { Truck, Headphones, Users, Zap, Shield, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Truck,
    title: "Entrega e Instalação",
    description: "Entregamos equipamentos em sua locação com instalação técnica completa. Disponível em São Paulo e região metropolitana.",
  },
  {
    icon: Headphones,
    title: "Suporte Técnico 24/7",
    description: "Equipe técnica disponível durante toda a locação para resolver problemas e otimizar seus equipamentos.",
  },
  {
    icon: Users,
    title: "Consultoria de Equipamentos",
    description: "Especialistas em cinema ajudam a escolher os equipamentos ideais para seu projeto e orçamento.",
  },
  {
    icon: Zap,
    title: "Manutenção e Calibração",
    description: "Todos os equipamentos são testados, calibrados e mantidos em perfeito estado antes de cada locação.",
  },
  {
    icon: Shield,
    title: "Seguro e Proteção",
    description: "Cobertura completa de seguro para seus equipamentos durante toda a locação. Proteção contra danos acidentais.",
  },
  {
    icon: Clock,
    title: "Locação Flexível",
    description: "Locações por hora, dia, semana ou mês. Pacotes customizados conforme sua necessidade.",
  },
];

const benefits = [
  "Equipamentos de última geração",
  "Preços competitivos",
  "Atendimento personalizado",
  "Entrega rápida",
  "Suporte técnico especializado",
  "Sem taxas ocultas",
];

const productions = [
  {
    id: 1,
    title: "TV Globo Videogame Verão",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/producao_1_tv_globo_videogame_981c2434.webp",
    description: "Produção completa com câmeras, áudio, luz, movimento e toda equipe operacional",
  },
  {
    id: 2,
    title: "TV Globo Big Brother Brasil",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/producao_2_tv_globo_bbb_39ebfbed.webp",
    description: "Produção completa com câmeras, áudio, luz, movimento e toda equipe operacional",
  },
  {
    id: 3,
    title: "TV Globo The Voice Brasil",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/producao_3_tv_globo_voice_0f3b03bb.webp",
    description: "Produção completa com câmeras, áudio, luz, movimento e toda equipe operacional",
  },
  {
    id: 4,
    title: "Multishow Show Slash",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/producao_4_multishow_slash_fe669ec8.webp",
    description: "Produção completa com câmeras, áudio, luz, movimento e toda equipe operacional",
  },
  {
    id: 5,
    title: "Live Alphabeto",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/producao_5_live_alphabeto_d8e3b0fd.webp",
    description: "Produção completa com câmeras, áudio, luz, movimento e toda equipe operacional",
  },
  {
    id: 6,
    title: "SporTV Futebol",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/producao_6_sportv_futebol_55247cbd.jpg",
    description: "Produção completa com câmeras, áudio, luz, movimento e toda equipe operacional",
  },
];

export default function Servicos() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % productions.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + productions.length) % productions.length);
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-white">
      {/* Hero Section with Video - Full Width */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] border-b border-[oklch(0.15_0_0)]">
        {/* Video Player - Full Width */}
        <div className="relative w-full bg-[oklch(0.12_0_0)] overflow-hidden">
          <video
            width="100%"
            height="auto"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-screen block"
            style={{ aspectRatio: "16 / 9", objectFit: "cover", maxHeight: "100vh" }}
          >
            <source src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/video_servicos_16x9_373937ef.mp4" type="video/mp4" />
            Seu navegador nao suporta o elemento de video.
          </video>
          
          {/* Overlay with Text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center">
            <div className="container">
              <div className="max-w-2xl">
                <h1
                  className="text-4xl md:text-5xl font-semibold mb-6 leading-tight tracking-tight text-white"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Serviços de Produção
                </h1>
                <p className="text-base md:text-lg text-[oklch(0.85_0_0)] mb-8 leading-relaxed max-w-xl">
                  Soluções completas em produção audiovisual. Equipamentos profissionais, equipe especializada e suporte técnico 24/7 para suas produções.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => window.location.href = "https://wa.me/message/WOIONHHSTABQF1"}
                    className="bg-[#25D366] hover:bg-[#20BA5C] text-white font-semibold w-fit"
                  >
                    Solicitar Orçamento
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = "/catalogo"}
                    className="border-white text-white hover:bg-white hover:text-black w-fit"
                  >
                    Ver Catálogo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productions Carousel */}
      <section className="py-20 md:py-32 border-b border-[oklch(0.15_0_0)]">
        <div className="container">
          <h2
            className="text-2xl md:text-3xl font-semibold mb-12 text-center tracking-wide"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Portfolio de Produções
          </h2>

          {/* Carousel Container */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-[oklch(0.18_0_0)]">
              <div
                ref={carouselRef}
                className="flex transition-transform duration-500 ease-out"
              >
                {productions.map((production) => (
                  <div
                    key={production.id}
                    className="w-full flex-shrink-0"
                  >
                    <div className="relative bg-[oklch(0.12_0_0)] aspect-video overflow-hidden">
                      <img
                        src={production.image}
                        alt={production.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                        <h3
                          className="text-xl md:text-2xl font-semibold mb-2"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          {production.title}
                        </h3>
                        <p className="text-sm md:text-base text-[oklch(0.65_0_0)] font-light tracking-wide leading-relaxed">
                          {production.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 opacity-60 hover:opacity-100"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 opacity-60 hover:opacity-100"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {productions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-[#E31010] w-8"
                      : "bg-[oklch(0.3_0_0)] hover:bg-[oklch(0.4_0_0)]"
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32 border-b border-[oklch(0.15_0_0)]">
        <div className="container">
          <h2
            className="text-4xl md:text-5xl font-bold mb-16 text-center"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Nossos Serviços
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-[oklch(0.12_0_0)] border border-[oklch(0.18_0_0)] p-8 hover:border-[#00FF00] transition-all duration-300 group"
                >
                  <div className="mb-4">
                    <Icon className="w-12 h-12 text-[#E31010] group-hover:text-[#00FF00] transition-colors" />
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-[oklch(0.55_0_0)] text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32 border-b border-[oklch(0.15_0_0)]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="text-4xl md:text-5xl font-bold mb-8"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Por que escolher a Loc 7?
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#00FF00] rounded-full" />
                    <span className="text-[oklch(0.6_0_0)]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[oklch(0.12_0_0)] border border-[oklch(0.18_0_0)] p-12 rounded-lg">
              <h3
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Processo Simples
              </h3>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#E31010] text-white font-bold rounded-full flex-shrink-0">
                    1
                  </span>
                  <div>
                    <p className="font-semibold">Entre em contato</p>
                    <p className="text-sm text-[oklch(0.5_0_0)]">
                      Descreva seu projeto e necessidades
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#E31010] text-white font-bold rounded-full flex-shrink-0">
                    2
                  </span>
                  <div>
                    <p className="font-semibold">Receba orçamento</p>
                    <p className="text-sm text-[oklch(0.5_0_0)]">
                      Proposta personalizada em 24 horas
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#E31010] text-white font-bold rounded-full flex-shrink-0">
                    3
                  </span>
                  <div>
                    <p className="font-semibold">Confirme e receba</p>
                    <p className="text-sm text-[oklch(0.5_0_0)]">
                      Entrega e suporte técnico inclusos
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-[oklch(0.1_0_0)] border-b border-[oklch(0.15_0_0)]">
        <div className="container text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Pronto para começar?
          </h2>
          <p className="text-lg text-[oklch(0.6_0_0)] mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e vamos ajudar você a encontrar os equipamentos perfeitos para seu projeto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = "https://wa.me/message/WOIONHHSTABQF1"}
              className="bg-[#25D366] hover:bg-[#20BA5C] text-white font-semibold px-8 py-6 text-lg"
            >
              💬 Fale Conosco via WhatsApp
            </Button>
            <Button
              onClick={() => window.location.href = "/contato"}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg"
            >
              📧 Enviar Email
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
