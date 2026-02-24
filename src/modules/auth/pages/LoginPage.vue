<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { useAuthStore } from '../../../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const emailError = ref<string | null>(null)
const passwordError = ref<string | null>(null)

function validate() {
  emailError.value = null
  passwordError.value = null

  if (!email.value) {
    emailError.value = 'Email é obrigatório'
  }

  if (!password.value) {
    passwordError.value = 'Senha é obrigatória'
  }

  return !emailError.value && !passwordError.value
}

async function handleLogin() {
  if (!validate()) return

  try {
    await authService.login({
      email: email.value,
      password: password.value
    })

    router.push('/')
  } catch {
    // erro já tratado na store
  }
}
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>

    <form @submit.prevent="handleLogin">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" />
        <span v-if="emailError">{{ emailError }}</span>
      </div>

      <div>
        <label>Senha</label>
        <input v-model="password" type="password" />
        <span v-if="passwordError">{{ passwordError }}</span>
      </div>

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <p v-if="authStore.error" class="error">
        {{ authStore.error }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
}

form > div {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

span {
  color: red;
  font-size: 12px;
}

.error {
  color: red;
  margin-top: 12px;
}
</style>