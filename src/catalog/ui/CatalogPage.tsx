import { useEffect, useMemo, useState } from 'react'
import { getCatalog } from '../application/getCatalog'
import type { Catalog } from '../domain/Catalog'
import { OfferCard } from '../../shared/ui/OfferCard/OfferCard'
import styles from './CatalogPage.module.css'

function formatPrice(price: number | null, currencyCode: string | null) {
  if (price == null) return '—'
  const formatted = new Intl.NumberFormat('ru-RU').format(price)
  if (currencyCode === 'RUB') return `${formatted} ₽`
  if (currencyCode) return `${formatted} ${currencyCode}`
  return formatted
}

export function CatalogPage() {
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'ok'; catalog: Catalog }
    | { status: 'error'; message: string }
  >({ status: 'loading' })

  const [visibleCount, setVisibleCount] = useState(24)

  useEffect(() => {
    let cancelled = false

    getCatalog()
      .then((catalog) => {
        if (cancelled) return
        setState({ status: 'ok', catalog })
      })
      .catch((e) => {
        if (cancelled) return
        const message = e instanceof Error ? e.message : String(e)
        setState({ status: 'error', message })
      })
      
    return () => {
      cancelled = true
    }
  }, [])

  const offers = useMemo(() => {
    if (state.status !== 'ok') return []
    return state.catalog.offers
  }, [state])

  const visibleOffers = state.status === 'ok' ? offers.slice(0, visibleCount) : []

  return (
    <div className={styles['catalog-page']}>
      <div className={styles['catalog-page__container']}>
        <header className={styles['catalog-page__header']}>
          <h1 className={styles['catalog-page__title']}>Каталог</h1>
          <div className={styles['catalog-page__meta']}>
            {state.status === 'ok'
              ? `${state.catalog.shop?.name ?? 'IQOS'} · offers: ${offers.length}`
              : 'IQOS'}
          </div>
        </header>

        {state.status === 'loading' && (
          <div className={styles['catalog-page__state']}>Загрузка каталога…</div>
        )}

        {state.status === 'error' && (
          <div className={styles['catalog-page__state']}>Ошибка</div>
        )}

        {state.status === 'ok' && (
          <>
            <section className={styles['catalog-page__grid']}>
              {visibleOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  imageUrl={offer.picture}
                  title={offer.name ?? 'Без названия'}
                  description={offer.description}
                  priceText={formatPrice(offer.price, offer.currencyCode)}
                  disabled={offer.available === false}
                  onAdd={() => {
                    console.log('[basket] add', offer.id)
                  }}
                />
              ))}
            </section>

            {visibleCount < offers.length && (
              <div className={styles['catalog-page__load-more-wrap']}>
                <button
                  className={styles['catalog-page__load-more']}
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 24)}
                >
                  Показать еще
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


