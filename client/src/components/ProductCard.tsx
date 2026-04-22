import { useState } from "react";
import { useLocation } from "wouter";

type Props = {
  slug: string;
  name: string;
  price: number;
  image_url?: string | null;
  images?: string[] | null;
};

export default function ProductCard({
  slug,
  name,
  price,
  image_url,
  images,
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
      <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
          <img
            src={hovered && secondaryImage ? secondaryImage : primaryImage || ""}
            alt={name}
            className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
            {name}
          </h3>

          <p className="text-sm text-neutral-500 mt-1">
            R$ {formatPrice(price)} / diária
          </p>
        </div>
      </div>
    </div>
  );
}
