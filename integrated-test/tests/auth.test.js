const apiClient = require("../helper/axios.helper");
const { PrismaClient } = require("@prisma/client");

jest.setTimeout(10000);

describe("Auth", () => {
  const user = {
    nome: "Jane Doe",
    login: "jane.doe@email.com",
    senha: "securepassword",
  };

  beforeAll(async () => {
    await apiClient.post("/users", user);
  });

  afterAll(async () => {
    const prisma = new PrismaClient();
    await prisma.$connect();
    try {
      await prisma.users.delete({
        where: {
          login: user.login,
        },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      await prisma.$disconnect();
    }
  });

  test("should login with valid credentials", async () => {
    const response = await apiClient.post("/auth", {
      login: user.login,
      password: user.senha,
    });

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty("data");
    expect(response.data.data).toHaveProperty("access_token");
    expect(response.data.data).toHaveProperty("id");
    expect(response.data.data).toHaveProperty("login", user.login);

    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.data.access_token}`;
  });

  test("should fail login with invalid credentials", async () => {
    try {
      await apiClient.post("/auth", {
        login: user.login,
        password: "wrongpassword",
      });
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty("message");
    }
  });
});
