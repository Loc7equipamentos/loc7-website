import { Link } from "wouter";
import { Product } from "@/lib/supabase";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const image =
    product.image_url ||
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "/placeholder.jpg");

  return (
    <Link href={`/equipamentos/${product.slug}`}>
      <div className="group cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 ease-out hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        
        {/* IMAGEM */}
        <div className="relative flex h-[165px] w-full items-center justify-center overflow-hidden bg-white px-4 py-3 sm:h-[180px] sm:px-5 sm:py-4 lg:h-[190px]">
          <img
            src={image}
            alt={product.name}
            className="block h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-1 p-3 sm:p-4">
          <h3 className="min-h-[40px] line-clamp-2 text-sm font-semibold leading-tight text-neutral-900">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500">
            {product.category}
            {product.subcategory && ` • ${product.subcategory}`}
          </p>

          {product.price && (
            <p className="mt-1 text-sm font-medium text-neutral-800">
              R$ {Number(product.price).toLocaleString("pt-BR")}
              <span className="text-xs text-neutral-400"> / diária</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
