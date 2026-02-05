import { useEffect, useMemo, useState } from 'react'
import { getCatalog } from '../application/getCatalog'
import type { Catalog } from '../domain/Catalog'
import { OfferCard } from '../../shared/ui/OfferCard/OfferCard'
import { ChipsNav } from '../../shared/ui/ChipsNav/ChipsNav'
import { useSorted } from '../../shared/hooks/useSorted'
import styles from './CatalogPage.module.css'

const DEFAULT_VISIBLE_COUNT = 12

function formatPrice(price: number | null, currencyCode: string | null): string {
  if (price == null) return '—'
  const formatted = new Intl.NumberFormat('ru-RU').format(price)
  if (currencyCode === 'RUB') return `${formatted} ₽`
  if (currencyCode) return `${formatted} ${currencyCode}`
  return formatted
}

function compareNullableNumber(a: number | null, b: number | null): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  return a - b
}

function buildCategoryNavItems(categories: Catalog['categories']) {
  return [...categories]
    .sort((a, b) => a.id - b.id)
    .map((c) => ({ id: c.id, label: c.name?.trim() || `#${c.id}` }))
}

function getSelectedCategoryLabel(
  categories: Catalog['categories'],
  selectedCategoryId: number | null,
) {
  if (selectedCategoryId == null) return null
  const c = categories.find((x) => x.id === selectedCategoryId)
  return c?.name?.trim() || `#${selectedCategoryId}`
}

function compareOffers(a: Catalog['offers'][number], b: Catalog['offers'][number]) {
  const byCategory = compareNullableNumber(a.categoryId, b.categoryId)
  if (byCategory !== 0) return byCategory
  const byName = (a.name ?? '').localeCompare(b.name ?? '', 'ru')
  if (byName !== 0) return byName
  return a.id.localeCompare(b.id)
}

export function CatalogPage() {
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'ok'; catalog: Catalog }
    | { status: 'error'; message: string }
  >({ status: 'loading' })

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_COUNT)

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const catalog = await getCatalog()
        if (!isActive) return
        console.log('[catalog xml]', catalog)
        setState({ status: 'ok', catalog })
      } catch (e) {
        if (!isActive) return
        const message = e instanceof Error ? e.message : String(e)
        setState({ status: 'error', message })
      }
    })()
      
    return () => {
      isActive = false
    }
  }, [])

  function handleCategoryChange(next: number | null) {
    setSelectedCategoryId(next)
    setVisibleCount(DEFAULT_VISIBLE_COUNT)
  }

  const categories = state.status === 'ok' ? state.catalog.categories : []

  const navCategoryItems = useMemo(
    () => buildCategoryNavItems(categories),
    [categories],
  )

  const selectedCategoryLabel = useMemo(
    () => getSelectedCategoryLabel(categories, selectedCategoryId),
    [categories, selectedCategoryId],
  )

  const filteredOffers = useMemo(() => {
    if (state.status !== 'ok') return []
    const allOffers = state.catalog.offers
    return selectedCategoryId == null
      ? allOffers
      : allOffers.filter((o) => o.categoryId === selectedCategoryId)
  }, [state, selectedCategoryId])

  const offers = useSorted(filteredOffers, compareOffers)

  const visibleOffers = state.status === 'ok' ? offers.slice(0, visibleCount) : []

  return (
    <div className={styles['catalog-page']}>
      <div className={styles['catalog-page__container']}>
        <header className={styles['catalog-page__header']}>
          <h1 className={styles['catalog-page__title']}>Каталог</h1>
          <div className={styles['catalog-page__meta']}>
            {state.status === 'ok'
              ? `${state.catalog.shop?.name ?? 'IQOS'} · ${
                  selectedCategoryLabel ? `${selectedCategoryLabel} · ` : ''
                }Товаров: ${offers.length}`
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
            <div className={styles['catalog-page__nav']}>
              <ChipsNav
                ariaLabel="Категории"
                items={navCategoryItems}
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                allLabel="Все"
              />
            </div>

            <section className={styles['catalog-page__grid']}>
              {visibleOffers.map((offer) => (
                <OfferCard
                  key={offer.uid}
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

export default CatalogPage


