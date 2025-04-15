import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string | null;
  let userId: string;
  let categoryId: string;
  let recipeWithCategoryId: string;
  let recipeWithoutCategoryId: string | null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Cleanup: Delete created data
    if (recipeWithCategoryId) {
      await request(app.getHttpServer())
        .delete(`/recipes/${recipeWithCategoryId}`)
        .set('Authorization', `Bearer ${jwtToken}`);
    }
    if (recipeWithoutCategoryId) {
      await request(app.getHttpServer())
        .delete(`/recipes/${recipeWithoutCategoryId}`)
        .set('Authorization', `Bearer ${jwtToken}`);
    }
    if (categoryId) {
      await request(app.getHttpServer())
        .delete(`/category/${categoryId}`)
        .set('Authorization', `Bearer ${jwtToken}`);
    }
    if (userId) {
      await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${jwtToken}`);
    }
    await app.close();
  });

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Test User');
    expect(response.body).toHaveProperty('email', 'test@example.com');
    userId = response.body.id;
  });

  it('should log in the user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    jwtToken = response.body.access_token;
  });

  it('should create a category', async () => {
    const response = await request(app.getHttpServer())
      .post('/category')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Test Category' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Test Category');
    categoryId = response.body.id;
  });

  it('should create a recipe with a category', async () => {
    const response = await request(app.getHttpServer())
      .post('/recipes')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'Recipe with Category', categoryId })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', 'Recipe with Category');
    expect(response.body).toHaveProperty('categoryId', categoryId);
    recipeWithCategoryId = response.body.id;
  });

  it('should create a recipe without a category', async () => {
    const response = await request(app.getHttpServer())
      .post('/recipes')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'Recipe without Category' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', 'Recipe without Category');
    recipeWithoutCategoryId = response.body.id;
  });

  it('should update a recipe', async () => {
    const response = await request(app.getHttpServer())
      .put(`/recipes/${recipeWithCategoryId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'Updated Recipe with Category' })
      .expect(200);

    expect(response.body).toHaveProperty('id', recipeWithCategoryId);
    expect(response.body).toHaveProperty('title', 'Updated Recipe with Category');
  });

  it('should delete a recipe', async () => {
    await request(app.getHttpServer())
      .delete(`/recipes/${recipeWithoutCategoryId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    recipeWithoutCategoryId = null; // Mark as deleted
  });

  it('should log out the user', async () => {
    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    jwtToken = null; // Invalidate token
  });

  it('should list recipes without token', async () => {
    const response = await request(app.getHttpServer())
      .get('/recipes')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
