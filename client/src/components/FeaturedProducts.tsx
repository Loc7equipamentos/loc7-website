import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  slug?: string | null;
  name: string;
  price?: number | null;
  description?: string | null;
  image_url?: string | null;
  images?: string[] | string | null;
  category?: string | null;
  subcategory?: string | null;
  badge?: string | null;
  is_featured?: boolean | null;
  featured_order?: number | null;
};

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function safeNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function safeNumber(value: unknown): number | null {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function sanitizeProduct(raw: any): Product | null {
  if (!raw || typeof raw !== "object") return null;

  const id =
    typeof raw.id === "string" || typeof raw.id === "number"
      ? String(raw.id)
      : "";

  const name = safeString(raw.name).trim();

  if (!id || !name) return null;

  return {
    id,
    slug: safeNullableString(raw.slug),
    name,
    price: safeNumber(raw.price),
    description: safeNullableString(raw.description),
    image_url: safeNullableString(raw.image_url),
    images: raw.images ?? null,
    category: safeNullableString(raw.category),
    subcategory: safeNullableString(raw.subcategory),
    badge: safeNullableString(raw.badge),
    is_featured: typeof raw.is_featured === "boolean" ? raw.is_featured : null,
    featured_order: safeNumber(raw.featured_order),
  };
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            "id, slug, name, price, description, image_url, images, category, subcategory, badge, is_featured, featured_order"
          )
          .eq("is_featured", true)
          .order("featured_order", { ascending: true, nullsFirst: false });

        if (error) throw error;

        const sanitized = Array.isArray(data)
          ? (data.map(sanitizeProduct).filter(Boolean) as Product[])
          : [];

        setProducts(sanitized);
      } catch (error) {
        console.error("Erro ao carregar produtos em destaque:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
