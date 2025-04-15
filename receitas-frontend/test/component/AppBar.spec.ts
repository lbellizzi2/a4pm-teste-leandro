import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { useRouter } from "vue-router";
import AppBar from "../../app/components/AppBar.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { useUserStore } from "../../app/stores/userStore";
import { useCategoryStore } from "../../app/stores/categoryStore";


const useNuxtAppMock = vi.fn(() => ({
  $axios: {
    get: vi.fn().mockResolvedValue({ data: { data: [] } })
  }
}))

vi.mock("#app", () => ({
  useNuxtApp: () => ({
    $axios: {
      get: vi.fn().mockResolvedValue({ data: { data: [] } }),
    },
  }),
}));


vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

describe("AppBar", () => {
  const vuetify = createVuetify({ components, directives });

  beforeEach(() => {
    vi.clearAllMocks()
    useNuxtAppMock.mockReturnValue({
      $axios: {
        get: vi.fn().mockResolvedValue({ data: { data: [] } })
      }
    })
  });

  afterEach(() => {
    cleanup()
  });

  const renderComponent = () => {
    return render(AppBar, {
      global: {
        plugins: [
          createTestingPinia(),
          vuetify
        ]
      }
    })
  }

  it("renders the title correctly", () => {
    renderComponent()
    expect(screen.getByText("Receitas")).toBeInTheDocument();
  });

  it("shows the Sign In button when not authenticated", () => {
    renderComponent()
    const userStore = useUserStore();
    userStore.setUserData({id: 1, nome: "John Doe", login: "johndoe", access_token: 'abc123'});
    
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.queryByTestId("user-menu")).toBeNull();
  });

  it("shows the user menu when authenticated", async () => {
    renderComponent()
    const userStore = useUserStore();
    userStore.setUserData({id: 1, nome: "John Doe", login: "johndoe", access_token: 'abc123'});


    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
  });

  it("opens and closes the categories dropdown", async () => {
    const mockCategories = [
      { id: 1, nome: "Sobremesas" },
      { id: 2, nome: "Massas" }
    ];

    const { $axios } = useNuxtAppMock()
    
    vi.mocked($axios.get).mockResolvedValueOnce({
      data: { data: mockCategories }
    });
    renderComponent()

    await fireEvent.click(screen.getByText("Categorias"));
    
    expect(screen.getByText("Sobremesas")).toBeInTheDocument();
    expect(screen.getByText("Massas")).toBeInTheDocument();

    await fireEvent.click(document.body);
    expect(screen.queryByText("Sobremesas")).toBeNull();
  });

  it("selects a category correctly", async () => {
    const categoryStore = useCategoryStore();
    const mockCategories = [{ id: 1, nome: "Sobremesas" }];
    renderComponent()
    
    const { $axios } = useNuxtAppMock()
    
    vi.mocked($axios.get).mockResolvedValueOnce({
      data: { data: mockCategories }
    });

    await fireEvent.click(screen.getByText("Categorias"));
    await fireEvent.click(screen.getByText("Sobremesas"));

    expect(categoryStore.setCategory).toHaveBeenCalledWith(mockCategories[0]);
    expect(screen.queryByText("Sobremesas")).toBeNull();
  });

  it("logs out correctly", async () => {
    renderComponent()
    const userStore = useUserStore();
    const router = useRouter();
    
    userStore.setUserData({id: 1, nome: "John Doe", login: "johndoe", access_token: 'abc123'});
    userStore.setUserData = vi.fn();

    
    // wrapper.rerender({});

    
    await fireEvent.click(screen.getByText("John Doe"));
    await fireEvent.click(screen.getByText("Logout"));

    expect(userStore.setUserData).toHaveBeenCalledWith(null);
    expect(router.push).toHaveBeenCalledWith("/");
  });

  it("navigates to login when clicking Sign In", async () => {
    renderComponent()
    const router = useRouter();
    
    await fireEvent.click(screen.getByText("Sign In"));
    expect(router.push).toHaveBeenCalledWith("/login");
  });

  it("filters recipes when typing in the search bar", async () => {
    renderComponent()
    const debounceTime = 300;
    vi.useFakeTimers();

    const searchInput = screen.getByPlaceholderText("Buscar receita");
    await fireEvent.update(searchInput, "bolo");

    vi.advanceTimersByTime(debounceTime);
    
    const { $axios } = useNuxtAppMock()
    
    expect($axios.get).toHaveBeenCalledWith("/recipes", {
      params: {
        searchQuery: "bolo"
      }
    });

    vi.useRealTimers();
  });
});