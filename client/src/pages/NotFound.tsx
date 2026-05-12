import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <main className="min-h-screen bg-[#f3f3f1] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[900px] justify-center">
        <div className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            ERRO 404
          </span>

          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
            Página não encontrada
          </h1>

          <p className="mx-auto mt-4 max-w-[520px] text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
            O endereço acessado não existe, foi removido ou está indisponível
            neste momento.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setLocation("/catalogo")}
              className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Voltar ao catálogo
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
