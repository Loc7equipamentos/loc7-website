import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden md:justify-start md:text-left">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Video%20expedi%C3%A7%C3%A3o%20Loc7.m4v" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
            LOCADORA DE EQUIPAMENTOS AUDIOVISUAIS EM SÃO PAULO
          </h1>

          <p className="mt-6 text-lg text-gray-300">
            Equipamentos prontos para produção, com agilidade e suporte técnico real.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/catalogo")}
              className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Ver equipamentos
            </button>

            <button
              onClick={() => navigate("/orcamento")}
              className="border border-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition"
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
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
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
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
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
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold">Iluminação LED</h3>
              <p className="text-gray-400 mt-2">Aputure, Godox e Nanlite</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-20 bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Categorias de locação
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Câmeras", path: "/catalogo/cameras" },
              { name: "Lentes", path: "/catalogo/lentes" },
              { name: "Iluminação", path: "/catalogo/iluminacao" },
              { name: "Áudio", path: "/catalogo/audio" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="p-6 bg-black border border-gray-800 rounded-2xl hover:border-white hover:bg-gray-900 hover:scale-[1.02] transition text-left"
              >
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-400">Equipamentos disponíveis</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-20 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          {[
            "Equipamentos prontos para set",
            "Curadoria técnica especializada",
            "Atendimento consultivo real",
            "Agilidade na operação",
          ].map((text) => (
            <div key={text}>
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                🎬
              </div>
              <h3 className="font-semibold">{text}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* EM OPERAÇÃO */}
      <section className="py-20 bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Em operação
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { src: "/the-voice.webp", label: "THE VOICE BRASIL" },
              { src: "/esquadrao-moda.png", label: "SBT — ESQUADRÃO DA MODA" },
              { src: "/bbb.webp", label: "BBB" },
              { src: "/operacao.webp", label: "BAND — PESADELO NA COZINHA" },
            ].map((img) => (
              <div key={img.src} className="aspect-[4/3] overflow-hidden rounded-2xl relative">
                <img src={img.src} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 left-3 text-xs bg-black/60 px-3 py-1 rounded-full">
                  {img.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-black text-center">
        <h2 className="text-3xl font-bold mb-4">
          Precisa do setup ideal?
        </h2>
        <button
          onClick={() => navigate("/orcamento")}
          className="bg-black text-white px-8 py-4 rounded-xl"
        >
          Solicitar orçamento
        </button>
      </section>

    </div>
  );
}
