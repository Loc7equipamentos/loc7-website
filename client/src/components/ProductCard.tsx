import { useState } from "react";
import { useLocation } from "wouter";

type Props = {
  slug: string;
  name: string;
  price: number;
  image_url?: string | null;
  images?: string[] | null;
  category?: string;
  subcategory?: string;
};

export default function ProductCard({
  slug,
  name,
  price,
  image_url,
  images,
  category,
  subcategory,
}: Props) {
  const [, navigate] = useLocation();
  const [hovered, setHovered] = useState(false);

  const primaryImage = images?.[0] || image_url;
  const secondaryImage = images?.[1];

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });

  return (
    <div
      onClick={() => navigate(`/equipamentos/${slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer group"
    >
      <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-sm">
        
        {/* IMAGEM */}
        <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
          <img
            src={hovered && secondaryImage ? secondaryImage : primaryImage || ""}
            alt={name}
            className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </div>

        {/* INFO */}
        <div className="p-4">
          
          {/* NOME */}
          <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
            {name}
          </h3>

          {/* SUBINFO */}
          {(subcategory || category) && (
            <p className="text-xs text-neutral-500 mt-1">
              {subcategory || category}
            </p>
          )}

          {/* PREÇO (DISCRETO) */}
          <p className="text-sm text-neutral-400 mt-2">
            R$ {formatPrice(price)} / diária
          </p>
        </div>
      </div>
    </div>
  );
}
