<template>
  <v-app>
    <v-main class="main-with-appbar">
      <v-container fluid class="page-container">
        <div v-if="loading" class="local-loading">
          <v-progress-circular indeterminate color="primary" size="64" />
        </div>
        <div v-else>
          <nav class="breadcrumb">
            <NuxtLink to="/" @click="resetCategory">Início</NuxtLink>
            <span v-if="categoryStore.selectedCategory"> / {{ categoryStore.selectedCategory.nome }}</span>
          </nav>
          <v-row justify="center">
            <v-col v-for="recipe in recipes" :key="recipe.id" cols="12" sm="6" md="4">
              <NuxtLink :to="`/recipe/${recipe.id}`" class="recipe-link">
                <RecipeCard :recipe="recipe" />
              </NuxtLink>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import RecipeCard from '../components/RecipeCard.vue'
import { useCategoryStore } from '../stores/categoryStore';

const recipes = ref([])
const loading = ref(true)
const page = ref(1)
const perPage = ref(10)

const { $axios } = useNuxtApp()
const categoryStore = useCategoryStore();

async function fetchRecipes() {
  try {
    loading.value = true;
    const response = await $axios.get('/recipes', {
      params: {
        orderBy: 'criado_em',
        order: 'desc',
        page: page.value,
        perPage: perPage.value,
        id_categorias: parseInt(categoryStore.selectedCategory?.id, 10) || undefined,
      },
    });
    recipes.value = response.data.data;
  } catch (error) {
    console.error('Erro ao buscar receitas:', error)
  } finally {
    loading.value = false
  }
}

function resetCategory() {
  categoryStore.selectedCategory = null;
}

onMounted(fetchRecipes)
watch(() => categoryStore.selectedCategory, fetchRecipes);
</script>

<style scoped lang="scss">
.main-with-appbar {
  padding-top: 70px;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.recipe-link {
  text-decoration: none;
  color: inherit;
}

.local-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  /* Ajuste conforme o tamanho desejado para a área de loading */
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
</style>
