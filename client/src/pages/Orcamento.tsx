/*
 * LOC 7 — Página de Orçamento
 * Cinema Noir Industrial style
 * Carrinho de orçamento + textarea + WhatsApp
 */

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import { Trash2, ArrowLeft } from "lucide-react";

const WHATSAPP_NUMBER = "5511997237850";

export default function Orcamento() {
  const { items, removeItem, clearCart, total } = useCart();
  const [obs, setObs] = useState("");

  function gerarMensagem() {
    let texto = "Olá! Gostaria de orçar os seguintes equipamentos:\n\n";

    items.forEach((item, index) => {
      texto += `${index + 1}. ${item.name} - R$ ${item.price.toLocaleString('pt-BR')},00/dia\n`;
    });

    texto += `\n*Total diário: R$ ${total.toLocaleString('pt-BR')},00*\n`;

    if (obs.trim()) {
      texto += `\n*Detalhes do projeto:*\n${obs}`;
    }

    return encodeURIComponent(texto);
  }

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${gerarMensagem()}`;

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* Header */}
      <div className="bg-[oklch(0.06_0_0)] border-b border-[oklch(0.15_0_0)] py-10">
        <div className="container">
          <span className="loc7-section-title text-lg">ORÇAMENTO</span>
          <div className="loc7-red-line" />
        </div>
      </div>

      <div className="container py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display font-bold text-[oklch(0.3_0_0)] text-2xl uppercase tracking-widest mb-4">
              Seu orçamento está vazio
            </p>
            <p className="text-[oklch(0.5_0_0)] text-base mb-8">
              Adicione equipamentos do catálogo para gerar um orçamento
            </p>
            <Link href="/catalogo" className="loc7-btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de itens */}
            <div className="lg:col-span-2">
              <div className="bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] rounded-lg overflow-hidden">
                <div className="bg-[oklch(0.12_0_0)] border-b border-[oklch(0.18_0_0)] p-4">
                  <h2 className="font-display font-bold text-white uppercase tracking-wide">
                    Equipamentos ({items.length})
                  </h2>
                </div>

                <div className="divide-y divide-[oklch(0.15_0_0)]">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="p-4 flex items-center justify-between hover:bg-[oklch(0.12_0_0)] transition-colors">
                      <div className="flex-1">
                        <p className="text-white font-semibold mb-1">{item.name}</p>
                        <p className="text-[oklch(0.5_0_0)] text-sm">
                          {item.category} • R$ {item.price.toLocaleString('pt-BR')},00/dia
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-4 p-2 hover:bg-[oklch(0.45_0.25_25)]/20 rounded transition-colors text-[oklch(0.45_0.25_25)] hover:text-[oklch(0.45_0.25_25)]"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Textarea de observações */}
              <div className="mt-8">
                <label className="block text-white font-display font-semibold uppercase tracking-wide mb-3">
                  Detalhes do Projeto (Opcional)
                </label>
                <textarea
                  placeholder="Ex: Preciso de 2 baterias extras, lente 50mm, cabo SDI 10m, gravação externa, diária de 3 dias..."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  className="w-full bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] text-white placeholder:text-[oklch(0.3_0_0)] p-4 rounded focus:outline-none focus:border-[oklch(0.45_0.25_25)] resize-none h-32"
                />
              </div>
            </div>

            {/* Resumo e CTA */}
            <div className="lg:col-span-1">
              <div className="bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)] rounded-lg p-6 sticky top-24">
                <h3 className="font-display font-bold text-white uppercase tracking-wide mb-6">
                  Resumo
                </h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-[oklch(0.18_0_0)]">
                  <div className="flex justify-between text-[oklch(0.6_0_0)] text-sm">
                    <span>Itens:</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total/dia:</span>
                    <span className="text-[oklch(0.45_0.25_25)]">
                      R$ {total.toLocaleString('pt-BR')},00
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="loc7-btn-primary w-full text-center py-3 flex items-center justify-center gap-2 font-display font-semibold uppercase tracking-wide"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Enviar Orçamento
                  </a>

                  <button
                    onClick={() => clearCart()}
                    className="w-full bg-[oklch(0.15_0_0)] hover:bg-[oklch(0.18_0_0)] text-white py-3 rounded font-display font-semibold uppercase tracking-wide transition-colors"
                  >
                    Limpar Orçamento
                  </button>

                  <Link
                    href="/catalogo"
                    className="w-full bg-[oklch(0.12_0_0)] hover:bg-[oklch(0.15_0_0)] text-white py-3 rounded font-display font-semibold uppercase tracking-wide transition-colors text-center block"
                  >
                    Adicionar Mais
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
