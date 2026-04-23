<main className="min-h-screen bg-[#f3f3f1] pt-24 text-neutral-900">
  <div className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 lg:px-8">

    {/* BREADCRUMB (MAIS COMPACTO) */}
    <div className="mb-3 flex items-center gap-2 text-xs text-neutral-500">
      <Link href="/" className="hover:text-neutral-900">
        Início
      </Link>
      <span>›</span>
      {product.category ? (
        <>
          <Link
            href={`/catalogo/${(product.category || "")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/\s+/g, "-")}`}
            className="hover:text-neutral-900"
          >
            {product.category}
          </Link>
          <span>›</span>
        </>
      ) : null}
      <span className="text-neutral-900">{product.name}</span>
    </div>

    {/* GRID PRINCIPAL (MAIS ENCAIXADO) */}
    <section className="grid gap-5 lg:grid-cols-[88px_minmax(0,1fr)_360px]">
      
      {/* THUMBNAILS */}
      <aside className="hidden lg:flex lg:flex-col lg:gap-2">
        {gallery.map((image, index) => (
          <button
            key={image + index}
            onClick={() => setSelectedImage(index)}
            className={`overflow-hidden rounded-xl border bg-white transition ${
              selectedImage === index
                ? "border-neutral-900 shadow-sm"
                : "border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <div className="aspect-square p-2">
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="h-full w-full object-contain"
              />
            </div>
          </button>
        ))}
      </aside>

      {/* IMAGEM PRINCIPAL */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
        <div className="flex h-[320px] sm:h-[380px] lg:h-[440px] items-center justify-center">
          <img
            src={currentImage}
            alt={product.name}
            className="max-h-[90%] max-w-[90%] object-contain"
          />
        </div>
      </div>

      {/* CARD DIREITO */}
      <aside className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
        
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-[2rem]">
          {product.name}
        </h1>

        <div className="mt-2 space-y-2">
          <p className="text-sm text-neutral-500">
            {[product.category, product.subcategory].filter(Boolean).join(" / ")}
          </p>

          <div className="inline-flex items-center gap-2 text-sm text-neutral-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Disponível
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <a className="flex w-full justify-center rounded-lg bg-neutral-950 py-3 text-sm font-medium text-white">
            Reservar agora
          </a>

          <a className="flex gap-3 p-3 border rounded-xl bg-neutral-50">
            💬
            <div>
              <div className="text-sm font-medium">
                Tirar dúvidas com um especialista
              </div>
              <div className="text-xs text-neutral-500">
                Fale com nossa equipe sobre kit e disponibilidade.
              </div>
            </div>
          </a>
        </div>

        {product.price && (
          <div className="mt-5 rounded-xl border border-neutral-200 bg-white px-4 py-4">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Diária
            </span>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-2xl font-semibold text-neutral-950">
                R$ {Number(product.price).toLocaleString("pt-BR")}
              </span>
              <span className="pb-[2px] text-xs text-neutral-400">
                / dia
              </span>
            </div>
          </div>
        )}

      </aside>

    </section>
  </div>
</main>
