import styles from './OfferCard.module.css'

export type OfferCardProps = {
  imageUrl?: string | null
  title: string
  description?: string | null
  priceText: string
  onAdd?: () => void
  addLabel?: string
  disabled?: boolean
}

export function OfferCard({
  imageUrl,
  title,
  description,
  priceText,
  onAdd,
  addLabel = 'Добавить',
  disabled = false,
}: OfferCardProps) {
  return (
    <article className={styles['offer-card']}>
      <div className={styles['offer-card__image-wrap']}>
        {imageUrl ? (
          <img className={styles['offer-card__image']} src={imageUrl} alt={title} />
        ) : (
          <div
            className={styles['offer-card__image-placeholder']}
            aria-label="Нет изображения"
          />
        )}
      </div>

      <div className={styles['offer-card__body']}>
        <div className={styles['offer-card__name']}>{title}</div>
        <div className={styles['offer-card__description']}>
          {description}
        </div>

        <div className={styles['offer-card__footer']}>
          <div className={styles['offer-card__price']}>{priceText}</div>
          <button
            className={styles['offer-card__add-button']}
            type="button"
            onClick={onAdd}
            disabled={disabled}
          >
            {disabled ? 'Нет в наличии' : addLabel}
          </button>
        </div>
      </div>
    </article>
  )
}


