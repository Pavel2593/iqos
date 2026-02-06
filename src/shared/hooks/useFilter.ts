import { useMemo } from 'react'

export type UseFilterOptions = {
  /**
   * По умолчанию: true
   * Если true — поиск case-insensitive.
   */
  ignoreCase?: boolean
  /**
   * По умолчанию: true
   * Если true — query.trim() и схлопывание множественных пробелов.
   */
  normalizeSpaces?: boolean
}

function normalizeQuery(
  query: string,
  { ignoreCase, normalizeSpaces }: Required<UseFilterOptions>,
): string {
  let q = query
  if (normalizeSpaces) q = q.trim().replace(/\s+/g, ' ')
  if (ignoreCase) q = q.toLowerCase()
  return q
}

/**
 * Возвращает отфильтрованный список по строковому запросу.
 * По умолчанию: case-insensitive, trim + normalize пробелов.
 */
export function useFilter<T>(
  items: readonly T[],
  query: string,
  getText: (item: T) => string | null | undefined,
  options: UseFilterOptions = {},
): T[] {
  return useMemo(() => {
    const normalized = normalizeQuery(query, {
      ignoreCase: options.ignoreCase ?? true,
      normalizeSpaces: options.normalizeSpaces ?? true,
    })

    if (!normalized) return [...items]

    return items.filter((item) => {
      const raw = getText(item) ?? ''
      const hay = normalizeQuery(raw, {
        ignoreCase: options.ignoreCase ?? true,
        normalizeSpaces: options.normalizeSpaces ?? true,
      })
      return hay.includes(normalized)
    })
  }, [items, query, getText, options.ignoreCase, options.normalizeSpaces])
}


