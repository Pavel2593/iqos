import type { CatalogRepository } from '../domain/CatalogRepository'
import type { Catalog } from '../domain/Catalog'

const CATALOG_XML_PATH = '/catalog.xml'

function ensureParsedXml(xmlText: string): Document {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'application/xml')

  return doc
}

function getTextContent(el: Element | null): string | null {
  const text = el?.textContent?.trim()
  return text ? text : null
}

function normalizeOfferDescription(raw: string | null): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null

  const decoded =
    new DOMParser()
      .parseFromString(`<!doctype html><textarea>${trimmed}</textarea>`, 'text/html')
      .querySelector('textarea')?.value ?? trimmed

  const withLineBreaks = decoded.replace(/<br\s*\/?>/gi, '\n')
  const htmlDoc = new DOMParser().parseFromString(withLineBreaks, 'text/html')
  const text = (htmlDoc.body.textContent ?? '').replace(/\u00A0/g, ' ')

  return text
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

function toInt(value: string | null): number | null {
  if (!value) return null
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) ? n : null
}

function parseShop(ymlCatalog: Element | null): Catalog['shop'] {
    const shopEl = ymlCatalog?.querySelector('shop') ?? null
    if (!shopEl) return null
  
    return {
      name: getTextContent(shopEl.querySelector('name')),
      company: getTextContent(shopEl.querySelector('company')),
      url: getTextContent(shopEl.querySelector('url')),
    }
}

function parseCategories(ymlCatalog: Element | null): Catalog['categories'] {
  const categories: Catalog['categories'] = []
  const categoryEls = ymlCatalog?.querySelectorAll('categories > category') ?? []

  categoryEls.forEach((el) => {
    const id = toInt(el.getAttribute('id'))
    if (id == null) return

    categories.push({
      id,
      parentId: toInt(el.getAttribute('parentId')),
      name: getTextContent(el),
    })
  })

  return categories
}

function parseOffers(ymlCatalog: Element | null): Catalog['offers'] {
    const offers: Catalog['offers'] = []
    const offerEls = ymlCatalog?.querySelectorAll('offers > offer') ?? []
  
    offerEls.forEach((offerEl) => {
      const id = offerEl.getAttribute('id')
      if (!id) return
  
      offers.push({
        id,
        idNum: toInt(id),
        available: toBooleanFromXmlAttr(offerEl.getAttribute('available')),
        name: getTextContent(offerEl.querySelector('name')),
        description: normalizeOfferDescription(
          getTextContent(offerEl.querySelector('description')),
        ),
        price: toNumber(getTextContent(offerEl.querySelector('price'))),
        currencyCode: getTextContent(offerEl.querySelector('currencyId')),
        currencyId: toInt(getTextContent(offerEl.querySelector('currencyId'))),
        categoryId: toInt(getTextContent(offerEl.querySelector('categoryId'))),
        url: getTextContent(offerEl.querySelector('url')),
        picture: getTextContent(offerEl.querySelector('picture')),
      })
    })
  
    return offers
  }

function toNumber(text: string | null): number | null {
  if (!text) return null
  const n = Number(text.replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function toBooleanFromXmlAttr(value: string | null): boolean | null {
  if (value == null) return null
  if (value === 'true') return true
  if (value === 'false') return false
  return null
}

async function getCatalog(): Promise<Catalog> {
  const res = await fetch(CATALOG_XML_PATH)
  if (!res.ok) {
    throw new Error(`Failed to load ${CATALOG_XML_PATH}: ${res.status} ${res.statusText}`)
  }

  const xmlText = await res.text()
  const doc = ensureParsedXml(xmlText)

  // Пока читаем ТОЛЬКО тег `yml_catalog` (как подготовка к дальнейшему разбору).
  const ymlCatalog = doc.querySelector('yml_catalog')
  const date = ymlCatalog?.getAttribute('date') ?? null

  const shop = parseShop(ymlCatalog)

  const categories = parseCategories(ymlCatalog)

  const offers = parseOffers(ymlCatalog)

  return { date, shop, categories, offers }
}

export const catalogXml: CatalogRepository = {
  getCatalog,
}


