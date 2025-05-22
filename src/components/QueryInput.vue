<template>
  <div class="!fixed !w-full !bg-white style-isolated" style="z-index: 1000" :class="{ '!hidden': !isVisible }">
    <div class="!flex !items-center !gap-2 !w-full">
      <input v-model="url" @focus="isFocused = true" @blur="isFocused = false" @keyup.enter="loadPage"
        placeholder="https://example.com"
        class="!transition-opacity !duration-300 !border !border-zinc-300 !rounded !p-2 !text-sm !focus:outline-none !focus:ring-1 !focus:ring-blue-500 !flex-1" />
      <!-- 三點按鈕 -->
      <button @click.stop="toggleMenu" class="!px-2 !text-xl">⋯</button>
      <!-- 選單 -->
      <div v-if="showMenu"
        class="!overflow-hidden !absolute !right-0 !top-full !mt-2 !w-40 !bg-white !shadow-lg !shadow !rounded !z-10 !text-sm">
        <button class="!block !border-none !w-full !text-left !px-4 !py-2 !hover:bg-zinc-100" @click="openOriginalSite">
          跳回原網頁
        </button>
        <button class="!block !border-none !w-full !text-left !px-4 !py-2 !hover:bg-zinc-100"
          @click="emit('showEditor')">
          編輯css樣式
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// QueryInput.vue <script setup>
const props = defineProps<{
  showMenu: boolean
}>()

const emit = defineEmits<{
  (e: 'update:showMenu', val: boolean): void
  (e: 'loadPage', url: string): void
  (e: 'showEditor'): void
}>()

function toggleMenu() {
  emit('update:showMenu', !props.showMenu)
}

const isFocused = ref(false)
const isVisible = ref(true)
let lastScrollTime = Date.now()
const url = ref('')

async function loadPage() {
  emit('loadPage', url.value)
}

function checkVisibility() {
  const now = Date.now()
  const recentlyScrolled = now - lastScrollTime < 1500
  const atTop = window.scrollY === 0

  isVisible.value = isFocused.value || recentlyScrolled || atTop
}

function handleScroll() {
  lastScrollTime = Date.now()
  checkVisibility()
}

function openOriginalSite() {
  if (url.value) {
    window.open(url.value, '_blank')
    emit('update:showMenu', false)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  const interval = setInterval(checkVisibility, 1000)

  onUnmounted(() => {
    clearInterval(interval)
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>
<style scoped>
.style-isolated,
.style-isolated * {
  all: initial;
  font-family: sans-serif;
}
</style>
