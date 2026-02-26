import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/modules/auth/services/authService'

export function useRegister() {
  const router = useRouter()
  const toast = useToast()
  const authStore = useAuthStore()
  
  const loading = ref(false)
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const acceptTerms = ref(false)

  async function register() {
    if (!name.value || !email.value || !password.value) {
      toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios',
        life: 3000
      })
      return
    }

    if (password.value !== confirmPassword.value) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'As senhas não coincidem',
        life: 3000
      })
      return
    }

    if (!acceptTerms.value) {
      toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Aceite os termos para continuar',
        life: 3000
      })
      return
    }

    loading.value = true

    try {
      await authService.register({
        name: name.value,
        email: email.value,
        password: password.value
      })

      toast.add({
        severity: 'success',
        summary: 'Conta criada',
        detail: 'Faça login para continuar',
        life: 3000
      })

      router.push('/login')
    } catch (e) {
      toast.add({
        severity: 'error',
        summary: 'Erro no registro',
        detail: 'Email já cadastrado ou erro no servidor',
        life: 3000
      })
    } finally {
      loading.value = false
    }
  }

  function togglePassword() {
    showPassword.value = !showPassword.value
  }

  function toggleConfirmPassword() {
    showConfirmPassword.value = !showConfirmPassword.value
  }

  return {
    loading,
    name,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    acceptTerms,
    register,
    togglePassword,
    toggleConfirmPassword
  }
}