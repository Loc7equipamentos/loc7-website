import { Link } from "wouter";
import { Product } from "@/lib/supabase";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  // CAPA SEGURA
  const image =
    product.image_url ||
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "/placeholder.jpg");

  return (
    <Link href={`/equipamentos/${product.slug}`}>
      <div className="group cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:shadow-md hover:border-neutral-300">

        {/* IMAGEM */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* INFO */}
        <div className="p-4 flex flex-col gap-1">

          {/* NOME */}
          <h3 className="text-sm font-semibold text-neutral-900 leading-tight line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>

          {/* SUBINFO */}
          <p className="text-xs text-neutral-500">
            {product.category}
            {product.subcategory && ` • ${product.subcategory}`}
          </p>

          {/* PREÇO (DISCRETO) */}
          {product.price && (
            <p className="text-sm font-medium text-neutral-800 mt-1">
              R$ {Number(product.price).toLocaleString("pt-BR")}
              <span className="text-xs text-neutral-400"> / diária</span>
            </p>
          )}

        </div>
      </div>
    </Link>
  );
}
