type FilterOption = {
  id: string;
  group_id: string;
  name: string;
  display_order: number | null;
  is_active?: boolean | null;
};

type FilterGroup = {
  id: string;
  category_id: string;
  name: string;
  display_order: number | null;
  is_active?: boolean | null;
  category?: {
    name: string;
  };
  options?: FilterOption[];
};

type ProductFilterSelectorProps = {
  groups: FilterGroup[];
  selectedIds: string[];
  selectedBrand: string;
  isEditing?: boolean;
  onOptionToggle: (
    group: FilterGroup,
    option: FilterOption,
    isEditing?: boolean
  ) => void;
  isBrandFilterGroup: (group?: FilterGroup | null) => boolean;
};

export default function ProductFilterSelector({
  groups,
  selectedIds,
  selectedBrand,
  isEditing = false,
  onOptionToggle,
  isBrandFilterGroup,
}: ProductFilterSelectorProps) {
  if (groups.length === 0) {
    return (
      <div className="md:col-span-2 rounded border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-500">
        Selecione uma categoria com filtros configurados para relacionar este produto à árvore.
      </div>
    );
  }

  return (
    <div className="md:col-span-2 rounded border border-gray-200 bg-gray-50 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Filtros relacionados</h3>
        <p className="mt-1 text-xs text-gray-500">
          Marque os valores que fazem este produto aparecer nos cruzamentos do catálogo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => {
          const brandGroup = isBrandFilterGroup(group);

          return (
            <div key={group.id} className="rounded border border-gray-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 mb-3">
                {group.name}
              </p>

              {brandGroup ? (
                <div className="space-y-2">
                  {selectedBrand ? (
                    <span className="inline-flex rounded-full border border-gray-900 bg-gray-900 px-3 py-1.5 text-sm text-white">
                      {selectedBrand}
                    </span>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Selecione a marca do produto acima.
                    </p>
                  )}

                  <p className="text-xs text-gray-500">
                    A marca é sincronizada automaticamente pela aba Marcas.
                  </p>
                </div>
              ) : group.options && group.options.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const checked = selectedIds.includes(option.id);

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => onOptionToggle(group, option, isEditing)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${
                          checked
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {option.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Nenhum valor configurado neste filtro.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
