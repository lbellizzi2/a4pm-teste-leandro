<template>
  <v-app>
    <v-main class="main-with-appbar">
      <v-container class="page-container">
        <v-card class="login-card">
          <v-card-title class="text-h5">Login</v-card-title>
          <v-card-text>
            <v-text-field v-model="email" label="Email" outlined :error-messages="errors.email" />
            <v-text-field v-model="password" label="Senha" type="password" outlined :error-messages="errors.password" />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :loading="loading" @click="login">Entrar</v-btn>
          </v-card-actions>
          <v-card-text v-if="apiError" class="error-text">{{ apiError }}</v-card-text>
          <!-- Link para ir à página de cadastro -->
          <v-card-actions class="justify-center">
            <NuxtLink to="/register" class="register-link">
              Não tem conta? Cadastre-se
            </NuxtLink>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { useUserStore } from '../stores/userStore'


const { $axios } = useNuxtApp()

const email = ref('')
const password = ref('')
const errors = ref({ email: '', password: '' })
const apiError = ref('')
const loading = ref(false)
const router = useRouter()
const userStore = useUserStore()

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
})

async function login() {
  errors.value = { email: '', password: '' }
  apiError.value = ''
  try {
    loading.value = true
    await schema.validate({ email: email.value, password: password.value }, { abortEarly: false })
    const response = await $axios.post('/auth', { login: email.value, password: password.value })
    userStore.setUserData(response.data.data)
    router.push('/')
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.inner.forEach((validationError) => {
        errors.value[validationError.path] = validationError.message
      })
    } else if (err.response) {
      apiError.value = err.response.data.message || 'Erro ao realizar login'
    } else {
      apiError.value = 'Erro inesperado. Tente novamente mais tarde.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-container {
  width: 100%;
  height: 100%;
}

.login-card {
  margin: 50px auto;
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.register-link {
  text-decoration: none;
  color: #1976d2;
}

.error-text {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
