<template>
  <div class="relative w-full overflow-hidden bg-neutral-900">
    <!-- Carousel Container -->
    <div class="relative h-[300px] md:h-[400px] lg:h-[450px]">
      <!-- Slides -->
      <Transition name="fade" mode="out-in">
        <div :key="currentSlide" class="absolute inset-0 w-full h-full">
          <!-- Background Image -->
          <img
            :src="slides[currentSlide]?.image"
            :alt="slides[currentSlide]?.title"
            class="w-full h-full object-cover object-center"
            loading="eager"
          />
          
          <!-- Gradient Overlay (bottom only) -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          
          <!-- Content - z-10 para ficar acima do gradiente -->
          <div class="absolute inset-0 z-10 flex flex-col items-center justify-end pb-12 px-4 text-center">
            
            <!-- Badge - Tamanho consistente -->
    <div class="mb-4 md:mb-6 inline-flex items-center gap-2 px-4 py-2 bg-primary-600/90 rounded-full backdrop-blur-sm shadow-lg whitespace-nowrap">
      <i class="pi pi-sparkles text-yellow-300 text-sm"></i>
      <span class="text-white font-semibold text-xs md:text-sm">
        {{ slides[currentSlide]?.badge }}
      </span>
    </div>

    <!-- Title - Responsivo -->
    <h1 class="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-2xl leading-tight px-2">
      {{ slides[currentSlide]?.title }}
    </h1>

    <!-- Subtitle - Responsivo -->
    <p class="text-xs md:text-xl text-neutral-200 mb-6 max-w-xl drop-shadow-lg px-4">
      {{ slides[currentSlide]?.subtitle }}
    </p>

    <!-- CTA Buttons - Responsivo -->
    <div class="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto px-4">
      <ButtonItem
        variant="primary"
        size="md"
        @click="goToMarketplace"
        class="px-6 py-3 text-sm md:text-base font-semibold shadow-xl shadow-primary-500/50 w-full"
      >
        <i class="pi pi-shopping-cart mr-2"></i>
        Explorar
      </ButtonItem>
      
      <ButtonItem
        variant="secondary"
        size="md"
        @click="goToMyCards"
        class="px-6 py-3 text-sm md:text-base font-semibold bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 w-full"
      >
        <i class="pi pi-id-card mr-2"></i>
        Minhas Cartas
      </ButtonItem>
    </div>
          </div>
        </div>
      </Transition>

      <!-- Dots Navigation -->
      <div class="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        <button
          v-for="(slide, index) in slides"
          :key="index"
          @click="currentSlide = index"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="currentSlide === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import ButtonItem from '@/shared/components/ButtonItem.vue'

const router = useRouter()
const currentSlide = ref(0)

const slides = [
  {
    image: '/hero-banner-1.jpg',
    badge: '🎮 Melhor marketplace',
    title: 'FAÇA TROCAS ÉPICAS!',
    subtitle: 'Entre no melhor marketplace de troca de cartas!'
  },
  {
    image: '/hero-banner-2.jpg',
    badge: '⚡ Trocas rápidas',
    title: 'NEGOCIE COM FACILIDADE',
    subtitle: 'Encontre as cartas que faltam na sua coleção!'
  },
  {
    image: '/hero-banner-3.jpg',
    badge: '🏆 Comunidade ativa',
    title: 'JUNTE-SE A NÓS',
    subtitle: 'Milhares de jogadores esperando por você!'
  }
]

let interval: ReturnType<typeof setInterval> | null = null

function goToMarketplace() {
  router.push('/marketplace')
}

function goToMyCards() {
  router.push('/minhas-cartas')
}

function startAutoPlay() {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 5000)
}

function stopAutoPlay() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>