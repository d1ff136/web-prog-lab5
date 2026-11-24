import { computed, onScopeDispose, ref, watch } from 'vue'
import { fetchProductsPage } from '../api/products.js'

/**
 * Завантажує товари за пошуковим текстом (query — ref) і підвантажує наступні сторінки.
 * Новий запит скасовує попередній, а відповідь, що запізнилась, ігнорується.
 */
export function useProducts(query) {
  const products = ref([])
  const total = ref(0)
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref(null)
  const loadMoreError = ref(null)

  const hasMore = computed(() => products.value.length < total.value)

  let controller = null

  async function load() {
    controller?.abort()
    const current = new AbortController()
    controller = current

    isLoading.value = true
    isLoadingMore.value = false
    error.value = null
    loadMoreError.value = null

    try {
      const page = await fetchProductsPage({
        query: query.value,
        skip: 0,
        signal: current.signal,
      })

      if (current.signal.aborted)
        return

      products.value = page.products
      total.value = page.total
    } catch (cause) {
      if (current.signal.aborted)
        return

      products.value = []
      total.value = 0
      error.value = cause
    } finally {
      if (controller === current)
        isLoading.value = false
    }
  }

  async function loadMore() {
    if (isLoading.value || isLoadingMore.value || loadMoreError.value || !hasMore.value)
      return

    const current = new AbortController()
    controller = current
    isLoadingMore.value = true

    try {
      const page = await fetchProductsPage({
        query: query.value,
        skip: products.value.length,
        signal: current.signal,
      })

      if (current.signal.aborted)
        return

      if (page.products.length === 0) {
        // сервер більше нічого не віддає: зупиняємо подальші спроби
        total.value = products.value.length
        return
      }

      products.value = [...products.value, ...page.products]
      total.value = page.total
    } catch (cause) {
      if (current.signal.aborted)
        return

      loadMoreError.value = cause
    } finally {
      if (controller === current)
        isLoadingMore.value = false
    }
  }

  function retryMore() {
    loadMoreError.value = null
    return loadMore()
  }

  watch(query, load, { immediate: true })
  onScopeDispose(() => controller?.abort())

  return {
    products,
    total,
    isLoading,
    isLoadingMore,
    error,
    loadMoreError,
    hasMore,
    reload: load,
    loadMore,
    retryMore,
  }
}