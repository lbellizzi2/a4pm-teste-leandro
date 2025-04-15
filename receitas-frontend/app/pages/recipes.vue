<template>
    <div>
        <nav class="breadcrumb">
            <NuxtLink to="/">Início</NuxtLink>
            <span> / Minhas Receitas</span>
        </nav>
        <h1>Minhas Receitas</h1>
        <v-btn color="primary" class="mb-4" @click="openModal">
            <v-icon left>mdi-plus</v-icon>
            Cadastrar Nova Receita
        </v-btn>

        <v-data-table :headers="headers" :items="recipes" :items-per-page="5" class="elevation-1">
            <template #item.actions="{ item }">
                <v-btn class="action-btn" icon @click="editRecipe(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn class="action-btn delete-btn" icon @click="deleteRecipe(item.id)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>

            <template #item.tempo_preparo_minutos="{ item }">
                {{ item.tempo_preparo_minutos }} min
            </template>
        </v-data-table>

        <div v-if="showModal" class="modal-background">
            <div class="modal">
                <h2>{{ editingRecipe ? 'Editar Receita' : 'Cadastrar Receita' }}</h2>
                <form class="form-vertical" @submit.prevent="validateAndSaveRecipe">
                    <v-text-field v-model="form.nome" label="Nome da Receita" outlined :error="!!fieldErrors.nome"
                        :error-messages="fieldErrors.nome" required />
                    <v-select v-model="form.id_categorias" :items="categories" item-text="title" item-value="value"
                        label="Categoria" outlined :error="!!fieldErrors.id_categorias"
                        :error-messages="fieldErrors.id_categorias" required />
                    <v-text-field v-model="form.tempo_preparo_minutos" type="number" label="Tempo de Preparo (min)"
                        outlined :error="!!fieldErrors.tempo_preparo_minutos"
                        :error-messages="fieldErrors.tempo_preparo_minutos" required />
                    <v-text-field v-model="form.porcoes" type="number" label="Porções" outlined
                        :error="!!fieldErrors.porcoes" :error-messages="fieldErrors.porcoes" required />
                    <v-textarea v-model="form.modo_preparo" label="Modo de Preparo" outlined rows="5"
                        :error="!!fieldErrors.modo_preparo" :error-messages="fieldErrors.modo_preparo" required />
                    <v-textarea v-model="form.ingredientes" label="Ingredientes" outlined rows="3"
                        :error="!!fieldErrors.ingredientes" :error-messages="fieldErrors.ingredientes" />

                    <!-- Display general errors -->
                    <div v-if="formErrors.length" class="error-messages">
                        <ul>
                            <li v-for="(error, index) in formErrors" :key="index" class="error-text">{{ error }}</li>
                        </ul>
                    </div>

                    <div class="form-actions">
                        <v-btn color="primary" type="submit">
                            Salvar
                        </v-btn>
                        <v-btn color="secondary" @click="closeModal">
                            Cancelar
                        </v-btn>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useUserStore } from '../stores/userStore';
import { storeToRefs } from 'pinia';
import * as yup from 'yup';

const { $axios } = useNuxtApp();
const userStore = useUserStore();
const { isAuthenticated, data: userData } = storeToRefs(userStore);

const categories = ref([]);
const recipes = ref([]);
const showModal = ref(false);
const editingRecipe = ref(null);
const form = ref({
    nome: '',
    id_categorias: '',
    tempo_preparo_minutos: '',
    porcoes: '',
    modo_preparo: '',
    ingredientes: '',
});
const formErrors = ref([]); // Add a ref to store general errors
const fieldErrors = ref({}); // Add a ref to store field-specific errors

const headers = [
    { title: 'Nome', key: 'nome' },
    { title: 'Categoria', key: 'categoria' },
    { title: 'Tempo de Preparo (min)', key: 'tempo_preparo_minutos' },
    { title: 'Porções', key: 'porcoes' },
    { title: 'Modo de Preparo', key: 'modo_preparo' },
    { title: 'Ações', key: 'actions', sortable: false },
];

const recipeSchema = yup.object().shape({
    nome: yup.string().required('O nome é obrigatório'),
    id_categorias: yup.number().required('A categoria é obrigatória'),
    tempo_preparo_minutos: yup.number().required('O tempo de preparo é obrigatório').positive().integer(),
    porcoes: yup.number().required('O número de porções é obrigatório').positive().integer(),
    modo_preparo: yup.string().required('O modo de preparo é obrigatório'),
    ingredientes: yup.string(),
});

