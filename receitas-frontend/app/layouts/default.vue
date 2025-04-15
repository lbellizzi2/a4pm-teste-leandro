<template>
  <v-app>
    <AppBar />
    <v-main class="main-with-appbar">
      <v-container fluid class="page-container">
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import AppBar from '../components/AppBar.vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()

if (localStorage.getItem('user')) {
  const userData = JSON.parse(localStorage.getItem('user'))
  userStore.setUserData(userData)
}
</script>

<style scoped lang="scss">
/* Compensa o AppBar fixo, ajustando o padding-top conforme sua altura */
.main-with-appbar {
  padding-top: 70px; /* Ajuste esse valor se o AppBar tiver outra altura */
}

/* Define um container centralizado com a mesma largura e padding que o AppBar */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px; /* Mesmo padding horizontal usado no AppBar para alinhamento */
}

/* Garante que a aplicação ocupe a altura mínima total da janela */
.v-application--wrap {
  min-height: 100vh;
}
</style>
