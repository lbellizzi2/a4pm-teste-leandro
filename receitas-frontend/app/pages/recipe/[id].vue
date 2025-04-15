<template>
  <v-app>
    <v-main class="main-with-appbar">
      <v-container class="page-container">
        <nav class="breadcrumb">
          <NuxtLink to="/">Início</NuxtLink>
          <NuxtLink to="/recipes"> / Minhas Receitas</NuxtLink>
          <span v-if="!loading"> / {{ recipe.nome }}</span>
        </nav>
        <div class="text-right mb-4">
          <v-btn 
            color="primary" 
            @click="printRecipe"
            prepend-icon="mdi-printer"
          >
            Imprimir Receita
          </v-btn>
        </div>
        <v-card class="recipe-detail-card" v-if="!loading">
          <v-card-title class="text-h5 d-flex justify-space-between align-center">
            {{ recipe.nome }}
            <div>
              <v-chip color="primary" class="ma-2" outlined>
                <strong>Tempo:</strong> {{ recipe.tempo_preparo_minutos }} min
              </v-chip>
              <v-chip color="secondary" class="ma-2" outlined>
                <strong>Porções:</strong> {{ recipe.porcoes }}
              </v-chip>
            </div>
          </v-card-title>
          <v-card-subtitle class="text-subtitle-2">
            Criado por {{ recipe.user.nome }} em {{ new Date(recipe.criado_em).toLocaleDateString() }} | Atualizado em {{ new Date(recipe.alterado_em).toLocaleDateString() }}
          </v-card-subtitle>
          <v-card-text>
            <p>{{ recipe.descricao }}</p>
            <h3 class="section-title">Ingredientes</h3>
            <ul class="ingredients-list">
              <li v-for="(ingredient, index) in recipe.ingredientes.split(',')" :key="index">
                {{ ingredient.trim() }}
              </li>
            </ul>
            <h3 class="section-title">Modo de Preparo</h3>
            <p class="preparation-text">{{ recipe.modo_preparo }}</p>
          </v-card-text>
        </v-card>
        <v-progress-circular v-else indeterminate color="primary" class="loading-indicator"></v-progress-circular>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const recipeId = route.params.id

const recipe = ref({})
const loading = ref(true)
const { $axios } = useNuxtApp()

onMounted(async () => {
  try {
    const response = await $axios.get(`/recipes/${recipeId}`)
    recipe.value = response.data.data
  } catch (error) {
    console.error('Erro ao buscar a receita:', error)
  } finally {
    loading.value = false
  }
})

const printRecipe = () => {
  // Cria um novo iframe para impressão
  const printWindow = document.createElement('iframe')
  printWindow.style.position = 'absolute'
  printWindow.style.width = '0'
  printWindow.style.height = '0'
  printWindow.style.border = '0'
  printWindow.style.visibility = 'hidden'
  
  document.body.appendChild(printWindow)
  
  // Quando o iframe estiver carregado, imprime o conteúdo
  printWindow.onload = () => {
    const printDocument = printWindow.contentDocument || printWindow.contentWindow?.document
    if (printDocument) {
      printDocument.open()
      printDocument.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${recipe.value.nome}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .recipe-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .recipe-meta { margin-bottom: 20px; font-size: 14px; color: #555; }
            .section-title { font-size: 18px; font-weight: bold; margin: 15px 0 8px; }
            .ingredients-list { margin: 0 0 20px 20px; padding: 0; }
            .preparation-text { white-space: pre-line; margin-top: 10px; }
            @media print {
              @page { size: auto; margin: 10mm; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="recipe-title">${recipe.value.nome}</div>
          <div class="recipe-meta">
            <div><strong>Tempo de preparo:</strong> ${recipe.value.tempo_preparo_minutos} minutos</div>
            <div><strong>Rendimento:</strong> ${recipe.value.porcoes} porções</div>
            <div><strong>Criado por:</strong> ${recipe.value.user?.nome}</div>
            <div><strong>Criado em:</strong> ${new Date(recipe.value.criado_em).toLocaleDateString()}</div>
            <div><strong>Atualizado em:</strong> ${new Date(recipe.value.alterado_em).toLocaleDateString()}</div>
          </div>
          <div class="section-title">Ingredientes</div>
          <ul class="ingredients-list">
            ${recipe.value.ingredientes.split(',').map(ing => `<li>${ing.trim()}</li>`).join('')}
          </ul>
          <div class="section-title">Modo de Preparo</div>
          <div class="preparation-text">${recipe.value.modo_preparo}</div>
        </body>
        </html>
      `)
      printDocument.close()
      
      // Dispara a impressão
      setTimeout(() => {
        printWindow.contentWindow?.focus()
        printWindow.contentWindow?.print()
        document.body.removeChild(printWindow)
      }, 300)
    }
  }
  
  printWindow.src = 'about:blank'
}
</script>

<style scoped>
.recipe-detail-card {
  margin: 20px auto;
  max-width: 800px;
  padding: 20px;
}

.loading-indicator {
  margin: 50px auto;
  display: block;
}

.section-title {
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: bold;
}

.ingredients-list {
  padding-left: 20px;
  margin-bottom: 20px;
}

.preparation-text {
  margin-top: 10px;
}

.v-chip {
  font-size: 0.9rem;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 1rem;
  font-weight: bold;
}

.breadcrumb a {
  text-decoration: none;
  color: #007bff;
  cursor: pointer;
}

.breadcrumb a:hover {
  text-decoration: underline;
}


.print-btn-container {
  text-align: right;
  margin-bottom: 20px;
}

@media print {
  .no-print {
    display: none !important;
  }
  
  body, .v-application {
    background: white !important;
  }
  
  .recipe-detail-card {
    box-shadow: none !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
