import { onScopeDispose, watch } from 'vue'

/**
 * Викликає onReach, коли елемент target (ref) потрапляє в зону видимості.
 * rearm() створює спостерігач заново, щоб подія надійшла, навіть якщо
 * маркер залишився видимим після завантаження сторінки.
 */
export function useInfiniteScroll(target, onReach, { rootMargin = '240px 0px' } = {}) {
  let observer = null

  function stop() {
    observer?.disconnect()
    observer = null
  }

  function start(element) {
    stop()

    if (!element || typeof IntersectionObserver === 'undefined')
      return

    observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting))
        onReach()
    }, { rootMargin })

    observer.observe(element)
  }

  watch(target, start, { immediate: true, flush: 'post' })
  onScopeDispose(stop)

  return { rearm: () => start(target.value) }
}