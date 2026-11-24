import { onScopeDispose, ref, watch } from 'vue'

/**
 * Повертає ref, який повторює source із затримкою:
 * поки користувач друкує, значення не змінюється.
 */
export function useDebouncedRef(source, delay = 400) {
  const debounced = ref(source.value)
  let timer = null

  watch(source, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  onScopeDispose(() => clearTimeout(timer))

  return debounced
}