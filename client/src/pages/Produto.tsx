import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { supabase, type Product } from "@/lib/supabase";

export default function Produto() {
  const [, params] = useRoute("/equipamentos/:slug");
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!params?.slug) return;

    async function fetchProduct() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", params.slug)
        .single();

      setProduct(data);
    }

    fetchProduct();
  }, [params?.slug]);

  if (!product) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-gray-500">
        Carregando...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* IMAGEM */}
        <div className="rounded-xl border border-[oklch(0.9_0_0)] bg-white p-6">
          <img
            src={product.image_url}
            alt={product.name}
            className="mx-auto max-h-[420px] object-contain"
          />
        </div>

        {/* INFO / CTA */}
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-red-500">
              {product.category}
            </p>

            <h1 className="text-2xl font-semibold text-[oklch(0.1_0_0)]">
              {product.name}
            </h1>
          </div>

          {/* DISPONIBILIDADE */}
          <div className="flex items-center gap-2 text-sm text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Disponível
          </div>

          {/* BOTÃO PRINCIPAL */}
          <a
            href={`https://wa.me/message/WOIONHHSTABQF1?text=Olá! Tenho interesse no equipamento: ${product.name}`}
            target="_blank"
            className="block w-full rounded-lg bg-black py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
          >
            Reservar agora
          </a>

          {/* TIRAR DÚVIDAS */}
          <a
            href={`https://wa.me/message/WOIONHHSTABQF1?text=Olá! Gostaria de tirar dúvidas sobre: ${product.name}`}
            target="_blank"
            className="block w-full rounded-lg border border-[oklch(0.9_0_0)] bg-[oklch(0.97_0_0)] p-4 text-sm transition hover:bg-[oklch(0.94_0_0)]"
          >
            <div className="font-medium text-[oklch(0.1_0_0)]">
              Tirar dúvidas com um especialista
            </div>
            <div className="text-[oklch(0.45_0_0)]">
              Fale com nossa equipe sobre kit e disponibilidade.
            </div>
          </a>

          {/* PREÇO (ÚNICO LUGAR) */}
          <div className="rounded-xl border border-[oklch(0.9_0_0)] bg-white p-5">
            <p className="text-xs uppercase tracking-widest text-[oklch(0.5_0_0)]">
              Diária
            </p>
            <p className="text-xl font-semibold text-[oklch(0.1_0_0)]">
              R$ {product.price}
              <span className="text-sm font-normal text-[oklch(0.5_0_0)]">
                {" "}
                / dia
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* NOVA ÁREA (REESTRUTURADA) */}
      {/* ========================= */}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* O QUE ACOMPANHA */}
        <div className="rounded-xl border border-[oklch(0.9_0_0)] bg-white p-5 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[oklch(0.4_0_0)]">
            O que acompanha
          </h3>

          {product.includes ? (
            <div className="space-y-2 text-sm leading-relaxed text-[oklch(0.35_0_0)]">
              {product.includes
                .split("\n")
                .filter((item) => item.trim() !== "")
                .map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF0000]" />
                    <span>{item}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-[oklch(0.45_0_0)]">
              Consulte nossa equipe para confirmar o kit completo deste item.
            </p>
          )}
        </div>

        {/* HIGHLIGHTS */}
        <div className="rounded-xl border border-[oklch(0.9_0_0)] bg-white p-5 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[oklch(0.4_0_0)]">
            Highlights
          </h3>

          {product.highlights ? (
            <div className="space-y-2 text-sm leading-relaxed text-[oklch(0.35_0_0)]">
              {product.highlights
                .split("\n")
                .filter((item) => item.trim() !== "")
                .map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF0000]" />
                    <span>{item}</span>
                  </div>
                ))}
            </div>
          ) : product.description ? (
            <p className="text-sm text-[oklch(0.45_0_0)]">
              {product.description}
            </p>
          ) : (
            <p className="text-sm text-[oklch(0.45_0_0)]">
              Informações principais deste equipamento disponíveis sob consulta.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
