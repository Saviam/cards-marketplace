import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'


import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'


import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ProgressBar from 'primevue/progressbar'
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'


import EmptyState from './shared/components/EmptyState.vue'

import App from './App.vue'
import router from './router'

import './style.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Configuração do PrimeVue 4
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: false,
      cssLayer: false
    }
  }
})

//  Serviços (ordem importa!)
app.use(ToastService)
app.use(ConfirmationService)

console.log('🔵 [main.ts] Registrando componentes PrimeVue...')

//  Componentes globais
app.component('PButton', Button)
app.component('PDialog', Dialog)
app.component('PCard', Card)
app.component('PInputText', InputText)
app.component('PToast', Toast)
app.component('PProgressBar', ProgressBar)
app.component('PSkeleton', Skeleton)
app.component('PTag', Tag)
app.component('PAvatar', Avatar)
app.component('EmptyState', EmptyState)

console.log('✅ [main.ts] Componentes registrados')

app.mount('#app')