async function fetchCategories() {
    try {
        const response = await $axios.get('/categories', {
            params: {
                orderBy: "nome",
                order: "asc",
                page: 1,
                perPage: 100,
            },
        });
        const categoriesData = response.data.data.map(category => ({
            value: category.id,
            title: category.nome,
        }));
        categories.value = categoriesData;
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
    }
}

async function fetchRecipes() {
    try {
        const response = await $axios.get('/recipes', {
            params: {
                orderBy: "nome",
                order: "asc",
                page: 1,
                perPage: 100,
                id_usuarios: userData.value?.id,
            },
            headers: {
                Authorization: `Bearer ${userData.value?.access_token}`,
            },
        });
        recipes.value = response.data.data.map(recipe => ({
            id: recipe.id,
            nome: recipe.nome,
            id_categorias: recipe.categoria?.id || '',
            categoria: recipe.categoria?.nome || '',
            tempo_preparo_minutos: recipe.tempo_preparo_minutos,
            porcoes: recipe.porcoes,
            modo_preparo: recipe.modo_preparo,
            ingredientes: recipe.ingredientes,
        }));
    } catch (error) {
        console.error('Erro ao buscar receitas:', error);
    }
}

function openModal() {
    editingRecipe.value = null;
    form.value = { nome: '', id_categorias: '', tempo_preparo_minutos: '', porcoes: '', modo_preparo: '', ingredientes: '' };
    showModal.value = true;
}

function editRecipe(recipe) {
    editingRecipe.value = recipe;
    form.value = {
        nome: recipe.nome,
        id_categorias: recipe.id_categorias,
        tempo_preparo_minutos: recipe.tempo_preparo_minutos,
        porcoes: recipe.porcoes,
        modo_preparo: recipe.modo_preparo,
        ingredientes: recipe.ingredientes
    };
    showModal.value = true;
}

async function validateAndSaveRecipe() {
    formErrors.value = []; // Clear general errors
    fieldErrors.value = {}; // Clear field-specific errors
    try {
        await recipeSchema.validate(form.value, { abortEarly: false });
        await saveRecipe();
    } catch (error) {
        if (error.inner) {
            error.inner.forEach(err => {
                fieldErrors.value[err.path] = err.message; // Map field-specific errors
            });
        } else {
            console.error('Erro de validação:', error);
        }
    }
}

async function saveRecipe() {
    try {
        const payload = {
            ...form.value,
            id_usuarios: userData.value?.id, // Add id_usuarios to the payload
        };

        if (editingRecipe.value) {
            await $axios.put(`/recipes/${editingRecipe.value.id}`, payload, {
                headers: {
                    Authorization: `Bearer ${userData.value?.access_token}`,
                },
            });
        } else {
            await $axios.post('/recipes', payload, {
                headers: {
                    Authorization: `Bearer ${userData.value?.access_token}`,
                },
            });
        }
        closeModal();
        await fetchRecipes();
    } catch (error) {
        formErrors.value = ['Erro ao salvar receita. Por favor, tente novamente.']; // Add general error message
        console.error('Erro ao salvar receita:', error);
    }
}

async function deleteRecipe(id) {
    try {
        await $axios.delete(`/recipes/${id}`, {
            headers: {
                Authorization: `Bearer ${userData.value?.access_token}`,
            },
        });
        await fetchRecipes();
    } catch (error) {
        console.error('Erro ao excluir receita:', error);
    }
}

function closeModal() {
    showModal.value = false;
    form.value = { nome: '', id_categorias: '', tempo_preparo_minutos: '', porcoes: '', modo_preparo: '', ingredientes: '' };
}

onMounted(() => {
    if (isAuthenticated.value) {
        fetchCategories();
        fetchRecipes();
    }
});

watch(isAuthenticated, (newValue) => {
    if (!newValue) {
        navigateTo('/login');
    }
});
</script>

<style>
.modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-vertical {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
}

.error-messages {
    margin-top: 16px;
    color: red;
}

.error-text {
    font-size: 14px;
}

.action-btn {
    background: transparent;
    border: none;
    box-shadow: none;
    color: inherit;
    padding: 8px;
    transition: color 0.3s ease;
}

.action-btn:hover {
    color: #1976d2;
    /* Primary color on hover */
}

.delete-btn {
    color: red;
}

.delete-btn:hover {
    color: darkred;
    /* Darker red on hover */
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