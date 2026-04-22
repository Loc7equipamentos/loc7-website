import { Component, ErrorInfo, ReactNode, useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { supabase } from "../lib/supabase";

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
    name,
    slug: safeNullableString(raw.slug),
    category: safeNullableString(raw.category),
    subcategory: safeNullableString(raw.subcategory),
    price: safeNumber(raw.price),
    description: safeNullableString(raw.description),
    includes: raw.includes ?? null,
    image_url: safeNullableString(raw.image_url),
    images: raw.images ?? null,
    badge: safeNullableString(raw.badge),
    is_featured: typeof raw.is_featured === "boolean" ? raw.is_featured : null,
    featured_order: safeNumber(raw.featured_order),
  };
}

class ProductCardErrorBoundary extends Component<
  { children: ReactNode; productId: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; productId: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erro ao renderizar ProductCard:", {
      productId: this.props.productId,
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export default function Catalogo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalProducts = useMemo(() => products.length, [products]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("name", { ascending: true });

        if (error) {
          console.error("Erro ao carregar produtos:", error);
          setError("Não foi possível carregar o catálogo.");
          setProducts([]);
          return;
        }

        const sanitized = Array.isArray(data)
          ? (data.map(sanitizeProduct).filter(Boolean) as Product[])
          : [];

        setProducts(sanitized);
      } catch (err) {
        console.error("Erro inesperado no catálogo:", err);
        setError("Ocorreu um erro ao montar o catálogo.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-neutral-900">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-24 sm:px-6 lg:px-10 lg:pt-28">
          <div className="max-w-3xl">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.20em] text-neutral-500">
              Catálogo Loc7
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
              Todos os Equipamentos
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-[15px]">
              Equipamentos profissionais para produções audiovisuais, broadcast,
              publicidade, conteúdo e operação técnica de alto nível.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-neutral-500">
            {loading
              ? "Carregando catálogo..."
              : `${totalProducts} ${totalProducts === 1 ? "produto" : "produtos"}`}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[18px] border border-neutral-200 bg-white"
              >
                <div className="aspect-[4/3] w-full animate-pulse bg-neutral-200" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : totalProducts === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-neutral-900">
              Nenhum produto encontrado
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Ainda não há itens disponíveis para exibição no catálogo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {products.map((product) => (
              <ProductCardErrorBoundary key={product.id} productId={product.id}>
                <ProductCard product={product} />
              </ProductCardErrorBoundary>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
