<template>
  <component
    :is="tag"
    class="inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200"
    :class="[
      variantClasses[variant],
      sizeClasses[size],
      { 'opacity-60 cursor-not-allowed': disabled || loading }
    ]"
    :disabled="disabled || loading"
    :type="type"
    :to="to"
  >
    <i v-if="loading" class="pi pi-spin pi-spinner"></i>
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  tag?: 'button' | 'a' | 'router-link'
  to?: string
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  tag: 'button',
  loading: false,
  disabled: false
})

const variantClasses: Record<string, string> = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white border-0 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40',
  secondary: 'bg-white text-neutral-700 border-2 border-neutral-200 hover:border-primary-300 hover:bg-neutral-50',
  danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white border-0 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40',
  ghost: 'bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 border-0'
}

const sizeClasses: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}
</script>