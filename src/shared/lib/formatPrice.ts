export function formatPrice(price: number | null, currencyCode: string | null): string {
  if (price == null) return '—'
  const formatted = new Intl.NumberFormat('ru-RU').format(price)
  if (currencyCode === 'RUB') return `${formatted} ₽`
  if (currencyCode) return `${formatted} ${currencyCode}`
  return formatted
}


