{product.price && (
  <div className="mt-5 rounded-xl border border-neutral-200 bg-white px-4 py-4">
    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
      Diária
    </span>

    <div className="mt-1 flex items-end gap-2">
      <span className="text-2xl font-semibold text-neutral-950">
        R$ {Number(product.price).toLocaleString("pt-BR")}
      </span>
      <span className="pb-[2px] text-xs text-neutral-400">/ dia</span>
    </div>

    {/* DIFERENCIAIS COM MICRO DOT */}
    <div className="mt-4 space-y-2 text-[12px] leading-relaxed text-neutral-600">
      <div className="flex items-start gap-2">
        <span className="mt-[6px] h-[4px] w-[4px] rounded-full bg-neutral-700" />
        <span>Processo ágil na liberação de equipamentos</span>
      </div>

      <div className="flex items-start gap-2">
        <span className="mt-[6px] h-[4px] w-[4px] rounded-full bg-neutral-700" />
        <span>Consultoria técnica especializada</span>
      </div>

      <div className="flex items-start gap-2">
        <span className="mt-[6px] h-[4px] w-[4px] rounded-full bg-neutral-700" />
        <span>Desenvolvimento de projetos especiais</span>
      </div>
    </div>
  </div>
)}
