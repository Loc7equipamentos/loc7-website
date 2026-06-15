import {
  sortFilterOptionsByDisplayOrder,
  moveFilterGroupOrder,
  moveFilterOptionOrder,
} from '@/lib/admin/filter-utils';

type SupabaseClientLike = any;

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
    id?: string;
    name: string;
  };
  options?: FilterOption[];
};

type CategoryLike = {
  id: string;
  name: string;
};

type FilterGroupDraft = {
  category_id: string;
  name: string;
  display_order: number;
};

type FilterOptionDraft = {
  group_id: string;
  name: string;
  display_order: number;
};

export async function loadFilterArchitectureFromSupabase({
  supabase,
  setFilterGroups,
  setFilterOptions,
}: {
  supabase: SupabaseClientLike;
  setFilterGroups: (groups: FilterGroup[]) => void;
  setFilterOptions: (options: FilterOption[]) => void;
}) {
  try {
    const { data: groupsData, error: groupsError } = await supabase
      .from('filter_groups')
      .select(`
  *,
  category:categories!filter_groups_category_id_fkey (
    id,
    name
  )
`)
      .order('display_order', { ascending: true });

    if (groupsError) throw groupsError;

    const { data: optionsData, error: optionsError } = await supabase
      .from('filter_options')
      .select('*')
      .order('display_order', { ascending: true });

    if (optionsError) throw optionsError;

    const groups = ((groupsData as FilterGroup[]) || []).map((group) => ({
      ...group,
      options: sortFilterOptionsByDisplayOrder(
        ((optionsData as FilterOption[]) || []).filter(
          (option) => option.group_id === group.id
        )
      ),
    }));

    setFilterGroups(groups);
    setFilterOptions((optionsData as FilterOption[]) || []);
  } catch (err) {
    console.error('Erro ao carregar arquitetura de filtros:', err);
  }
}

export async function addFilterGroupToSupabase({
  supabase,
  newFilterGroup,
  setNewFilterGroup,
  setError,
  loadFilterArchitecture,
}: {
  supabase: SupabaseClientLike;
  newFilterGroup: FilterGroupDraft;
  setNewFilterGroup: (value: FilterGroupDraft) => void;
  setError: (value: string | null) => void;
  loadFilterArchitecture: () => Promise<void>;
}) {
  if (!newFilterGroup.category_id || !newFilterGroup.name.trim()) {
    setError('Selecione a categoria e informe o nome do grupo');
    return;
  }

  try {
    const { error: err } = await supabase
      .from('filter_groups')
      .insert([
        {
          category_id: newFilterGroup.category_id,
          name: newFilterGroup.name.trim(),
          display_order: newFilterGroup.display_order || 0,
        },
      ]);

    if (err) throw err;

    setNewFilterGroup({
      category_id: '',
      name: '',
      display_order: 0,
    });
    setError(null);
    await loadFilterArchitecture();
    alert('Grupo de filtro adicionado com sucesso!');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao adicionar grupo');
  }
}

export async function addFilterOptionToSupabase({
  supabase,
  newFilterOption,
  setNewFilterOption,
  setError,
  loadFilterArchitecture,
}: {
  supabase: SupabaseClientLike;
  newFilterOption: FilterOptionDraft;
  setNewFilterOption: (value: FilterOptionDraft) => void;
  setError: (value: string | null) => void;
  loadFilterArchitecture: () => Promise<void>;
}) {
  if (!newFilterOption.group_id || !newFilterOption.name.trim()) {
    setError('Selecione o grupo e informe o nome da opção');
    return;
  }

  try {
    const { error: err } = await supabase
      .from('filter_options')
      .insert([
        {
          group_id: newFilterOption.group_id,
          name: newFilterOption.name.trim(),
          display_order: newFilterOption.display_order || 0,
        },
      ]);

    if (err) throw err;

    setNewFilterOption({
      group_id: '',
      name: '',
      display_order: 0,
    });
    setError(null);
    await loadFilterArchitecture();
    alert('Opção de filtro adicionada com sucesso!');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao adicionar opção');
  }
}

export async function deleteFilterGroupFromSupabase({
  supabase,
  id,
  setError,
  loadFilterArchitecture,
}: {
  supabase: SupabaseClientLike;
  id: string;
  setError: (value: string | null) => void;
  loadFilterArchitecture: () => Promise<void>;
}) {
  if (!confirm('Tem certeza que deseja deletar este grupo e suas opções?')) return;

  try {
    const { error: err } = await supabase
      .from('filter_groups')
      .delete()
      .eq('id', id);

    if (err) throw err;

    await loadFilterArchitecture();
    alert('Grupo deletado com sucesso!');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao deletar grupo');
  }
}

