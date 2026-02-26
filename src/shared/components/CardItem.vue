<template>
  <div class="card-item" :class="{ selectable, selected }" @click="handleClick">
    <img :src="card.imageUrl" :alt="card.name" class="card-image" />
    <div class="card-content">
      <h3 class="card-title">{{ card.name }}</h3>
      <p v-if="showDescription" class="card-description">{{ card.description }}</p>
      <p v-if="showDate" class="card-date">{{ formatDate(card.createdAt) }}</p>
    </div>
    <div v-if="selected" class="checkmark">✓</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  card: {
    id: string
    name: string
    description: string
    imageUrl: string
    createdAt: string
  }
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
  return new Date(date).toLocaleDateString('pt-BR')
}
</script>

<style scoped>
.card-item {
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  transition: all 0.2s;
}

.card-item.selectable {
  cursor: pointer;
}

.card-item.selectable:hover {
  border-color: #4f46e5;
  transform: translateY(-2px);
}

.card-item.selected {
  border-color: #4f46e5;
  background: #eef2ff;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #f5f5f5;
}

.card-content {
  padding: 0.75rem;
}

.card-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #333;
}

.card-description {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-date {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #999;
}

.checkmark {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #4f46e5;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.card-item.selected {
  position: relative;
}
</style>