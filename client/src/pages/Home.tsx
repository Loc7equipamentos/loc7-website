import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black text-white">
      {/* HERO */}
      <section className="relative min-h-screen flex items-end md:items-center justify-center md:justify-start text-center md:text-left px-6 pb-16 md:pb-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video-expedicao-loc7.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />

        <div
          className={`max-w-4xl relative z-10 transition-all duration-700 ease-out ${
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h1 className="font-bold leading-[0.95] tracking-tight">
            <span className="block text-gray-300 text-xl md:text-2xl font-medium mb-1">
              LOCADORA DE
            </span>

            <span className="block text-white text-5xl md:text-7xl font-extrabold leading-[0.95]">
              EQUIPAMENTOS
            </span>

            <span className="block text-white text-5xl md:text-7xl font-extrabold leading-[0.95]">
              AUDIOVISUAIS
            </span>

            <span className="block text-gray-400 text-lg md:text-xl font-medium mt-1">
              EM SÃO PAULO
            </span>
          </h1>

          <p className="mt-3 text-lg md:text-xl text-gray-400 max-w-xl leading-snug">
            Equipamentos prontos para produção, com agilidade e suporte técnico real.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
            <button
              onClick={() => navigate("/catalogo")}
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
              Ver equipamentos
            </button>

            <button
              onClick={() => navigate("/orcamento")}
              className="border border-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Solicitar orçamento
            </button>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Equipamentos em destaque
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900 mb-4 hover:scale-[1.02] transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=450&q=80"
                  alt="Câmera profissional"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold">Câmeras Cinema</h3>
              <p className="text-gray-400 mt-2">RED, Sony, Canon e Blackmagic</p>
            </div>

            <div className="group">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900 mb-4 hover:scale-[1.02] transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&h=450&q=80"
                  alt="Lentes profissionais"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold">Lentes Premium</h3>
              <p className="text-gray-400 mt-2">Zeiss, Leitz, DZO e Anamórficas</p>
            </div>

            <div className="group">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900 mb-4 hover:scale-[1.02] transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&h=450&q=80"
                  alt="Iluminação profissional"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="text-xl font-semibold">Iluminação LED</h3>
              <p className="text-gray-400 mt-2">Aputure, Godox e Nanlite</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS DE LOCAÇÃO */}
      <section className="py-20 bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Categorias de locação
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <button
              onClick={() => navigate("/catalogo/cameras")}
              className="p-6 bg-black border border-gray-800 rounded-2xl hover:border-white hover:bg-gray-900 hover:scale-[1.02] transition text-left"
            >
              <h3 className="text-xl font-semibold mb-2">Câmeras</h3>
              <p className="text-gray-400">12+ equipamentos</p>
            </button>

            <button
              onClick={() => navigate("/catalogo/lentes")}
              className="p-6 bg-black border border-gray-800 rounded-2xl hover:border-white hover:bg-gray-900 hover:scale-[1.02] transition text-left"
            >
              <h3 className="text-xl font-semibold mb-2">Lentes</h3>
              <p className="text-gray-400">25+ equipamentos</p>
            </button>

            <button
              onClick={() => navigate("/catalogo/iluminacao")}
              className="p-6 bg-black border border-gray-800 rounded-2xl hover:border-white hover:bg-gray-900 hover:scale-[1.02] transition text-left"
            >
              <h3 className="text-xl font-semibold mb-2">Iluminação</h3>
              <p className="text-gray-400">18+ equipamentos</p>
            </button>

            <button
              onClick={() => navigate("/catalogo/audio")}
              className="p-6 bg-black border border-gray-800 rounded-2xl hover:border-white hover:bg-gray-900 hover:scale-[1.02] transition text-left"
            >
              <h3 className="text-xl font-semibold mb-2">Áudio</h3>
              <p className="text-gray-400">15+ equipamentos</p>
            </button>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Por que escolher a Loc7
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Equipamentos prontos para set</h3>
              <p className="text-gray-400">
                Marcas de referência mundial em cinema e broadcast, testados e calibrados
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Curadoria técnica especializada</h3>
              <p className="text-gray-400">
                Equipe experiente para consultoria, setup e suporte durante produção
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Atendimento consultivo real</h3>
              <p className="text-gray-400">
                Entrega rápida em São Paulo e região, com logística dedicada
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Agilidade na operação</h3>
              <p className="text-gray-400">
                Preços competitivos com melhor custo-benefício do mercado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EM OPERAÇÃO */}
      <section className="py-20 bg-gray-950 border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Em operação
          </h2>

          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Em operação em grandes produções nacionais
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900 relative group hover:scale-[1.02] transition duration-300">
              <img
                src="/the-voice.webp"
                alt="The Voice Brasil"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 text-[11px] text-white/90 tracking-wide uppercase z-10 font-medium">
                THE VOICE BRASIL
              </div>
            </div>

            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900 relative group hover:scale-[1.02] transition duration-300">
              <img
                src="/esquadrao-moda.png"
                alt="SBT Esquadrão da Moda"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 text-[11px] text-white/90 tracking-wide uppercase z-10 font-medium">
                SBT — ESQUADRÃO DA MODA
              </div>
            </div>

            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900 relative group hover:scale-[1.02] transition duration-300">
              <img
                src="/bbb.webp"
                alt="Big Brother Brasil"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 text-[11px] text-white/90 tracking-wide uppercase z-10 font-medium">
                BBB
              </div>
            </div>

            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900 relative group hover:scale-[1.02] transition duration-300">
              <img
                src="/operacao.webp"
                alt="Band Pesadelo na Cozinha"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 text-[11px] text-white/90 tracking-wide uppercase z-10 font-medium">
                BAND — PESADELO NA COZINHA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUÇÃO */}
      <section className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900 hover:scale-[1.02] transition duration-300">
            <img
              src="/operacao.webp"
              alt="Produção completa"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Produção completa
            </h2>

            <p className="text-gray-400 mb-6">
              Estrutura completa com equipe técnica e soluções personalizadas para grandes projetos. Desde consultoria até execução final.
            </p>

            <button
              onClick={() => navigate("/producao")}
              className="border border-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition font-semibold"
            >
              Ver produção
            </button>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-white text-black text-center border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Precisa do setup ideal para sua produção?
          </h2>

          <p className="text-gray-600 mb-8 text-lg">
            Fale com nossa equipe e monte seu setup ideal.
          </p>

          <button
            onClick={() => navigate("/orcamento")}
            className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Solicitar orçamento
          </button>
        </div>
      </section>
    </div>
  );
}
