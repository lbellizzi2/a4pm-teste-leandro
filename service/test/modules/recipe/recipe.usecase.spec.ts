import { Test, TestingModule } from '@nestjs/testing'
import { RecipeUseCase } from '../../../src/modules/recipe/recipe.usecase'
import { RecipeService } from '../../../src/modules/recipe/recipe.service'
import { BadRequestException } from '@nestjs/common'
import { CreateRecipeDto, SearchRecipeDto } from '@/modules/recipe/dto'
import { Recipes } from '@prisma/client'

describe('RecipeUseCase', () => {
  let useCase: RecipeUseCase
  let service: RecipeService
  const generatedData: any[] = []

  const mockService = {
    findByFilter: jest.fn(),
    findRecipeById: jest.fn(),
    createRecipe: jest.fn(),
    updateRecipe: jest.fn(),
    deleteRecipe: jest.fn(),
  }

  const recipes: Recipes[] = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    nome: `Recipe ${i + 1}`,
    modo_preparo: 'Modo de preparo ' + i,
    id_usuarios: i + 1,
    id_categorias: i % 2 === 0 ? 1 : 2,
    criado_em: new Date(),
    alterado_em: new Date(),
    tempo_preparo_minutos: i > 0 ? i * 30 : 30,
    porcoes: 4,
    ingredientes: 'Ingredientes ' + i,
  }))

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeUseCase, { provide: RecipeService, useValue: mockService }],
    }).compile()

    useCase = module.get<RecipeUseCase>(RecipeUseCase)
    service = module.get<RecipeService>(RecipeService)

    jest.spyOn(mockService, 'findByFilter')
    jest.spyOn(mockService, 'findRecipeById')
    jest.spyOn(mockService, 'createRecipe')
    jest.spyOn(mockService, 'updateRecipe')
    jest.spyOn(mockService, 'deleteRecipe')
  })

  afterEach(async () => {
    for (const data of generatedData) {
      await service.deleteRecipe(data.id)
    }
    generatedData.length = 0
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should find recipes by filter', async () => {
    const filteredRecipes = recipes
      .filter(recipe => recipe.nome.includes('Recipe'))
      .slice(0, 10)
      .sort((a, b) => a.nome.localeCompare(b.nome))
    const filter: SearchRecipeDto = {
      page: 1,
      perPage: 10,
      orderBy: 'nome',
      order: 'asc',
    }
    jest.spyOn(service, 'findByFilter').mockResolvedValue(filteredRecipes)
    const result = await useCase.findByFilter(filter)
    expect(result.length).toBe(10)
    expect(result[0]).toEqual(filteredRecipes[0])
    expect(service.findByFilter).toHaveBeenCalledWith(filter)
    expect(service.findByFilter).toHaveBeenCalledTimes(1)
  })

  it('should get a recipe by ID', async () => {
    const id = '1'
    jest.spyOn(service, 'findRecipeById').mockResolvedValue(recipes[0])
    const result = await useCase.getRecipeById(id)
    expect(result).toEqual(recipes[0])
    expect(result).toHaveProperty('id', 1)
    expect(result).toHaveProperty('nome', 'Recipe 1')
    expect(result).toHaveProperty('modo_preparo', 'Modo de preparo 0')
    expect(result).toHaveProperty('id_usuarios', 1)
    expect(result).toHaveProperty('id_categorias', 1)
    expect(result).toHaveProperty('criado_em')
    expect(result).toHaveProperty('alterado_em')
    expect(result).toHaveProperty('tempo_preparo_minutos', 30)
    expect(result).toHaveProperty('porcoes', 4)
    expect(result).toHaveProperty('ingredientes', 'Ingredientes 0')
    expect(service.findRecipeById).toHaveBeenCalledWith(Number(id))
    expect(service.findRecipeById).toHaveBeenCalledTimes(1)
  })

  it('should create a recipe', async () => {
    const data: CreateRecipeDto = { nome: 'Test', modo_preparo: '', id_usuarios: 0 }
    const newRecipe: Recipes = {
      id: 1,
      nome: 'Test',
      modo_preparo: '',
      id_usuarios: 0,
      id_categorias: 1,
      criado_em: new Date(),
      alterado_em: new Date(),
      tempo_preparo_minutos: 30,
      porcoes: 4,
      ingredientes: 'Ingredientes',
    }
    jest.spyOn(service, 'createRecipe').mockResolvedValue(newRecipe)
    const result = await useCase.createRecipe(data)

    expect(result).toEqual(newRecipe)
    expect(service.createRecipe).toHaveBeenCalledWith(data)
    expect(service.createRecipe).toHaveBeenCalledTimes(1)
  })

  it('should update a recipe', async () => {
    const id = '1'
    const data = { nome: 'Updated Test' }
    const newData = {
      ...recipes[0],
      nome: 'Updated Test',
    }
    jest.spyOn(service, 'findRecipeById').mockResolvedValue(recipes[0])
    jest.spyOn(service, 'updateRecipe').mockResolvedValue(newData)
    const result = await useCase.updateRecipe(id, data)
    expect(result).toEqual(newData)
    expect(service.updateRecipe).toHaveBeenCalledWith(Number(id), data)
    expect(service.updateRecipe).toHaveBeenCalledTimes(1)
    expect(service.findRecipeById).toHaveBeenCalledWith(Number(id))
    expect(service.findRecipeById).toHaveBeenCalledTimes(1)
  })

  it('should throw error if recipe to update does not exist', async () => {
    const id = '1'
    const data = { nome: 'Updated Test' }
    jest.spyOn(service, 'findRecipeById').mockResolvedValue(null)
    await expect(useCase.updateRecipe(id, data)).rejects.toThrow(BadRequestException)
  })

  it('should delete a recipe', async () => {
    const id = '1'
    jest.spyOn(service, 'findRecipeById').mockResolvedValue(recipes[0])
    jest.spyOn(service, 'deleteRecipe').mockResolvedValue(undefined)
    const result = await useCase.deleteRecipe(id)
    expect(result).toBeUndefined()
    expect(service.deleteRecipe).toHaveBeenCalledWith(Number(id))
  })

  it('should throw error if recipe to delete does not exist', async () => {
    const id = '1'
    jest.spyOn(service, 'findRecipeById').mockResolvedValue(null)
    await expect(useCase.deleteRecipe(id)).rejects.toThrow(BadRequestException)
  })
})
