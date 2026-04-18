import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function Producao() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-12 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full -mr-48 -mt-48 opacity-40 hidden md:block" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-50 rounded-full -ml-32 -mb-32 opacity-60 hidden md:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* TEXT CONTENT */}
            <div className="flex flex-col justify-center">
              <div className="mb-6 flex items-center gap-3">
                <span className="w-12 h-1 bg-black" />
                <span className="text-xs uppercase tracking-widest font-semibold text-gray-700">
                  Produção Audiovisual Profissional
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Sua produção, nossa estrutura.
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                Equipamentos de cinema, estúdio e transmissão. Suporte técnico completo. Soluções integradas para produtoras, agências e marcas.
              </p>

              {/* CTA BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Tenho interesse em soluções de produção audiovisual."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  Solicitar Orçamento
                </a>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-all duration-300"
                >
                  Ver Equipamentos
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* TRUST INDICATORS */}
              <div className="pt-8 border-t border-gray-200">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">
                  Confiado por
                </p>
                <div className="flex flex-wrap gap-6">
                  <div className="text-sm text-gray-600">
                    <p className="font-bold text-gray-900">500+</p>
                    <p className="text-xs">Produções realizadas</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-bold text-gray-900">15+</p>
                    <p className="text-xs">Anos de experiência</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-bold text-gray-900">24/7</p>
                    <p className="text-xs">Suporte técnico</p>
                  </div>
                </div>
              </div>
            </div>

            {/* IMAGE CONTENT */}
            <div className="relative h-96 md:h-[500px] flex items-center justify-center">
              {/* Image container with premium styling */}
              <div className="relative w-full h-full">
                {/* Background frame effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-50 rounded-2xl" />
                
                {/* Main image */}
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/DSC00051_brightened_029b14bf.webp"
                  alt="Equipamento de produção audiovisual profissional"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />

                {/* Overlay accent */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

                {/* Corner accent */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-black rounded-full opacity-5" />
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-gray-300 rounded-full opacity-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      </section>
    </div>
   );
}
