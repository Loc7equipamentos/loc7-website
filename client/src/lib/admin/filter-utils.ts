import { supabase } from '@/lib/supabase';

export type AdminFilterOption = {
  id: string;
  group_id: string;
  name: string;
  display_order: number | null;
  is_active?: boolean | null;
};

export type AdminFilterGroup = {
  id: string;
  category_id: string;
  name: string;
  display_order: number | null;
  is_active?: boolean | null;
  category?: {
    name: string;
  };
  options?: AdminFilterOption[];
};

export const sortFilterOptionsByDisplayOrder = (
  options: AdminFilterOption[] = []
) => {
  return [...options].sort((a, b) => {
    const orderA = a.display_order ?? 999;
    const orderB = b.display_order ?? 999;

    if (orderA !== orderB) return orderA - orderB;

    return a.name.localeCompare(b.name, 'pt-BR');
  });
};

export const moveFilterGroupOrder = async (
  groups: AdminFilterGroup[],
  groupIndex: number,
  direction: 'up' | 'down'
) => {
  const targetIndex = direction === 'up' ? groupIndex - 1 : groupIndex + 1;
  const currentGroup = groups[groupIndex];
  const targetGroup = groups[targetIndex];

  if (!currentGroup || !targetGroup) return;

  const currentOrder = currentGroup.display_order ?? groupIndex + 1;
  const targetOrder = targetGroup.display_order ?? targetIndex + 1;

  const [{ error: currentError }, { error: targetError }] = await Promise.all([
    supabase
      .from('filter_groups')
      .update({ display_order: targetOrder })
      .eq('id', currentGroup.id),
    supabase
      .from('filter_groups')
      .update({ display_order: currentOrder })
      .eq('id', targetGroup.id),
  ]);

  if (currentError) throw currentError;
  if (targetError) throw targetError;
};

export const moveFilterOptionOrder = async (
  group: AdminFilterGroup,
  optionIndex: number,
  direction: 'up' | 'down'
) => {
  const options = sortFilterOptionsByDisplayOrder(group.options || []);

  const targetIndex = direction === 'up' ? optionIndex - 1 : optionIndex + 1;
  const currentOption = options[optionIndex];
  const targetOption = options[targetIndex];

  if (!currentOption || !targetOption) return;

  const currentOrder = currentOption.display_order ?? optionIndex + 1;
  const targetOrder = targetOption.display_order ?? targetIndex + 1;

  const [{ error: currentError }, { error: targetError }] = await Promise.all([
    supabase
      .from('filter_options')
      .update({ display_order: targetOrder })
      .eq('id', currentOption.id),
    supabase
      .from('filter_options')
      .update({ display_order: currentOrder })
      .eq('id', targetOption.id),
  ]);

  if (currentError) throw currentError;
  if (targetError) throw targetError;
};
