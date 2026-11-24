<script setup>
import { requestLog } from '../api/products.js'

const enabled = new URLSearchParams(window.location.search).has('debug')
</script>

<template>
  <aside v-if="enabled" class="debug-log" aria-label="Журнал запитів">
    <strong class="debug-log__title">Журнал запитів</strong>
    <ul class="debug-log__list">
      <li v-for="item in requestLog" :key="item.id" :class="`debug-log__item debug-log__item--${item.state}`">
        #{{ item.id }} · {{ item.label }} — {{ item.state }}
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.debug-log {
  position: fixed;
  right: 12px;
  bottom: 12px;
  z-index: 50;
  max-width: 340px;
  padding: 10px 12px;
  background: #111;
  color: #f4f1ea;
  font: 12px/1.5 monospace;
}
.debug-log__title { display: block; margin-bottom: 6px; }
.debug-log__list { margin: 0; padding: 0; list-style: none; }
.debug-log__item--pending { color: #ffd166; }
.debug-log__item--ok { color: #7bd88f; }
.debug-log__item--canceled { color: #9aa0a6; }
.debug-log__item--error { color: #ff6b6b; }
</style>