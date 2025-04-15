const { PrismaClient } = require("@prisma/client");
const apiClient = require("../helper/axios.helper");

jest.setTimeout(10000);

describe("Recipes", () => {
  const newRecipe = {
    id_usuarios: 1,
    id_categorias: null,
    nome: "Bolo de Chocolate",
    tempo_preparo_minutos: 60,
    porcoes: 8,
    modo_preparo: "Misture os ingredientes e asse por 60 minutos.",
    ingredientes: "Farinha, açúcar, chocolate, ovos, leite",
  };

  const user = {
    nome: "John Doe",
    login: "john.due@email.com",
    senha: "password123",
  };

  let recipes = [];

  beforeAll(async () => {
    await apiClient.post("/users", user);
    const authResponse = await apiClient.post("/auth", {
      login: user.login,
      password: user.senha,
    });

    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${authResponse.data.data.access_token}`;
  });

  afterAll(async () => {
    const prisma = new PrismaClient();
    await prisma.$connect();
    try {
      await prisma.recipes.deleteMany({
        where: {
          id: {
            in: recipes,
          },
        },
      });
      await prisma.users.delete({
        where: {
          login: user.login,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  });

  test("should create a new recipe", async () => {
    let response = await apiClient.post("/recipes", newRecipe);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty("data");

    let responseData = response.data.data;

    expect(responseData).toHaveProperty("id");
    expect(responseData).toHaveProperty("nome", newRecipe.nome);
    expect(responseData).toHaveProperty(
      "tempo_preparo_minutos",
      newRecipe.tempo_preparo_minutos
    );

    recipes.push(responseData.id);
  });

  test("should not create a recipe with missing fields", async () => {
    try {
      await apiClient.post("/recipes", {});
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty("errors");
      expect(error.response.data.errors).toBeInstanceOf(Array);
      expect(error.response.data.errors.length).toBeGreaterThan(0);
    }
  });

  test("should get a list of recipes", async () => {
    let response = await apiClient.get("/recipes");

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("data");
    expect(response.data.data).toBeInstanceOf(Array);
  });

  test("should get a recipe by ID", async () => {
    let createdRecipe = recipes[0];

    let response = await apiClient.get(`/recipes/${createdRecipe}`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("data");
    expect(response.data.data).toHaveProperty("id", createdRecipe);
    expect(response.data.data).toEqual(
      expect.objectContaining({
        id: createdRecipe,
        nome: newRecipe.nome,
        tempo_preparo_minutos: newRecipe.tempo_preparo_minutos,
      })
    );
  });

  test("should update a recipe", async () => {
    let createdRecipe = recipes[0];

    let response = await apiClient.put(`/recipes/${createdRecipe}`, {
      nome: "Bolo de Cenoura",
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("data");
    expect(response.data.data).toHaveProperty("id", createdRecipe);
    expect(response.data.data).toHaveProperty("nome", "Bolo de Cenoura");
  });

  test("should delete a recipe", async () => {
    let createdRecipe = recipes[0];

    let response = await apiClient.delete(`/recipes/${createdRecipe}`);

    expect(response.status).toBe(200);
  });

  test("should filter recipes by page and perPage", async () => {
    // Create multiple recipes for pagination
    const recipesToCreate = [
      { ...newRecipe, nome: "Recipe 1" },
      { ...newRecipe, nome: "Recipe 2" },
      { ...newRecipe, nome: "Recipe 3" },
    ];

    for (const recipe of recipesToCreate) {
      const response = await apiClient.post("/recipes", recipe);
      recipes.push(response.data.data.id);
    }

    // Fetch recipes with pagination
    const response = await apiClient.get("/recipes?page=1&perPage=2");

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("data");
    expect(response.data.data).toBeInstanceOf(Array);
    expect(response.data.data.length).toBe(2); // Should return 2 recipes
  });

  test("should filter recipes by searchQuery", async () => {
    // Create a recipe with a specific name for search
    const searchRecipe = { ...newRecipe, nome: "Unique Recipe Name" };
    const response = await apiClient.post("/recipes", searchRecipe);
    recipes.push(response.data.data.id);

    // Search for the recipe by name
    const searchResponse = await apiClient.get(
      "/recipes?searchQuery=Unique Recipe Name"
    );

    expect(searchResponse.status).toBe(200);
    expect(searchResponse.data).toHaveProperty("data");
    expect(searchResponse.data.data).toBeInstanceOf(Array);
    expect(searchResponse.data.data.length).toBe(1); // Should return 1 recipe
    expect(searchResponse.data.data[0]).toHaveProperty(
      "nome",
      "Unique Recipe Name"
    );
  });
});
