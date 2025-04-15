import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import Login from "../../app/pages/login.vue";

vi.mock("#app", () => ({
  useNuxtApp: () => ({
    $axios: {
      post: vi.fn(),
    },
  }),
}));

describe("Login Page", () => {
  const vuetify = createVuetify({ components, directives });

  const renderComponent = () => {
    return render(Login, {
      global: {
        plugins: [vuetify],
      },
    });
  };

  it("renders the login form", () => {
    renderComponent();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
  });

  it("validates form fields", async () => {
    renderComponent();
    const loginButton = screen.getByText("Entrar");
    await fireEvent.click(loginButton);

    expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
  });

  it("shows API error on failed login", async () => {
    vi.mocked(useNuxtApp().$axios.post).mockRejectedValue({
      response: { data: { message: "Credenciais inválidas" } },
    });

    renderComponent();
    await fireEvent.update(screen.getByLabelText("Email"), "test@example.com");
    await fireEvent.update(screen.getByLabelText("Senha"), "password");
    await fireEvent.click(screen.getByText("Entrar"));

    expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
  });

  it("redirects to home on successful login", async () => {
    const routerPush = vi.fn();
    vi.mock("vue-router", () => ({
      useRouter: () => ({ push: routerPush }),
    }));
    vi.mocked(useNuxtApp().$axios.post).mockResolvedValue({
      data: { data: { access_token: "token" } },
    });

    renderComponent();
    await fireEvent.update(screen.getByLabelText("Email"), "test@example.com");
    await fireEvent.update(screen.getByLabelText("Senha"), "password");
    await fireEvent.click(screen.getByText("Entrar"));

    expect(routerPush).toHaveBeenCalledWith("/");
  });
});
