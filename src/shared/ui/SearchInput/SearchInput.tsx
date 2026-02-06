import styles from './SearchInput.module.css'

export type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Поиск…',
  ariaLabel = 'Поиск',
}: SearchInputProps) {
  return (
    <div className={styles['search-input']}>
      <input
        className={styles['search-input__field']}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        type="search"
      />

      {value.trim() && (
        <button
          type="button"
          className={styles['search-input__clear']}
          onClick={() => onChange('')}
          aria-label="Очистить поиск"
        >
          ×
        </button>
      )}
    </div>
  )
}


