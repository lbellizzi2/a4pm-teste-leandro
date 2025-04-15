<template>
  <v-card class="mb-4" data-testId="recipe-card" outlined>
    <v-card-title>{{ recipe.nome }}</v-card-title>

    <v-card-text>
      <p data-testId="author"><strong>Autor:</strong> {{ recipe.user.nome }}</p>
      <p data-testId="category"><strong>Categoria:</strong> {{ recipe.categoria.nome }}</p>
      <p data-testId="prepare-time"><strong>Tempo de Preparo:</strong> {{ recipe.tempo_preparo_minutos }} minutos</p>
      <p data-testId="created-at"><strong>Criado em:</strong> {{ new Date(recipe.criado_em).toLocaleDateString() }}</p>
    </v-card-text>

    <v-card-actions>
      <v-btn text color="primary" data-testId="details-button" @click="verDetalhes">
        Ver detalhes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useRouter } from 'vue-router'


const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function verDetalhes() {
  router.push(`/recipe/${props.recipe.id}`)
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
</style>
