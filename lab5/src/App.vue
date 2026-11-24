<script setup>
import { computed, ref } from 'vue'
import { API_DELAY } from './api/products.js'
import ProductCatalog from './components/ProductCatalog.vue'
import DebugLog from './components/DebugLog.vue'
import SearchPanel from './components/SearchPanel.vue'
import { useDebouncedRef } from './composables/useDebouncedRef.js'
import { useProducts } from './composables/useProducts.js'

const query = ref('')
const debouncedQuery = useDebouncedRef(query, 400)
const {
  products, total, isLoading, isLoadingMore, error, loadMoreError, hasMore,
  reload, loadMore, retryMore,
} = useProducts(debouncedQuery)

const catalogTitle = computed(() => {
  const text = debouncedQuery.value.trim()
  return text ? `Результати пошуку: «${text}»` : 'Початкова добірка'
})
</script>

<template>
  <main class="storefront">
    <header class="storefront__masthead">
      <a class="storefront__brand" href="#" aria-label="Forma, на початок">
        FORMA<span class="storefront__brand-mark">®</span>
      </a>
      <p class="storefront__edition">Лабораторна / 05</p>
      <p class="storefront__note">Каталог і composables</p>
    </header>

    <section class="storefront__hero">
      <div class="storefront__intro">
        <p class="storefront__eyebrow">Заготовка інтерфейсу</p>
        <h1 class="storefront__title">
          Речі з ясною
          <em class="storefront__title-accent">формою</em>
        </h1>
      </div>

      <SearchPanel
        v-model="query"
        :is-loading="isLoading"
        :error="error"
        :shown="products.length"
        :total="total"
        :delay="API_DELAY"
      />
    </section>

    <ProductCatalog
      :products="products"
      :total="total"
      :is-loading="isLoading"
      :error="error"
      :title="catalogTitle"
      :is-loading-more="isLoadingMore"
      :has-more="hasMore"
      :load-more-error="loadMoreError"
      @retry="reload"
      @load-more="loadMore"
      @retry-more="retryMore"
    />

    <footer class="storefront__footer">
      <p>Студент: Могилін Владислав Олександрович · група 6.1224</p>
      <a href="https://dummyjson.com/docs/products" target="_blank" rel="noreferrer">
        Дані: DummyJSON
      </a>
    </footer>
    <DebugLog />
  </main>
</template>