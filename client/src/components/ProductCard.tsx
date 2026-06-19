import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Product } from "@/lib/supabase";

type ProductWithSpecial = Product & {
  is_featured_special?: boolean | null;
  display_name?: string | null;
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

function slugifyPathSegment(value?: string | null): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export default function ProductCard({ product }: Props) {
  const gallery = useMemo(() => {
    const parsedImages = parseImages(product.images);

    const allImages = [product.image_url, ...parsedImages].filter(
      (img): img is string => typeof img === "string" && img.trim() !== ""
    );

    return Array.from(new Set(allImages));
  }, [product]);

  const productTitle = product.display_name || product.name;

  const primaryImage = gallery[0] || "/placeholder.jpg";
  const hoverImage = gallery[1] || primaryImage;

  const categorySlug = slugifyPathSegment(product.category) || "catalogo";

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/equipamentos/${categorySlug}/${product.slug}`}
      className="block h-full"
    >
      <div
        className="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-[0_12px_34px_rgba(0,0,0,0.09)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_18px_48px_rgba(0,0,0,0.14)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex h-[112px] w-full shrink-0 items-center justify-center overflow-hidden bg-white px-3 py-2 sm:h-[145px] lg:h-[178px]">
          {product.is_featured_special && (
            <span className="absolute left-3 top-3 z-10 bg-black/70 px-1.5 py-[2px] text-[7.5px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-[2px]">
              Condição especial
            </span>
          )}

          <img
            src={primaryImage}
            alt={productTitle}
            className={`absolute h-[88%] w-[88%] object-contain transition-opacity duration-200 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
          <img
            src={hoverImage}
            alt={productTitle}
            className={`absolute h-[88%] w-[88%] object-contain transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <div className="flex flex-col px-3 pb-3 pt-3.5 sm:px-3.5 sm:pb-3.5 sm:pt-4">
          <div className="mb-1.5 flex items-center overflow-hidden text-[10px] font-semibold uppercase tracking-[0.11em] text-neutral-700">
            <span className="truncate">{product.category}</span>

            {product.subcategory && (
              <>
                <span className="mx-1.5 text-neutral-400">/</span>
                <span className="truncate text-neutral-800">
                  {product.subcategory}
                </span>
              </>
            )}
          </div>

          <h3 className="line-clamp-2 min-h-[30px] text-[13.5px] font-bold leading-[1.2] tracking-[-0.015em] text-neutral-950 sm:min-h-[34px] sm:text-[14.5px]">
            {productTitle}
          </h3>

          {product.price ? (
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-[13.5px] font-bold text-neutral-900 sm:text-[14px]">
                R$ {Number(product.price).toLocaleString("pt-BR")}
              </span>
              <span className="text-[10px] font-medium text-neutral-700">
                / dia
              </span>
            </div>
          ) : (
            <div className="mt-1.5 text-[12px] font-semibold text-neutral-700">
              Sob consulta
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
