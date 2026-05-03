import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Product } from "@/lib/supabase";

type ProductWithSpecial = Product & {
  is_featured_special?: boolean | null;
};

type Props = {
  product: ProductWithSpecial;
};

function parseImages(images: unknown): string[] {
  if (Array.isArray(images)) {
    return images.filter(
      (img): img is string => typeof img === "string" && img.trim() !== ""
    );
  }

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (img): img is string => typeof img === "string" && img.trim() !== ""
        );
      }
    } catch {
      return images.trim() ? [images] : [];
    }
  }

  return [];
}

export default function ProductCard({ product }: Props) {
  const gallery = useMemo(() => {
    const parsedImages = parseImages(product.images);

    const allImages = [product.image_url, ...parsedImages].filter(
      (img): img is string => typeof img === "string" && img.trim() !== ""
    );

    return Array.from(new Set(allImages));
  }, [product]);

  const primaryImage = gallery[0] || "/placeholder.jpg";
  const hoverImage = gallery[1] || primaryImage;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/equipamentos/${product.slug}`}>
      <div
        className="cursor-pointer overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.045)] transition-all duration-200 hover:-translate-y-[2px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex h-[112px] w-full items-center justify-center overflow-hidden bg-white px-3 py-2 sm:h-[138px] lg:h-[168px]">
          <img
            src={primaryImage}
            alt={product.name}
            className={`absolute h-[88%] w-[88%] object-contain transition-opacity duration-200 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
          <img
            src={hoverImage}
            alt={product.name}
            className={`absolute h-[88%] w-[88%] object-contain transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <div className="flex flex-col px-3 pb-3 pt-2.5 sm:px-3.5 sm:pb-3.5">
          <span className="mb-1 text-[8.5px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {product.category}
          </span>

          <h3 className="min-h-[34px] text-[12px] font-semibold leading-snug text-neutral-900 sm:min-h-[38px] sm:text-[13px]">
            {product.name}
          </h3>

          <div className="mt-1 flex h-[17px] items-center">
            {product.is_featured_special && (
              <span className="truncate whitespace-nowrap text-[10px] font-medium text-red-700/70 underline decoration-red-700/20 underline-offset-4">
                Condição especial
              </span>
            )}
          </div>

          {product.subcategory && (
            <span className="line-clamp-1 text-[10.5px] text-neutral-500">
              {product.subcategory}
            </span>
          )}

          {product.price && (
            <div className="mt-2 flex items-end gap-1">
              <span className="text-[12px] font-semibold text-neutral-900 sm:text-[13px]">
                R$ {Number(product.price).toLocaleString("pt-BR")}
              </span>
              <span className="text-[9.5px] text-neutral-500">/ dia</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
