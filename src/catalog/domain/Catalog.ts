export type Catalog = {
  date: string | null
  shop: {
    name: string | null
    company: string | null
    url: string | null
  } | null
  categories: Array<{
    id: number
    parentId: number | null
    name: string | null
  }>
  offers: Array<{
    uid: string
    id: string
    idNum: number | null
    available: boolean | null
    name: string | null
    description: string | null
    price: number | null
    currencyId: number | null
    currencyCode: string | null
    categoryId: number | null
    url: string | null
    picture: string | null
  }>
}


