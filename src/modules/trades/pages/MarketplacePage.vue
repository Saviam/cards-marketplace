<template>
  <div>
    <HeroBanner />
    <div class="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-neutral-900 mb-3">Marketplace</h1>
        <p class="text-neutral-500 text-lg max-w-2xl mx-auto">
          Encontre trocas disponíveis e negocie cartas com outros jogadores
        </p>
      </div>

      <LoadingSpinner v-if="loading && trades.length === 0" fullscreen message="Carregando solicitações..." />

      <EmptyState v-else-if="error" title="Ops! Algo deu errado" :description="error" icon="pi pi-exclamation-triangle">
        <template #actions>
          <PButton label="Tentar novamente" @click="fetchTrades(true)" class="bg-primary-600 border-0" />
        </template>
      </EmptyState>

      <EmptyState v-else-if="!trades?.length" title="Nenhuma solicitação disponível"
        description="Novas trocas aparecerão aqui em breve" icon="pi pi-inbox" />

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        <PCard v-for="trade in trades" :key="trade.id"
          class="w-full max-w-md hover:shadow-xl transition-all duration-300 border-0 rounded-xl overflow-hidden">
          <template #header>
            <div class="bg-gradient-to-br from-primary-50 to-accent-50 p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <i class="pi pi-exchange text-primary-600 text-xl"></i>
                  <span class="text-sm font-semibold text-primary-700">Troca</span>
                </div>
                <span class="text-xs text-neutral-500">{{ formatDate(trade.createdAt) }}</span>
              </div>

              <div class="flex items-center justify-between gap-4">
                <div class="flex-1 text-center">
                  <CardItem v-if="getOfferedCard(trade)" :card="getOfferedCard(trade)!" :selected="false"
                    :show-description="false" :show-date="false" />
                  <span class="inline-block mt-2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Oferece
                  </span>
                </div>

                <div class="flex items-center justify-center">
                  <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <i class="pi pi-arrow-right text-primary-600"></i>
                  </div>
                </div>

                <div class="flex-1 text-center">
                  <CardItem v-if="getRequestedCard(trade)" :card="getRequestedCard(trade)!" :selected="false"
                    :show-description="false" :show-date="false" />
                  <span class="inline-block mt-2 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Quer
                  </span>
                </div>
              </div>
            </div>
          </template>

          <template #content>
            <div class="space-y-3">
              <div class="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 px-3 py-2 rounded-lg">
                <i class="pi pi-user text-neutral-400"></i>
                <span class="font-medium">{{ trade.user?.name || 'Usuário' }}</span>
              </div>

              <div v-if="isOwner(trade)" class="flex gap-2 pt-2 border-t border-neutral-100">
                <PButton label="Excluir" severity="custom" size="small" :loading="deleting === trade.id"
                  @click="deleteTrade(trade.id)"
                  class="flex-1 rounded-lg border-0 bg-accent-500 text-white hover:bg-accent-700 transition-colors duration-200" />
              </div>
            </div>
          </template>
        </PCard>
      </div>

      <div v-if="more && !loading" class="text-center mt-10">
        <PButton label="Carregar mais" severity="secondary" @click="loadMore" class="rounded-lg border-0" />
      </div>

      <PToast />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardItem from '@/shared/components/CardItem.vue'
import { useMarketplace } from '@/composables/useMarketplace'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
import HeroBanner from '@/shared/components/HeroBanner.vue' 

const {
  trades,
  loading,
  error,
  more,
  deleting,
  isOwner,
  deleteTrade,
  loadMore,
  formatDate,
  fetchTrades,
  getOfferedCard,
  getRequestedCard
} = useMarketplace()
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>