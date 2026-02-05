import type { Catalog } from './Catalog'

export type CatalogRepository = {
  getCatalog(): Promise<Catalog>
}


