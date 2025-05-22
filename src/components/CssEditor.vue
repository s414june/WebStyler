<template>
  <div
    v-if="props.showEditor"
    @click.self="emit('close')"
    class="h-screen relative flex flex-col sticky top-0 left-0 z-50 w-80"
  >
    <div class="border-l bg-zinc-50 flex-1 w-full">
      <div class="p-3 pt-5 h-full flex flex-col">
        <h2 class="text-sm font-bold mb-2">自訂 CSS</h2>
        <textarea
          v-model="css"
          class="w-full h-full resize-none border rounded p-2 font-mono text-xs"
          placeholder="寫點 CSS 試試吧"
          @input="applyCustomCss"
        ></textarea>
        <div class="flex justify-end gap-2 mt-3">
          <button @click="emit('close')" class="px-4 py-1 bg-gray-300 rounded">取消</button>
          <button @click="applyCss" class="px-4 py-1 bg-blue-500 text-white rounded">套用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  showEditor: boolean
}>()

const emit = defineEmits<{
  (e: 'update:showEditor', val: boolean): void
  (e: 'close'): void
  (e: 'apply', css: string): void
}>()

const css = ref('')

function applyCss() {
  emit('apply', css.value)
  emit('close')
}
</script>
