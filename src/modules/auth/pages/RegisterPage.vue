<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

function handleRegister() {
  // Simulação temporária
  console.log('Registrando:', {
    name: name.value,
    email: email.value,
    password: password.value
  })

  router.push('/login')
}
</script>

<template>
  <div class="register-container">
    <h1>Registro</h1>

    <form @submit.prevent="handleRegister">
      <div>
        <label>Nome</label>
        <input v-model="name" type="text" required />
      </div>

      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Senha</label>
        <input v-model="password" type="password" required />
      </div>

      <button type="submit">
        Criar Conta
      </button>
    </form>
  </div>
</template>

<style scoped>
.register-container {
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

button {
  padding: 8px;
  cursor: pointer;
}
</style>