<script setup>
const query = defineModel({ type: String, default: '' })

defineProps({
  isLoading: { type: Boolean, default: false },
  error: { type: Object, default: null },
  shown: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  delay: { type: Number, default: 0 },
})
</script>

<template>
  <form class="search-panel" role="search" @submit.prevent>
    <label class="search-panel__label" for="product-search">
      Пошук у каталозі
    </label>
    <div class="search-panel__control">
      <svg class="search-panel__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
      </svg>
      <input
        id="product-search"
        v-model="query"
        class="search-panel__input"
        type="search"
        placeholder="Наприклад: phone"
        autocomplete="off"
      />
    </div>
    <p class="search-panel__status" aria-live="polite">
      <span
        class="search-panel__status-dot"
        :class="{ 'search-panel__status-dot--active': isLoading }"
      ></span>
      <span v-if="isLoading">Завантажуємо товари…</span>
      <span v-else-if="error">Не вдалося отримати товари</span>
      <span v-else>Показано {{ shown }} із {{ total }} товарів</span>
      <span class="search-panel__delay">API +{{ delay }} мс</span>
    </p>
  </form>
</template>