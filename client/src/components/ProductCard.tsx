import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Product } from "@/lib/supabase";

type Props = {
  product: Product;
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
        className="cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex h-[165px] w-full items-center justify-center overflow-hidden bg-white px-3 py-2 sm:h-[180px] sm:px-4 sm:py-3 lg:h-[190px]">
          <img
            src={primaryImage}
            alt={product.name}
            className={`absolute h-[92%] w-[92%] object-contain transition-opacity duration-200 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />

          <img
            src={hoverImage}
            alt={product.name}
            className={`absolute h-[92%] w-[92%] object-contain transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <div className="flex flex-col gap-2 p-3 sm:p-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            {product.category}
          </span>

          <h3 className="min-h-[44px] text-[14px] font-semibold leading-tight text-neutral-900">
            {product.name}
          </h3>

          {product.subcategory && (
            <span className="text-xs text-neutral-500">
              {product.subcategory}
            </span>
          )}

          {product.price && (
            <div className="mt-1 flex items-end gap-1.5">
              <span className="text-[15px] font-semibold text-neutral-900">
                R$ {Number(product.price).toLocaleString("pt-BR")}
              </span>
              <span className="pb-[1px] text-[11px] text-neutral-500">
                / dia
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
