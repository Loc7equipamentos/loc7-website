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
      <div className="group cursor-pointer overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-md">

        {/* ÁREA FIXA DE IMAGEM */}
        <div className="relative w-full h-[220px] flex items-center justify-center bg-white">

          {/* CAIXA INTERNA PADRONIZADA */}
          <div className="w-[85%] h-[85%] flex items-center justify-center">

            <img
              src={image}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />

          </div>
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-1 p-4">
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
