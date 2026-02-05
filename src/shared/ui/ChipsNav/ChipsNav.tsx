import styles from './ChipsNav.module.css'

export type ChipsNavItem<TId extends string | number> = {
  id: TId
  label: string
}

export function ChipsNav<TId extends string | number>({
  items,
  value,
  onChange,
  allLabel = 'Все',
  ariaLabel = 'Навигация',
}: {
  items: Array<ChipsNavItem<TId>>
  value: TId | null
  onChange: (value: TId | null) => void
  allLabel?: string
  ariaLabel?: string
}) {
  const getChipClassName = (isActive: boolean) =>
    [
      styles['chips-nav__chip'],
      isActive ? styles['chips-nav__chip--active'] : '',
    ].join(' ')

  return (
    <nav className={styles['chips-nav']} aria-label={ariaLabel}>
      <div className={styles['chips-nav__list']}>
        <button
          type="button"
          className={getChipClassName(value == null)}
          onClick={() => onChange(null)}
        >
          {allLabel}
        </button>

        {items.map((item) => (
          <button
            key={String(item.id)}
            type="button"
            className={getChipClassName(value === item.id)}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}


