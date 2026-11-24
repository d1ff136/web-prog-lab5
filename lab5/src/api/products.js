import { reactive } from 'vue'

const API_URL = 'https://dummyjson.com/products'

export const PAGE_SIZE = 12
export const API_DELAY = 1500

/** Журнал запитів для налагодження (показується за адреси з ?debug). */
export const requestLog = reactive([])
let counter = 0

/** Адреса сторінки каталогу: без пошукового тексту або пошук /search?q=... */
export function createProductsUrl({ query = '', skip = 0 } = {}) {
  const search = query.trim()
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    skip: String(skip),
    delay: String(API_DELAY),
  })

  if (search)
    params.set('q', search)

  return `${API_URL}${search ? '/search' : ''}?${params}`
}

export function createInitialProductsUrl() {
  return createProductsUrl()
}

/** Завантажує одну сторінку; signal дозволяє скасувати запит. */
export async function fetchProductsPage({ query = '', skip = 0, signal } = {}) {
  const entry = reactive({
    id: ++counter,
    label: `q=${query.trim() || '—'} skip=${skip}`,
    state: 'pending',
  })
  requestLog.unshift(entry)
  if (requestLog.length > 8)
    requestLog.pop()

  try {
    const response = await fetch(createProductsUrl({ query, skip }), { signal })

    if (!response.ok)
      throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    entry.state = 'ok'
    return data
  } catch (cause) {
    entry.state = signal?.aborted ? 'canceled' : 'error'
    throw cause
  }
}