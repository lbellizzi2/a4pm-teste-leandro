<template>
  <v-app>
    <v-main class="main-with-appbar">
      <v-container class="page-container">
        <v-card class="register-card">
          <v-card-title class="text-h5">Cadastro</v-card-title>
          <v-card-text>
            <v-text-field 
              v-model="name" 
              label="Nome" 
              outlined 
              :error="!!errors.name" 
              :error-messages="errors.name"
              @blur="validateField('name')"
            />
            <v-text-field 
              v-model="email" 
              label="Email" 
              outlined 
              :error="!!errors.email" 
              :error-messages="errors.email"
              @blur="validateField('email')"
            />
            <v-text-field 
              v-model="password" 
              label="Senha" 
              type="password" 
              outlined 
              :error="!!errors.password" 
              :error-messages="errors.password"
              @blur="validateField('password')"
            />
            <v-text-field 
              v-model="confirmPassword" 
              label="Confirme a senha" 
              type="password" 
              outlined 
              :error="!!errors.confirmPassword" 
              :error-messages="errors.confirmPassword"
              @blur="validateField('confirmPassword')"
            />
            <div v-if="apiError" class="error-message">{{ apiError }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn :loading="loading" color="primary" @click="register">Cadastrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import * as yup from 'yup'
import { userStore } from '../stores/userStore'

const { $axios } = useNuxtApp()
const { setUserData } = userStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errors = ref({})
const apiError = ref('')

const registerSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'As senhas devem coincidir')
    .required('Confirmação de senha é obrigatória')
})

async function validateField(field) {
  try {
    await registerSchema.validateAt(field, { 
      name: name.value, 
      email: email.value, 
      password: password.value, 
      confirmPassword: confirmPassword.value 
    })
    errors.value[field] = null // Clear error if validation passes
  } catch (err) {
    errors.value[field] = err.message // Set error message for the field
  }
}

async function register() {
  loading.value = true
  errors.value = {}
  apiError.value = ''
  try {
    await registerSchema.validate(
      { name: name.value, email: email.value, password: password.value, confirmPassword: confirmPassword.value },
      { abortEarly: false }
    )
    await $axios.post('/users', { nome: name.value, login: email.value, senha: password.value })
    
    const loginResponse = await $axios.post('/auth/login', { email: email.value, password: password.value })
    setUserData(loginResponse.data.data)
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.inner.forEach((err) => {
        errors.value[err.path] = err.message
      })
    } else if (error.response && error.response.data.errors) {
      error.response.data.errors.forEach((err) => {
        errors.value[err.param] = err.msg
      })
    } else {
      apiError.value = 'Erro ao cadastrar usuário. Tente novamente mais tarde.'
      console.error('Erro ao cadastrar usuário:', error)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-card {
  margin: 50px auto;
  max-width: 400px;
  padding: 20px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
