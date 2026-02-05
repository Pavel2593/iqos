import styles from './Pagination.module.css'

type PaginationItem = number | 'ellipsis'

function getPaginationItems({
  page,
  totalPages,
  siblingCount,
}: {
  page: number
  totalPages: number
  siblingCount: number
}): PaginationItem[] {
  const items: PaginationItem[] = []

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
  const safePage = clamp(page, 1, totalPages)

  const left = clamp(safePage - siblingCount, 1, totalPages)
  const right = clamp(safePage + siblingCount, 1, totalPages)

  // Always show: 1 ... [left..right] ... totalPages
  items.push(1)

  if (left > 2) items.push('ellipsis')

  for (let p = Math.max(2, left); p <= Math.min(totalPages - 1, right); p += 1) {
    items.push(p)
  }

  if (right < totalPages - 1) items.push('ellipsis')

  if (totalPages > 1) items.push(totalPages)

  return items
}

export type PaginationProps = {
  page: number
  pageSize: number
  totalItems: number
  onChange: (page: number) => void
  ariaLabel?: string
  siblingCount?: number
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onChange,
  ariaLabel = 'Пагинация',
  siblingCount = 0,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)

  if (totalItems <= 0 || totalPages <= 1) return null

  const safePage = Math.max(1, Math.min(page, totalPages))
  const items = getPaginationItems({ page: safePage, totalPages, siblingCount })

  return (
    <nav className={styles.pagination} aria-label={ariaLabel}>
      <button
        type="button"
        className={styles.pagination__nav}
        onClick={() => onChange(safePage - 1)}
        disabled={safePage <= 1}
        aria-label="Предыдущая страница"
      >
        Назад
      </button>

      <div className={styles.pagination__pages} role="list">
        {items.map((it, idx) => {
          if (it === 'ellipsis') {
            return (
              <span key={`e-${idx}`} className={styles.pagination__ellipsis} aria-hidden="true">
                …
              </span>
            )
          }

          const isActive = it === safePage
          return (
            <button
              key={it}
              type="button"
              className={[
                styles.pagination__page,
                isActive ? styles['pagination__page--active'] : '',
              ].join(' ')}
              onClick={() => onChange(it)}
              aria-current={isActive ? 'page' : undefined}
            >
              {it}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className={styles.pagination__nav}
        onClick={() => onChange(safePage + 1)}
        disabled={safePage >= totalPages}
        aria-label="Следующая страница"
      >
        Вперед
      </button>
    </nav>
  )
}


