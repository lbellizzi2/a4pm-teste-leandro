const { PrismaClient } = require("@prisma/client");
const apiClient = require("../helper/axios.helper");

jest.setTimeout(10000);

describe("Categories", () => {
  const newCategory = {
    nome: "Sobremesas doces",
  };

  const user = {
    nome: "John Doe",
    login: "john.due@email.com",
    senha: "password123",
  };

  let categories = [];

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
      await prisma.categories.deleteMany({
        where: {
          id: {
            in: categories,
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

  test("should create a new category", async () => {
    let response = await apiClient.post("/categories", newCategory);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty("data");

    let responseData = response.data.data;

    expect(responseData).toHaveProperty("id");
    expect(responseData).toHaveProperty("nome", newCategory.nome);

    categories.push(responseData.id);
  });

  test("should not create a category with missing fields", async () => {
    try {
      await apiClient.post("/categories", {});
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty("errors");
      expect(error.response.data.errors).toBeInstanceOf(Array);
      expect(error.response.data.errors.length).toBeGreaterThan(0);
    }
  });

  test("should get a list of categories", async () => {
    let response = await apiClient.get("/categories");

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("data");
    expect(response.data.data).toBeInstanceOf(Array);
  });

  test("should get a category by ID", async () => {
    let createdCategory = categories[0];

    let response = await apiClient.get(`/categories/${createdCategory}`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("data");
    expect(response.data.data).toHaveProperty("id", createdCategory);
    expect(response.data.data).toEqual(
      expect.objectContaining({
        id: createdCategory,
        nome: newCategory.nome,
      })
    );
  });

  test("should update a category", async () => {
    let createdCategory = categories[0];

    let response = await apiClient.put(`/categories/${createdCategory}`, {
      nome: "Doces",
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("data");
    expect(response.data.data).toHaveProperty("id", createdCategory);
    expect(response.data.data).toHaveProperty("nome", "Doces");
  });

  test("should delete a category", async () => {
    let createdCategory = categories[0];

    let response = await apiClient.delete(`/categories/${createdCategory}`);

    expect(response.status).toBe(200);
  });
});
