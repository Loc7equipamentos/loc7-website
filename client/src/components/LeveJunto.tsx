/*
 * LeveJunto Component
 * Cross-sell sugestão de produtos relacionados
 * UI discreta, sem competir com CTA principal
 */

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { getRelacionados } from "@/data/relacionados";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";

interface LeveJuntoProps {
  slug: string;
}

export default function LeveJunto({ slug }: LeveJuntoProps) {
  const { addItem } = useCart();
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState<number | null>(null);

  const items = getRelacionados(slug);

  if (!items.length) return null;

  function handleAddItem(item: typeof items[0]) {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
    });

    // Marcar como adicionado
    setAddedItems([...addedItems, item.id]);
    setShowFeedback(item.id);

    // Toast de sucesso
    toast.success(`${item.name} adicionado!`, {
      description: `R$ ${item.price.toLocaleString("pt-BR")},00/dia`,
      duration: 3000,
    });

    // Remover feedback após 2 segundos
    setTimeout(() => {
      setShowFeedback(null);
    }, 2000);
  }

  return (
    <div className="mt-12 bg-[oklch(0.1_0_0)] border border-[oklch(0.15_0_0)] rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-display font-bold text-white uppercase tracking-wide text-lg mb-1">
          💡 Leve Junto
        </h3>
        <p className="text-[oklch(0.5_0_0)] text-sm">
          Produtos que combinam bem com este equipamento
        </p>
      </div>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.slice(0, 5).map((item) => {
          const isAdded = addedItems.includes(item.id);
          const isFeedback = showFeedback === item.id;

          return (
            <div
              key={item.id}
              className="bg-[oklch(0.12_0_0)] border border-[oklch(0.18_0_0)] rounded p-3 hover:border-[oklch(0.25_0_0)] transition-all"
            >
              {/* Nome e categoria */}
              <div className="mb-3">
                <p className="text-white text-sm font-semibold line-clamp-2 mb-1">
                  {item.name}
                </p>
                <span className="text-[oklch(0.45_0.25_25)] text-xs uppercase font-display font-bold">
                  {item.category}
                </span>
              </div>

              {/* Preço e botão */}
              <div className="flex items-center justify-between">
                <p className="text-[oklch(0.7_0_0)] text-xs">
                  R$ {item.price.toLocaleString("pt-BR")},00
                </p>

                <button
                  onClick={() => handleAddItem(item)}
                  disabled={isAdded}
                  className={`
                    flex items-center gap-1 text-xs px-2 py-1 rounded transition-all
                    ${
                      isFeedback
                        ? "bg-green-600/30 text-green-400 border border-green-600/50"
                        : isAdded
                          ? "bg-[oklch(0.45_0.25_25)]/20 text-[oklch(0.45_0.25_25)] border border-[oklch(0.45_0.25_25)]/30"
                          : "bg-[oklch(0.45_0.25_25)] hover:bg-[oklch(0.5_0.25_25)] text-white border border-[oklch(0.45_0.25_25)]"
                    }
                  `}
                >
                  {isFeedback || isAdded ? (
                    <>
                      <Check className="w-3 h-3" />
                      {isFeedback ? "Adicionado!" : "Adicionado"}
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      Adicionar
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dica */}
      <p className="text-[oklch(0.4_0_0)] text-xs mt-4 italic">
        ℹ️ Todos os itens adicionados vão para seu orçamento
      </p>
    </div>
  );
}
