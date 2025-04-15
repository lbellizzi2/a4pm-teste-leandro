import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import RecipePage from "../../../app/pages/recipe/[id].vue";

vi.mock("#app", () => ({
  useNuxtApp: () => ({
    $axios: {
      get: vi.fn(),
    },
  }),
}));

describe("Recipe Page", () => {
  const vuetify = createVuetify({ components, directives });

  const renderComponent = () => {
    return render(RecipePage, {
      global: {
        plugins: [vuetify],
      },
    });
  };

  it("renders loading indicator initially", () => {
    renderComponent();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders recipe details after loading", async () => {
    vi.mocked(useNuxtApp().$axios.get).mockResolvedValue({
      data: {
        data: {
          nome: "Receita Teste",
          tempo_preparo_minutos: 30,
          porcoes: 4,
          user: { nome: "Usuário Teste" },
          criado_em: "2023-01-01T00:00:00Z",
          alterado_em: "2023-01-02T00:00:00Z",
          descricao: "Descrição da receita.",
          ingredientes: "Ingrediente 1, Ingrediente 2",
          modo_preparo: "Passo 1. Passo 2.",
        },
      },
    });

    renderComponent();
    await screen.findByText("Receita Teste");

    expect(screen.getByText("Receita Teste")).toBeInTheDocument();
    expect(screen.getByText("Tempo: 30 min")).toBeInTheDocument();
    expect(screen.getByText("Porções: 4")).toBeInTheDocument();
    expect(screen.getByText("Criado por Usuário Teste")).toBeInTheDocument();
    expect(screen.getByText("Descrição da receita.")).toBeInTheDocument();
    expect(screen.getByText("Ingrediente 1")).toBeInTheDocument();
    expect(screen.getByText("Ingrediente 2")).toBeInTheDocument();
    expect(screen.getByText("Passo 1. Passo 2.")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(useNuxtApp().$axios.get).mockRejectedValue(
      new Error("Erro ao buscar a receita")
    );

    renderComponent();
    await screen.findByText("Erro ao buscar a receita");
    expect(screen.getByText("Erro ao buscar a receita")).toBeInTheDocument();
  });

  it("triggers print functionality when print button is clicked", async () => {
    vi.mocked(useNuxtApp().$axios.get).mockResolvedValue({
      data: {
        data: {
          nome: "Receita Teste",
          tempo_preparo_minutos: 30,
          porcoes: 4,
          user: { nome: "Usuário Teste" },
          criado_em: "2023-01-01T00:00:00Z",
          alterado_em: "2023-01-02T00:00:00Z",
          descricao: "Descrição da receita.",
          ingredientes: "Ingrediente 1, Ingrediente 2",
          modo_preparo: "Passo 1. Passo 2.",
        },
      },
    });

    window.print = vi.fn();
    renderComponent();
    await screen.findByText("Receita Teste");

    const printButton = screen.getByText("Imprimir Receita");
    await fireEvent.click(printButton);

    expect(window.print).toHaveBeenCalled();
  });
});
