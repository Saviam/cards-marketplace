import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/modules/auth/services/authService'
import { TOAST_LIFE_MS } from '@/core/constants'

export function useAuth() {
  const router = useRouter()
  const toast = useToast()
  const authStore = useAuthStore()
  
  const loading = ref(false)
  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)

  async function login() {
    if (!email.value || !password.value) {
      toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha email e senha',
        life: 3000
      })
      return
    }

    loading.value = true

    try {
      const response = await authService.login({
        email: email.value,
        password: password.value
      })

      authStore.setAuth(response.token, response.user)

      toast.add({
        severity: 'success',
        summary: 'Login realizado',
        detail: 'Bem-vindo de volta!',
        life: 3000
      })

      router.push('/marketplace')
    } catch (e) {
      toast.add({
        severity: 'error',
        summary: 'Erro no login',
        detail: 'Email ou senha inválidos',
        life: 3000
      })
    } finally {
      loading.value = false
    }
  }

  function togglePassword() {
    showPassword.value = !showPassword.value
  }

  function clearForm() {
    email.value = ''
    password.value = ''
    showPassword.value = false
  }

  return {
    loading,
    email,
    password,
    showPassword,
    login,
    togglePassword,
    clearForm
  }
}