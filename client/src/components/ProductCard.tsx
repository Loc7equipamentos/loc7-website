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

  const primaryImage = image_url || images?.[0];
  const secondaryImage = images?.[0];

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });

  return (
    <div
      onClick={() => navigate(`/equipamentos/${slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer"
    >
      <div className="bg-white rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-sm">
        <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
          <img
            src={hovered && secondaryImage ? secondaryImage : primaryImage || ""}
            alt={name}
            className="object-contain w-full h-full transition-opacity duration-200"
          />
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
            {name}
          </h3>

          {(subcategory || category) && (
            <p className="text-xs text-neutral-500 mt-1">
              {subcategory || category}
            </p>
          )}

          <p className="text-sm text-neutral-400 mt-2">
            R$ {formatPrice(price)} / diária
          </p>
        </div>
      </div>
    </div>
  );
}
