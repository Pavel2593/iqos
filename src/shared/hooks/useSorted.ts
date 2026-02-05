import { useMemo } from 'react'

/**
 * Возвращает отсортированную копию массива.
 * Важно: исходный массив не мутируется.
 */
export function useSorted<T>(
  items: readonly T[],
  compare: (a: T, b: T) => number,
  deps: readonly unknown[] = [],
): T[] {
  return useMemo(() => [...items].sort(compare), [items, compare, ...deps])
}


