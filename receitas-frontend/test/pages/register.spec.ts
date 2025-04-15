import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import Register from "../../app/pages/register.vue";

vi.mock("#app", () => ({
  useNuxtApp: () => ({
    $axios: {
      post: vi.fn(),
    },
  }),
}));

describe("Register Page", () => {
  const vuetify = createVuetify({ components, directives });

  const renderComponent = () => {
    return render(Register, {
      global: {
        plugins: [vuetify],
      },
    });
  };

  it("renders the registration form", () => {
    renderComponent();
    expect(screen.getByText("Cadastro")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirme a senha")).toBeInTheDocument();
  });

  it("validates form fields", async () => {
    renderComponent();
    const registerButton = screen.getByText("Cadastrar");
    await fireEvent.click(registerButton);

    expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
    expect(
      screen.getByText("Confirmação de senha é obrigatória")
    ).toBeInTheDocument();
  });

  it("shows API error on failed registration", async () => {
    vi.mocked(useNuxtApp().$axios.post).mockRejectedValue({
      response: {
        data: { errors: [{ param: "email", msg: "Email já cadastrado" }] },
      },
    });

    renderComponent();
    await fireEvent.update(screen.getByLabelText("Nome"), "Test User");
    await fireEvent.update(screen.getByLabelText("Email"), "test@example.com");
    await fireEvent.update(screen.getByLabelText("Senha"), "password");
    await fireEvent.update(
      screen.getByLabelText("Confirme a senha"),
      "password"
    );
    await fireEvent.click(screen.getByText("Cadastrar"));

    expect(screen.getByText("Email já cadastrado")).toBeInTheDocument();
  });

  it("redirects to home on successful registration", async () => {
    const routerPush = vi.fn();
    vi.mock("vue-router", () => ({
      useRouter: () => ({ push: routerPush }),
    }));
    vi.mocked(useNuxtApp().$axios.post).mockResolvedValue({
      data: { data: { access_token: "token" } },
    });

    renderComponent();
    await fireEvent.update(screen.getByLabelText("Nome"), "Test User");
    await fireEvent.update(screen.getByLabelText("Email"), "test@example.com");
    await fireEvent.update(screen.getByLabelText("Senha"), "password");
    await fireEvent.update(
      screen.getByLabelText("Confirme a senha"),
      "password"
    );
    await fireEvent.click(screen.getByText("Cadastrar"));

    expect(routerPush).toHaveBeenCalledWith("/");
  });
});
