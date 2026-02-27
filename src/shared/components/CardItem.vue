<template>
  <div
    class="relative border-2 rounded-xl overflow-hidden transition-all duration-200"
    :class="[
      selectable ? 'cursor-pointer hover:border-primary-300 hover:shadow-md' : '',
      selected ? 'border-primary-500 bg-primary-50 shadow-md' : 'border-neutral-200'
    ]"
    @click="handleClick"
  >
    <div class="relative">
      <img :src="card.imageUrl" :alt="card.name" class="w-full h-40 object-cover" />
      <div
        v-if="selected"
        class="absolute top-2 right-2 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg"
      >
        <i class="pi pi-check text-xs"></i>
      </div>
    </div>

    <div class="p-3">
      <h3 class="font-semibold text-neutral-900 text-sm line-clamp-1 mb-1">
        {{ card.name }}
      </h3>
      <p v-if="showDescription" class="text-xs text-neutral-500 line-clamp-2 mb-2">
        {{ card.description }}
      </p>
      <p v-if="showDate && card.createdAt" class="text-xs text-neutral-400 flex items-center gap-1">
        <i class="pi pi-calendar text-xs"></i>
        {{ formatDate(card.createdAt) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Card } from '@/types'

interface Props {
  card: Card
  selectable?: boolean
  selected?: boolean
  showDescription?: boolean
  showDate?: boolean
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selected: false,
  showDescription: false,
  showDate: false
})

const emit = defineEmits<Emits>()

function handleClick() {
  if (props.selectable) {
    emit('click')
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>