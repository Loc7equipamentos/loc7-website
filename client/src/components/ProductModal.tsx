import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  badge: string;
  img: string;
  isNew: boolean;
}

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductModal({ product, open, onOpenChange }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  if (!product) return null;

  // Mock gallery images
  const images = [
    product.img,
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
  ];

  // Mock specifications
  const specs = [
    { label: 'Resolução', value: '6K / 4K' },
    { label: 'Sensor', value: 'Full Frame / Super 35' },
    { label: 'Conexões', value: 'HDMI, USB-C, XLR' },
    { label: 'Peso', value: '2.5 kg' },
    { label: 'Bateria', value: '4h de autonomia' },
    { label: 'Garantia', value: '12 meses' },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Generate calendar for next 30 days
  const today = new Date();
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return date;
  });

  const toggleDateSelection = (date: Date) => {
    const dateStr = date.toDateString();
    setSelectedDates(prev => {
      const isSelected = prev.some(d => d.toDateString() === dateStr);
      if (isSelected) {
        return prev.filter(d => d.toDateString() !== dateStr);
      } else {
        return [...prev, date];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[oklch(0.1_0_0)] border-[oklch(0.2_0_0)] p-0">
        <div className="sticky top-0 bg-[oklch(0.1_0_0)] border-b border-[oklch(0.2_0_0)] p-6 flex items-center justify-between z-10">
          <DialogTitle className="text-2xl font-display font-bold text-white">
            {product.name}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-[oklch(0.6_0_0)] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative bg-[oklch(0.08_0_0)] rounded-lg overflow-hidden aspect-video">
              <img
                src={images[currentImageIndex]}
                alt={`${product.name} - ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[oklch(0.45_0.25_25)] text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[oklch(0.45_0.25_25)] text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? 'bg-[oklch(0.45_0.25_25)] w-6'
                        : 'bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex
                      ? 'border-[oklch(0.45_0.25_25)]'
                      : 'border-[oklch(0.2_0_0)] hover:border-[oklch(0.3_0_0)]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[oklch(0.5_0_0)] text-xs uppercase tracking-widest font-display font-semibold mb-1">
                Categoria
              </p>
              <p className="text-white font-medium">{product.category}</p>
            </div>
            <div>
              <p className="text-[oklch(0.5_0_0)] text-xs uppercase tracking-widest font-display font-semibold mb-1">
                Marca
              </p>
              <p className="text-white font-medium">{product.brand}</p>
            </div>
            <div>
              <p className="text-[oklch(0.5_0_0)] text-xs uppercase tracking-widest font-display font-semibold mb-1">
                Especificação
              </p>
              <p className="text-white font-medium">{product.badge}</p>
            </div>
            <div>
              <p className="text-[oklch(0.5_0_0)] text-xs uppercase tracking-widest font-display font-semibold mb-1">
                Preço Diário
              </p>
              <p className="text-[oklch(0.8_0_0)] font-semibold text-lg">
                R$ {product.price.toLocaleString('pt-BR')},00
              </p>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-white font-display font-bold uppercase tracking-wide mb-4">
              Especificações Técnicas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {specs.map((spec, idx) => (
                <div key={idx} className="bg-[oklch(0.08_0_0)] border border-[oklch(0.15_0_0)] p-3 rounded-lg">
                  <p className="text-[oklch(0.5_0_0)] text-xs uppercase tracking-widest font-display font-semibold mb-1">
                    {spec.label}
                  </p>
                  <p className="text-white text-sm font-medium">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar - Availability */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[oklch(0.45_0.25_25)]" />
              <h3 className="text-white font-display font-bold uppercase tracking-wide">
                Disponibilidade (Próximos 30 dias)
              </h3>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, idx) => {
                const isSelected = selectedDates.some(d => d.toDateString() === date.toDateString());
                const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                const dayNum = date.getDate();

                return (
                  <button
                    key={idx}
                    onClick={() => toggleDateSelection(date)}
                    className={`p-2 rounded-lg text-xs font-medium transition-all text-center ${
                      isSelected
                        ? 'bg-[oklch(0.45_0.25_25)] text-white border border-[oklch(0.45_0.25_25)]'
                        : 'bg-[oklch(0.08_0_0)] border border-[oklch(0.15_0_0)] text-[oklch(0.6_0_0)] hover:border-[oklch(0.3_0_0)]'
                    }`}
                  >
                    <div className="uppercase tracking-wider text-[0.65rem]">{dayName}</div>
                    <div className="font-semibold">{dayNum}</div>
                  </button>
                );
              })}
            </div>
            {selectedDates.length > 0 && (
              <p className="text-[oklch(0.6_0_0)] text-sm mt-3">
                {selectedDates.length} dia(s) selecionado(s)
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-4 border-t border-[oklch(0.2_0_0)]">
            <a
              href={`https://wa.me/message/WOIONHHSTABQF1?text=Olá! Tenho interesse em alugar: ${product.name} - R$ ${product.price}/dia. Datas: ${selectedDates.length > 0 ? selectedDates.map(d => d.toLocaleDateString('pt-BR')).join(', ') : 'A definir'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 loc7-btn-primary py-3 font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Solicitar Orçamento
            </a>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="text-white border-[oklch(0.2_0_0)] hover:bg-[oklch(0.12_0_0)]"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
