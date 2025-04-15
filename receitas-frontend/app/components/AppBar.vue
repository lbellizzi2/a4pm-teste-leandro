<template>
  <header class="custom-appbar">
    <div class="custom-appbar__content">
      <div class="custom-appbar__left">
        <h1 class="custom-appbar__title">Receitas</h1>
        <div class="custom-appbar__dropdown">
          <button class="dropdown-toggle" @click="toggleDropdown">
            Categorias
            <span class="icon" :class="{ rotated: dropdownOpen }">&#9660;</span>
          </button>
          <ul v-if="dropdownOpen" class="dropdown-menu">
            <li v-for="category in categories" :key="category.id" @click="selectCategory(category)">
              {{ category.nome }}
            </li>
          </ul>
        </div>
      </div>
      <div class="custom-appbar__right">
        <input v-model="search" type="text" placeholder="Buscar receita" class="custom-appbar__search">
        <div v-if="isAuthenticated" class="custom-appbar__user-menu">
          <button class="user-menu-toggle" @click="toggleUserMenu">
            <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="custom-appbar__avatar">
            <i v-else class="default-user-icon mdi mdi-account-outline" aria-label="Ícone de usuário" />
            <span class="custom-appbar__username">{{ userName }}</span>
          </button>
          <ul v-if="userMenuOpen" class="user-menu-dropdown">
            <li @click="goToMyRecipes">Minhas receitas</li>
            <li @click="logout">Logout</li>
          </ul>
        </div>
        <button v-else class="custom-appbar__sign-in" @click="signIn">
          Sign In
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import { useCategoryStore } from '../stores/categoryStore';
import { useUserStore } from '../stores/userStore';
import { storeToRefs } from 'pinia'

const { $axios } = useNuxtApp();
const categoryStore = useCategoryStore();
const userStore = useUserStore()
const { isAuthenticated, userName } = storeToRefs(userStore)

const router = useRouter();

const search = ref("");
const userAvatar = ref("");
const categories = ref([]);
const userMenuOpen = ref(false);
const dropdownOpen = ref(false);

async function fetchRecipes() {
  try {
    const response = await $axios.get('/recipes', {
      params: {
        searchQuery: search.value,
      },
    });
    console.log('Recipes fetched:', response.data);
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
  }
}

watch(search, () => {
  fetchRecipes();
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function handleClickOutside(event) {
  const dropdown = document.querySelector(".custom-appbar__dropdown");
  const userMenu = document.querySelector(".custom-appbar__user-menu");

  if (dropdown && !dropdown.contains(event.target)) {
    dropdownOpen.value = false;
  }

  if (userMenu && !userMenu.contains(event.target)) {
    userMenuOpen.value = false;
  }
}

async function fetchCategories() {
  try {
    const response = await $axios.get('/categories', {
      params: {
        orderBy: "nome",
        order: "asc",
        page: 1,
        perPage: 100
      },
    });
    categories.value = response.data.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
  }
}

onMounted(() => {
  fetchCategories();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

function selectCategory(category) {
  categoryStore.setCategory(category);
  dropdownOpen.value = false;
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value;
}

function goToMyRecipes() {
  router.push("/recipes");
}

function logout() {
  userStore.setUserData(null);
  router.push("/");
}

function signIn() {
  router.push("/login");
}
</script>

<style lang="scss" scoped>
.custom-appbar {
  width: 100%;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  background-color: transparent;
  z-index: 1000;

  /* Container para centralizar o conteúdo do cabeçalho */
  &__content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  /* Grupo esquerdo */
  &__left {
    display: flex;
    align-items: center;

    .custom-appbar__title {
      font-size: 24px;
      margin: 0;
      color: #333;
      margin-right: 20px;
    }

    .custom-appbar__dropdown {
      position: relative;

      .dropdown-toggle {
        background: none;
        border: none;
        font-size: 16px;
        color: #333;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 5px 10px;

        .icon {
          margin-left: 5px;
          transition: transform 0.3s ease;
        }
      }

      .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        list-style: none;
        padding: 8px 0;
        margin-top: 5px;
        min-width: 150px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        li {
          padding: 8px 12px;
          cursor: pointer;
          color: #333;
          transition: background 0.2s;

          &:hover {
            background: #f5f5f5;
          }
        }
      }
    }
  }

  /* Grupo direito */
  &__right {
    display: flex;
    align-items: center;

    .custom-appbar__search {
      width: 200px;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 20px;
      /* Adiciona bordas arredondadas */
      font-size: 14px;
      margin-right: 10px;
      transition: width 0.3s ease;
      /* Animação para expansão */

      &:focus {
        width: 300px;
        /* Expande ao focar */
        outline: none;
        border-color: var(--v-theme-error);
        /* Cor de borda ao focar */
      }
    }

    .custom-appbar__user-menu {
      position: relative;

      .user-menu-toggle {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;

        .custom-appbar__username {
          margin-left: 10px;
          font-size: 16px;
          color: #333;
        }
      }

      .custom-appbar__avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }

      .default-user-icon {
        font-size: 40px;
        color: #ccc;

        &.mdi-account-outline {
          color: var(--v-theme-error);
          /* Ícone de lupa na cor error */
        }
      }

      .user-menu-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        list-style: none;
        padding: 8px 0;
        margin-top: 5px;
        min-width: 150px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        li {
          padding: 8px 12px;
          cursor: pointer;
          color: #333;
          transition: background 0.2s;

          &:hover {
            background: #f5f5f5;
          }
        }
      }
    }

    .custom-appbar__sign-in {
      background: none;
      border: none;
      color: var(--v-theme-error);
      font-size: 16px;
      cursor: pointer;
      padding: 5px 10px;
      transition: color 0.3s;

      &:hover {
        color: var(--v-theme-errorDark);
      }
    }
  }
}

/* Animação para a seta */
.rotated {
  transform: rotate(180deg);
}
</style>
