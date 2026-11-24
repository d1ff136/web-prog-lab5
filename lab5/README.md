# Лабораторна робота 5 — Каталог і composables (Vue 3)

- **Студент:** Могилін Владислав Олександрович, група 6.1224
- **Стек:** Vue 3, Vite 7, DummyJSON API

## Запуск

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # виробнича збірка в dist/
```

## Що реалізовано

- **Реактивний пошук** (`src/composables/useDebouncedRef.js`, `useProducts.js`): затримка 400 мс (debounce);
  новий запит скасовує попередній через `AbortController`, відповідь, що запізнилась, ігнорується.
- **Автозавантаження** (`src/composables/useInfiniteScroll.js`): `IntersectionObserver` стежить за нижнім маркером
  і підвантажує наступну сторінку (`skip`); окремі стани завантаження, кінця списку та помилки з кнопкою «Повторити».
- **Компоненти**: `SearchPanel.vue` (форма й статус), `ProductCatalog.vue` (список і стани),
  `ProductCard.vue` (картка). `App.vue` лише складає їх разом.
- Стани: завантаження (скелетони), порожній результат, помилка початкового завантаження та підвантаження.

## Структура
    src/
      api/products.js                    адреси та fetchProductsPage()
      composables/useDebouncedRef.js     затримка введення
      composables/useProducts.js         завантаження, пошук, підвантаження
      composables/useInfiniteScroll.js   спостерігач нижнього маркера
      components/SearchPanel.vue         форма пошуку й статус
      components/ProductCatalog.vue      список і стани каталогу
      components/ProductCard.vue         картка товару
      App.vue                            складання компонентів
## Налагодження

Додайте `?debug` до адреси (наприклад, `http://localhost:5173/?debug`), щоб побачити журнал запитів до API:
`pending`, `ok`, `canceled` (скасовано новим запитом) або `error`. Без параметра панель не показується.