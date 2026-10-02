import type { ScoredMajor } from '../data/majors';

export type SortField = 'recommended' | 'passion' | 'demand' | 'ai' | 'average' | 'median' | 'name';
export type SortDirection = 'asc' | 'desc';

export const sortLabels: Record<SortField, string> = {
  recommended: 'Best overall fit',
  passion: 'Passion match',
  demand: 'Job demand',
  ai: 'AI disruption',
  average: 'Average starting pay',
  median: 'Median starting pay',
  name: 'Major name',
};

export function defaultDirection(field: SortField): SortDirection {
  return field === 'ai' || field === 'name' ? 'asc' : 'desc';
}

export function sortMajors(items: ScoredMajor[], field: SortField, direction: SortDirection): ScoredMajor[] {
  const factor = direction === 'asc' ? 1 : -1;
  return [...items].sort((a, b) => {
    if (field === 'name') return a.name.localeCompare(b.name) * factor;
    const key = field === 'recommended' ? 'score' : field;
    return (a[key] - b[key]) * factor || a.rank - b.rank;
  });
}