export async function deleteFilterOptionFromSupabase({
  supabase,
  id,
  setError,
  loadFilterArchitecture,
}: {
  supabase: SupabaseClientLike;
  id: string;
  setError: (value: string | null) => void;
  loadFilterArchitecture: () => Promise<void>;
}) {
  if (!confirm('Tem certeza que deseja deletar esta opção?')) return;

  try {
    const { error: err } = await supabase
      .from('filter_options')
      .delete()
      .eq('id', id);

    if (err) throw err;

    await loadFilterArchitecture();
    alert('Opção deletada com sucesso!');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao deletar opção');
  }
}

export async function addTreeFilterToSupabase({
  supabase,
  categories,
  selectedFilterArchitectureCategory,
  newTreeFilterName,
  newTreeFilterOrder,
  filterGroups,
  setNewTreeFilterName,
  setNewTreeFilterOrder,
  setError,
  loadFilterArchitecture,
}: {
  supabase: SupabaseClientLike;
  categories: CategoryLike[];
  selectedFilterArchitectureCategory: string;
  newTreeFilterName: string;
  newTreeFilterOrder: number | '';
  filterGroups: FilterGroup[];
  setNewTreeFilterName: (value: string) => void;
  setNewTreeFilterOrder: (value: number | '') => void;
  setError: (value: string | null) => void;
  loadFilterArchitecture: () => Promise<void>;
}) {
  const selectedCategory = categories.find(
    (cat) => cat.name === selectedFilterArchitectureCategory
  );

  if (!selectedCategory) {
    setError('Selecione uma categoria para configurar os filtros');
    return;
  }

  if (!newTreeFilterName.trim()) {
    setError('Informe o nome do filtro');
    return;
  }

  const nextOrder =
    Math.max(
      0,
      ...filterGroups
        .filter((group) => group.category_id === selectedCategory.id)
        .map((group) => group.display_order ?? 0)
    ) + 1;

  try {
    const { error: err } = await supabase
      .from('filter_groups')
      .insert([
        {
          category_id: selectedCategory.id,
          name: newTreeFilterName.trim(),
          display_order:
            typeof newTreeFilterOrder === 'number' ? newTreeFilterOrder : nextOrder,
        },
      ]);

    if (err) throw err;

    setNewTreeFilterName('');
    setNewTreeFilterOrder('');
    setError(null);
    await loadFilterArchitecture();
    alert('Filtro criado com sucesso!');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao criar filtro');
  }
}

export async function addTreeFilterValueToSupabase({
  supabase,
  group,
  newFilterValueByGroup,
  setNewFilterValueByGroup,
  setError,
  loadFilterArchitecture,
}: {
  supabase: SupabaseClientLike;
  group: FilterGroup;
  newFilterValueByGroup: Record<string, string>;
  setNewFilterValueByGroup: (
    updater: (prev: Record<string, string>) => Record<string, string>
  ) => void;
  setError: (value: string | null) => void;
  loadFilterArchitecture: () => Promise<void>;
}) {
  const value = (newFilterValueByGroup[group.id] || '').trim();

  if (!value) {
    setError('Informe o valor do filtro');
    return;
  }

  const nextOrder =
    Math.max(
      0,
      ...(group.options || []).map((option) => option.display_order ?? 0)
    ) + 1;

  try {
    const { error: err } = await supabase
      .from('filter_options')
      .insert([
        {
          group_id: group.id,
          name: value,
          display_order: nextOrder,
        },
      ]);

    if (err) throw err;

    setNewFilterValueByGroup((prev) => ({
      ...prev,
      [group.id]: '',
    }));
    setError(null);
    await loadFilterArchitecture();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao adicionar valor');
  }
}

export async function moveFilterGroupInSupabase({
  filteredFilterGroups,
  groupIndex,
  direction,
  setError,
  loadFilterArchitecture,
}: {
  filteredFilterGroups: FilterGroup[];
  groupIndex: number;
  direction: 'up' | 'down';
  setError: (value: string | null) => void;
  loadFilterArchitecture: () => Promise<void>;
}) {
  try {
    setError(null);
    await moveFilterGroupOrder(filteredFilterGroups, groupIndex, direction);
    await loadFilterArchitecture();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao reordenar filtros');
  }
}

export async function moveFilterOptionInSupabase({
  group,
  optionIndex,
  direction,
  setError,
  loadFilterArchitecture,
}: {
  group: FilterGroup;
  optionIndex: number;
  direction: 'up' | 'down';
  setError: (value: string | null) => void;
  loadFilterArchitecture: () => Promise<void>;
}) {
  try {
    setError(null);
    await moveFilterOptionOrder(group, optionIndex, direction);
    await loadFilterArchitecture();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao reordenar valores do filtro');
  }
}
