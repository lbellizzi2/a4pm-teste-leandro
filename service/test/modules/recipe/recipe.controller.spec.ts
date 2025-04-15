import { Test, TestingModule } from '@nestjs/testing'
import { RecipeController } from '../../../src/modules/recipe/recipe.controller'
import { RecipeUseCase } from '../../../src/modules/recipe/recipe.usecase'
import {
  CreateRecipeDto,
  SearchRecipeDto,
  UpdateRecipeDto,
} from '../../../src/modules/recipe/dto'

describe('RecipeController', () => {
  let controller: RecipeController
  let useCase: RecipeUseCase
  const generatedData: any[] = []

  const mockUseCase = {
    findByFilter: jest.fn(),
    getRecipeById: jest.fn(),
    createRecipe: jest.fn(),
    updateRecipe: jest.fn(),
    deleteRecipe: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [{ provide: RecipeUseCase, useValue: mockUseCase }],
    }).compile()

    controller = module.get<RecipeController>(RecipeController)
    useCase = module.get<RecipeUseCase>(RecipeUseCase)
  })

  afterEach(async () => {
    // Cleanup: Delete all generated data
    for (const data of generatedData) {
      await useCase.deleteRecipe(data.id)
    }
    generatedData.length = 0 // Clear the array
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should retrieve all recipes', async () => {
    const filter: SearchRecipeDto = {}
    mockUseCase.findByFilter.mockResolvedValue(['recipe1', 'recipe2'])
    const result = await controller.getAllRecipes(filter)
    expect(result).toEqual(['recipe1', 'recipe2'])
    expect(useCase.findByFilter).toHaveBeenCalledWith(filter)
  })

  it('should retrieve a recipe by ID', async () => {
    const id = '1'
    mockUseCase.getRecipeById.mockResolvedValue('recipe1')
    const result = await controller.getRecipeById(id)
    expect(result).toEqual('recipe1')
    expect(useCase.getRecipeById).toHaveBeenCalledWith(id)
  })

  it('should create a new recipe', async () => {
    const data: CreateRecipeDto = {
      nome: 'Test',
      tempo_preparo_minutos: 10,
      porcoes: 2,
      modo_preparo: 'Test',
      ingredientes: 'Test',
      id_usuarios: 1,
      id_categorias: 1,
    }
    mockUseCase.createRecipe.mockResolvedValue({ id: 1, ...data }) // Mock response with ID
    const result = await controller.createRecipe(data)
    generatedData.push(result) // Store generated data
    expect(result).toEqual({ id: 1, ...data })
    expect(useCase.createRecipe).toHaveBeenCalledWith(data)
  })

  it('should update a recipe by ID', async () => {
    const id = '1'
    const data: UpdateRecipeDto = { nome: 'Updated Test' }
    mockUseCase.updateRecipe.mockResolvedValue('updatedRecipe')
    const result = await controller.updateRecipe(id, data)
    expect(result).toEqual('updatedRecipe')
    expect(useCase.updateRecipe).toHaveBeenCalledWith(id, data)
  })

  it('should delete a recipe by ID', async () => {
    const id = '1'
    mockUseCase.deleteRecipe.mockResolvedValue(undefined)
    const result = await controller.deleteRecipe(id)
    expect(result).toBeUndefined()
    expect(useCase.deleteRecipe).toHaveBeenCalledWith(id)
  })
})
