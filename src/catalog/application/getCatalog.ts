import type { CatalogRepository } from '../domain/CatalogRepository'
import type { Catalog } from '../domain/Catalog'
import { catalogXml } from '../data/catalogXmlRepository'

export async function getCatalog(
  repo: CatalogRepository = catalogXml,
): Promise<Catalog> {
  return repo.getCatalog()
}


