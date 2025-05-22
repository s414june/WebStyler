<template>
  <div @click="showMenu = false" class="outside" :class="{ extended: showEditor }">
    <QueryInput v-model:showMenu="showMenu" @loadPage="loadPage" @showEditor="showEditor = true" />
    <div :class="{ extended: showEditor }">
      <template v-if="htmlContent">
        <div v-html="htmlContent" :class="{ 'flex-1': showEditor }"></div>
      </template>
      <CssEditor
        v-model:showEditor="showEditor"
        @close="showEditor = false"
        @apply="applyCustomCss"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import QueryInput from './QueryInput.vue'
import CssEditor from './CssEditor.vue'
import { rewriteRelativeUrlsToAbsolute } from '@/utils/rewriteRelativeUrlsToAbsolute'

const showMenu = ref(false)
const showEditor = ref(false)
const htmlContent = ref('')

async function loadPage(url: string) {
  if (!url.trim()) return

  const proxyBase = 'https://webstyler-cloudflare-api.webstyler-api.workers.dev'
  const encodedUrl = encodeURIComponent(url)
  const fullUrl = `${proxyBase}/?url=${encodedUrl}`

  try {
    const res = await axios.get(fullUrl, { responseType: 'text' })
    htmlContent.value = rewriteRelativeUrlsToAbsolute(res.data, url)

    const doc = new DOMParser().parseFromString(htmlContent.value, 'text/html')
    const title = doc.querySelector('title')?.innerText || 'Untitled'
    document.title = `${title} - WebStyler`
  } catch (err: unknown) {
    htmlContent.value = `<p class="text-red-600">錯誤：${err.message}</p>`
  }
}

function applyCustomCss(css: string) {
  let styleEl = document.getElementById('webstyler-custom-css') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'webstyler-custom-css'
    document.head.appendChild(styleEl)
  }
  styleEl.innerHTML = css
}
</script>
<style scoped>
.extended {
  width: calc(100dvw + 20rem);
  display: flex;
  flex-grow: 1;
  height: 100%;
}

.outside.extended {
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
