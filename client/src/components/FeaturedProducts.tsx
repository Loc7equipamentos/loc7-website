import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image_url?: string | null;
  images?: string[] | null;
  category?: string | null;
  subcategory?: string | null;
  is_featured?: boolean | null;
  featured_order?: number | null;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, slug, name, price, image_url, images, category, subcategory, is_featured, featured_order"
        )
        .eq("is_featured", true)
        .order("featured_order", { ascending: true, nullsFirst: false });

      if (error) throw error;

      setProducts((data as Product[]) || []);
    } catch (error) {
      console.error("Erro ao carregar produtos em destaque:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || products.length === 0) return null;

  return (
    <section className="bg-[#f7f7f5] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl">
            Equipamentos em Destaque
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image_url={product.image_url}
              images={product.images}
              category={product.category ?? undefined}
              subcategory={product.subcategory ?? undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
