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
        className="cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-shadow duration-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex h-[118px] w-full items-center justify-center overflow-hidden bg-white px-2 py-1.5 sm:h-[145px] sm:px-3 sm:py-2 lg:h-[180px]">
          <img
            src={primaryImage}
            alt={product.name}
            className={`absolute h-[90%] w-[90%] object-contain transition-opacity duration-200 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
          <img
            src={hoverImage}
            alt={product.name}
            className={`absolute h-[90%] w-[90%] object-contain transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <div className="flex flex-col gap-1 p-2.5 sm:gap-1.5 sm:p-3">
          <span className="text-[9px] uppercase tracking-[0.16em] text-neutral-400">
            {product.category}
          </span>

          <h3 className="min-h-[34px] text-[12px] font-semibold leading-tight text-neutral-900 sm:min-h-[40px] sm:text-[13px]">
            {product.name}
          </h3>

          {product.subcategory && (
            <span className="line-clamp-1 text-[11px] text-neutral-500">
              {product.subcategory}
            </span>
          )}

          {product.is_featured_special && (
            <span className="mt-0.5 text-[10px] font-medium text-red-700/80 underline decoration-red-700/25 underline-offset-4 sm:text-[11px]">
              Condições diferenciadas disponíveis
            </span>
          )}

          {product.price && (
            <div className="mt-0.5 flex items-end gap-1">
              <span className="text-[12px] font-semibold text-neutral-900 sm:text-sm">
                R$ {Number(product.price).toLocaleString("pt-BR")}
              </span>
              <span className="text-[10px] text-neutral-500">/ dia</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
