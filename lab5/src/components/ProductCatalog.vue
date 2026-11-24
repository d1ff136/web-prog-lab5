<script setup>
import { ref, watch } from 'vue'
import { useInfiniteScroll } from '../composables/useInfiniteScroll.js'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  products: { type: Array, required: true },
  total: { type: Number, default: 0 },
  isLoading: { type: Boolean, default: false },
  isLoadingMore: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
  error: { type: Object, default: null },
  loadMoreError: { type: Object, default: null },
  title: { type: String, default: 'Каталог' },
})

const emit = defineEmits(['retry', 'load-more', 'retry-more'])

const marker = ref(null)
const { rearm } = useInfiniteScroll(marker, () => emit('load-more'))

// після кожної зміни списку перевіряємо, чи маркер усе ще видно
watch(
  () => [props.products.length, props.isLoadingMore, props.loadMoreError],
  rearm,
  { flush: 'post' },
)
</script>

<template>
  <section class="catalog" aria-labelledby="catalog-title">
    <div class="catalog__heading">
      <h2 id="catalog-title" class="catalog__title">{{ title }}</h2>
      <span class="catalog__count">{{ products.length.toString().padStart(2, '0') }}</span>
    </div>

    <div v-if="products.length" class="catalog__grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <div
      v-if="products.length"
      ref="marker"
      class="catalog__load-more"
      aria-live="polite"
    >
      <span class="catalog__load-progress">{{ products.length }} / {{ total }}</span>
      <div class="catalog__load-copy">
        <template v-if="loadMoreError">
          <strong class="catalog__load-title">Не вдалося завантажити наступні товари</strong>
          <button class="catalog__retry" type="button" @click="$emit('retry-more')">
            Повторити
          </button>
        </template>
        <template v-else-if="isLoadingMore">
          <strong class="catalog__load-title">Завантажуємо наступні товари…</strong>
        </template>
        <template v-else-if="hasMore">
          <strong class="catalog__load-title">Прокрутіть далі</strong>
          <span class="catalog__load-text">Наступні товари завантажаться автоматично</span>
        </template>
        <template v-else>
          <strong class="catalog__load-title">Показано всі товари</strong>
        </template>
      </div>
    </div>

    <div v-else-if="isLoading" class="catalog__skeletons" aria-hidden="true">
      <div v-for="item in 6" :key="item" class="catalog__skeleton"></div>
    </div>

    <div v-else-if="!isLoading && !error" class="catalog__message">
      <p class="catalog__message-index">0 / {{ total }}</p>
      <h2 class="catalog__message-title">Нічого не знайдено</h2>
      <p class="catalog__message-text">Змініть пошуковий запит.</p>
    </div>

    <div v-else-if="error" class="catalog__message catalog__message--error">
      <p class="catalog__message-index">ERR / API</p>
      <h2 class="catalog__message-title">Каталог тимчасово недоступний</h2>
      <p class="catalog__message-text">{{ error.message }}</p>
      <button class="catalog__retry" type="button" @click="$emit('retry')">
        Повторити запит
      </button>
    </div>
  </section>
</template>