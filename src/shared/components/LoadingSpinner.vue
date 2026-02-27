<template>
  <div
    class="flex flex-col items-center justify-center"
    :class="fullscreen ? 'fixed inset-0 bg-white/90 z-50' : 'p-8'"
  >
    <i class="pi pi-spin pi-spinner text-4xl text-primary-600 mb-3"></i>
    <p v-if="message" class="text-neutral-500 text-sm font-medium">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  fullscreen?: boolean
  message?: string
}

withDefaults(defineProps<Props>(), {
  fullscreen: false,
  message: ''
})
</script>