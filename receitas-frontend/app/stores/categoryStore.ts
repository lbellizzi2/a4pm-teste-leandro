import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategoryStore = defineStore('category', () => {
  const selectedCategory = ref<string | number | null>(null);

  function setCategory(category: string | number | null) {
    selectedCategory.value = category;
  }

  return {
    selectedCategory,
    setCategory,
  };
});