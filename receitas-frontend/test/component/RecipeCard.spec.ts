/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import RecipeCard from "../../app/components/RecipeCard.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createTestingPinia } from "@pinia/testing";

const pushMock = vi.fn();
const mockRouter = {
  push: pushMock,
};

// 2. Mock do useRouter
vi.mock("vue-router", () => ({
  useRouter: () => mockRouter,
}));

describe("RecipeCard", () => {
  const vuetify = createVuetify({ components, directives });
  // const router = useRouter();

  const mockRecipe = {
    id: 1,
    nome: "Bolo de Cenoura",
    user: { nome: "João" },
    categoria: { nome: "Sobremesas" },
    tempo_preparo_minutos: 45,
    criado_em: "2023-01-01T00:00:00Z",
  };

  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = render(RecipeCard, {
      global: {
        plugins: [createTestingPinia(), vuetify],
      },
      props: {
        recipe: mockRecipe,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("renders recipe details correctly", () => {
    expect(screen.queryAllByTestId("recipe-card").length).toBe(1);
    expect(screen.getByText(mockRecipe.nome)).toBeInTheDocument();
    expect(screen.getByTestId("author").textContent).toContain(
      mockRecipe.user.nome
    );
    expect(screen.getByTestId("category").textContent).toContain(
      mockRecipe.categoria.nome
    );
    expect(screen.getByTestId("prepare-time").textContent).toContain(
      `${mockRecipe.tempo_preparo_minutos} minutos`
    );
    expect(screen.getByTestId("created-at").textContent).toContain(
      new Date(mockRecipe.criado_em).toLocaleDateString()
    );
  });

  it("navigates to the details page when the button is clicked", async () => {
    expect(screen.queryAllByTestId("recipe-card")).toHaveLength(1);

    // 5. Simulação do clique
    const detalhesButton = screen.getByTestId("details-button");
    await fireEvent.click(detalhesButton);

    // 6. Verificação da navegação
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(`/recipe/${mockRecipe.id}`);
  });
});
