import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import Recipes from "../../app/pages/recipes.vue";

vi.mock("#app", () => ({
  useNuxtApp: () => ({
    $axios: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  }),
}));

describe("Recipes Page", () => {
  const vuetify = createVuetify({ components, directives });

  const renderComponent = () => {
    return render(Recipes, {
      global: {
        plugins: [vuetify],
      },
    });
  };

  it("renders the recipes table", () => {
    renderComponent();
    expect(screen.getByText("Minhas Receitas")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar Nova Receita")).toBeInTheDocument();
  });

  it("opens the modal to add a new recipe", async () => {
    renderComponent();
    await fireEvent.click(screen.getByText("Cadastrar Nova Receita"));
    expect(screen.getByText("Cadastrar Receita")).toBeInTheDocument();
  });

  it("validates recipe form fields", async () => {
    renderComponent();
    await fireEvent.click(screen.getByText("Cadastrar Nova Receita"));
    const saveButton = screen.getByText("Salvar");
    await fireEvent.click(saveButton);

    expect(screen.getByText("O nome é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("A categoria é obrigatória")).toBeInTheDocument();
  });

  it("saves a new recipe", async () => {
    vi.mocked(useNuxtApp().$axios.post).mockResolvedValue({});
    renderComponent();
    await fireEvent.click(screen.getByText("Cadastrar Nova Receita"));
    await fireEvent.update(
      screen.getByLabelText("Nome da Receita"),
      "Bolo de Chocolate"
    );
    await fireEvent.update(
      screen.getByLabelText("Tempo de Preparo (min)"),
      "60"
    );
    await fireEvent.click(screen.getByText("Salvar"));

    expect(useNuxtApp().$axios.post).toHaveBeenCalledWith(
      "/recipes",
      expect.any(Object)
    );
  });

  it("deletes a recipe", async () => {
    vi.mocked(useNuxtApp().$axios.delete).mockResolvedValue({});
    renderComponent();
    const deleteButton = screen.getByLabelText("delete-recipe-button"); // Replace with actual selector
    await fireEvent.click(deleteButton);

    expect(useNuxtApp().$axios.delete).toHaveBeenCalledWith(expect.any(String));
  });
});
