/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Index from "~/pages/index.vue";
import { createTestingPinia } from "@pinia/testing";
import { useCategoryStore } from "~/stores/categoryStore";

describe("Index Page", () => {
  let wrapper: any;
  const mockAxios = {
    get: vi.fn(),
  };

  beforeEach(() => {
    wrapper = mount(Index, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              categoryStore: {
                selectedCategory: null,
              },
            },
          }),
        ],
        mocks: {
          $axios: mockAxios,
        },
      },
    });
  });

  it("renders loading state", async () => {
    expect(wrapper.find(".local-loading").exists()).toBe(true);
  });

  it("renders breadcrumb correctly", async () => {
    const categoryStore = useCategoryStore();
    categoryStore.setCategory(1);
    const category = { id: 1, nome: "Categoria Teste" };
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".breadcrumb").text()).toContain(category.nome);
  });

  it("fetches and displays recipes", async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: {
        data: [
          { id: 1, nome: "Receita 1" },
          { id: 2, nome: "Receita 2" },
        ],
      },
    });

    await wrapper.vm.fetchRecipes();
    await wrapper.vm.$nextTick();

    const recipeLinks = wrapper.findAll(".recipe-link");
    expect(recipeLinks).toHaveLength(2);
    expect(recipeLinks[0].attributes("href")).toBe("/recipe/1");
    expect(recipeLinks[1].attributes("href")).toBe("/recipe/2");
  });

  it("resets category on breadcrumb click", async () => {
    const categoryStore = useCategoryStore();
    categoryStore.setCategory(1);
    await wrapper.vm.$nextTick();

    await wrapper.find(".breadcrumb a").trigger("click");
    expect(categoryStore.selectedCategory).toBeNull();
  });
});
