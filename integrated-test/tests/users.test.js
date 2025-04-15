const { PrismaClient } = require("@prisma/client");
const apiClient = require("../helper/axios.helper");

jest.setTimeout(10000);

describe("Users", () => {
  const newUser = {
    nome: "John Doe",
    login: "john.doe@email.com",
    senha: "password123",
  };

  let users = [];

  afterAll(async () => {
    const prisma = new PrismaClient();
    await prisma.$connect();
    try {
      await prisma.users.deleteMany({
        where: {
          id: {
            in: users,
          },
        },
      });
    } catch (error) {
      console.error("Error deleting users:", error);
    } finally {
      await prisma.$disconnect();
    }
  });

  test("should create a new user", async () => {
    let response = await apiClient.post("/users", newUser);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty("data");

    let responseData = response.data.data;

    expect(responseData).toHaveProperty("id");
    expect(responseData).toHaveProperty("nome", newUser.nome);
    expect(responseData).toHaveProperty("login", newUser.login);

    users.push(responseData.id);
  });

  test("should not create a user with missing fields", async () => {
    try {
      await apiClient.post("/users", {});
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty("errors");
      expect(error.response.data.errors).toBeInstanceOf(Array);
      expect(error.response.data.errors.length).toBeGreaterThan(0);
    }
  });

  test("should get a list of users", async () => {
    let authResponse = await apiClient.post("/auth", {
      login: newUser.login,
      password: newUser.senha,
    });

    expect(authResponse.status).toBe(201);
    expect(authResponse.data).toHaveProperty("data");

    let token = authResponse.data.data.access_token;

    let response = await apiClient.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("data");
    expect(response.data.data).toBeInstanceOf(Array);
  });

  test("should get a user by ID", async () => {
    let authResponse = await apiClient.post("/auth", {
      login: newUser.login,
      password: newUser.senha,
    });

    expect(authResponse.status).toBe(201);
    expect(authResponse.data).toHaveProperty("data");

    let token = authResponse.data.data.access_token;
    let authResponseData = authResponse.data.data;
    let response = await apiClient.get(`/users/${authResponseData.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("data");
    expect(response.data.data).toHaveProperty("id", authResponseData.id);
    expect(response.data.data).toEqual(
      expect.objectContaining({
        id: authResponseData.id,
        nome: newUser.nome,
        login: newUser.login,
      })
    );
  });

  test("should update a user", async () => {
    let authResponse = await apiClient.post("/auth", {
      login: newUser.login,
      password: newUser.senha,
    });

    expect(authResponse.status).toBe(201);
    expect(authResponse.data).toHaveProperty("data");

    let token = authResponse.data.data.access_token;
    let authResponseData = authResponse.data.data;

    users.push(authResponseData.id);

    let response = await apiClient.put(
      `/users/${authResponseData.id}`,
      { nome: "Macus Baine" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("data");
    expect(response.data.data).toHaveProperty("id", authResponseData.id);
    expect(response.data.data).toHaveProperty("nome", "Macus Baine");
  });

  test("should delete a user", async () => {
    let authResponse = await apiClient.post("/auth", {
      login: newUser.login,
      password: newUser.senha,
    });

    expect(authResponse.status).toBe(201);
    expect(authResponse.data).toHaveProperty("data");

    let token = authResponse.data.data.access_token;
    let authResponseData = authResponse.data.data;

    let response = await apiClient.delete(`/users/${authResponseData.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
  });
});
