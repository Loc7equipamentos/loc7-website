import { useMemo, useState } from "react";
import { Link } from "wouter";

type Product = {
  id: string;
  name: string;
  slug?: string | null;
  category?: string | null;
  subcategory?: string | null;
  price?: number | null;
  description?: string | null;
  includes?: string[] | string | null;
  image_url?: string | null;
  images?: string[] | string | null;
  badge?: string | null;
  is_featured?: boolean | null;
  featured_order?: number | null;
};

interface ProductCardProps {
  product: Product;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop";

function formatPrice(price?: number | null) {
  if (price == null || Number.isNaN(price)) return null;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
}

function parseImages(images?: string[] | string | null): string[] {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images.filter((img) => typeof img === "string" && img.trim() !== "");
  }

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.filter((img) => typeof img === "string" && img.trim() !== "");
      }
      return [];
    } catch {
      return [];
    }
  }

  return [];
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const parsedImages = useMemo(() => parseImages(product?.images), [product?.images]);

  const safeName =
    typeof product?.name === "string" && product.name.trim() !== ""
      ? product.name
      : "Produto";

  const safeCategory =
    typeof product?.subcategory === "string" && product.subcategory.trim() !== ""
      ? product.subcategory
      : typeof product?.category === "string" && product.category.trim() !== ""
      ? product.category
      : null;

  const safeDescription =
    typeof product?.description === "string" && product.description.trim() !== ""
      ? product.description
      : null;

  const safeBadge =
    typeof product?.badge === "string" && product.badge.trim() !== ""
      ? product.badge
      : null;

  const coverImage =
    typeof product?.image_url === "string" && product.image_url.trim() !== ""
      ? product.image_url
      : PLACEHOLDER_IMAGE;

  const hoverImage = parsedImages.length > 0 ? parsedImages[0] : null;
  const displayImage = isHovered && hoverImage ? hoverImage : coverImage;

  const formattedPrice = formatPrice(
    typeof product?.price === "number" ? product.price : null
  );

  const productHref =
    typeof product?.slug === "string" && product.slug.trim() !== ""
      ? `/equipamentos/${product.slug}`
      : "/catalogo";

  return (
    <Link href={productHref}>
      <a
        className="group block h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <article className="flex h-full flex-col overflow-hidden rounded-[18px] border border-neutral-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f4f4f2]">
            {safeBadge ? (
              <div className="absolute left-3 top-3 z-10 rounded-full border border-white/70 bg-black/82 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                {safeBadge}
              </div>
            ) : null}

            <img
              src={displayImage}
              alt={safeName}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== PLACEHOLDER_IMAGE) {
                  target.src = PLACEHOLDER_IMAGE;
                }
              }}
            />
          </div>

          <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
            {safeCategory ? (
              <div className="mb-2 min-h-[18px]">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500">
                  {safeCategory}
                </span>
              </div>
            ) : (
              <div className="mb-2 min-h-[18px]" />
            )}

            <h3 className="min-h-[44px] text-[15px] font-semibold leading-[1.45] text-neutral-900 sm:text-[16px]">
              {safeName}
            </h3>

            {safeDescription ? (
              <p className="mt-2 min-h-[40px] text-[12.5px] leading-5 text-neutral-600 sm:text-[13px]">
                {safeDescription}
              </p>
            ) : (
              <div className="mt-2 min-h-[40px]" />
            )}

            <div className="mt-4 flex items-end justify-between gap-3">
              <div className="flex min-h-[28px] items-center">
                {formattedPrice ? (
                  <span className="text-[14px] font-semibold tracking-[-0.01em] text-neutral-900 sm:text-[15px]">
                    {formattedPrice}
                  </span>
                ) : (
                  <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                    Sob consulta
                  </span>
                )}
              </div>

              <div className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700">
                Ver produto
              </div>
            </div>
          </div>
        </article>
      </a>
    </Link>
  );
}
