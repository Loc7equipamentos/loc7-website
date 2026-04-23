import { Link } from "wouter";
import { Product } from "@/lib/supabase";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  // CAPA SEGURA (REGRA OFICIAL)
  const image =
    product.image_url ||
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "/placeholder.jpg");

  return (
    <Link href={`/equipamentos/${product.slug}`}>
      <div className="group cursor-pointer bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden">

        {/* IMAGEM */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* INFO */}
        <div className="p-4 flex flex-col gap-2">

          {/* NOME */}
          <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>

          {/* SUBINFO */}
          <p className="text-xs text-gray-500">
            {product.category} {product.subcategory && `• ${product.subcategory}`}
          </p>

          {/* PREÇO (DISCRETO) */}
          {product.price && (
            <p className="text-sm font-medium text-gray-800 mt-1">
              R$ {Number(product.price).toLocaleString("pt-BR")}
              <span className="text-xs text-gray-400"> / diária</span>
            </p>
          )}

        </div>
      </div>
    </Link>
  );
}
