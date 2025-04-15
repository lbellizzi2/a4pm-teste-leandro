import { Test, TestingModule } from '@nestjs/testing'
import { RecipeService } from '../../../src/modules/recipe/recipe.service'
import { PrismaDatabase } from '../../../src/commons/database/prisma.database'
import { CreateRecipeDto } from '@/modules/recipe/dto'

describe('RecipeService', () => {
  let service: RecipeService
  let prisma: PrismaDatabase
  let generatedData: number[] = []

  const mockPrisma = {
    findByFilter: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeService, { provide: PrismaDatabase, useValue: mockPrisma }],
    }).compile()

    service = module.get<RecipeService>(RecipeService)
    prisma = module.get<PrismaDatabase>(PrismaDatabase)
    generatedData = []
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    for (const id of generatedData) {
      await prisma.delete('recipes', { id })
    }
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should find recipes by filter', async () => {
    const filter = {}
    mockPrisma.findByFilter.mockResolvedValue(['recipe1', 'recipe2'])
    const result = await service.findByFilter(filter)
    expect(result).toEqual(['recipe1', 'recipe2'])
    expect(prisma.findByFilter).toHaveBeenCalledWith(
      'recipes',
      filter,
      expect.any(Object),
    )
  })

  it('should find a recipe by ID', async () => {
    const id = 1
    mockPrisma.findById.mockResolvedValue('recipe1')
    const result = await service.findRecipeById(id)
    expect(result).toEqual('recipe1')
    expect(prisma.findById).toHaveBeenCalledWith('recipes', id, expect.any(Object))
  })

  it('should create a recipe', async () => {
    const data: CreateRecipeDto = { nome: 'Test', modo_preparo: '', id_usuarios: 0 }
    mockPrisma.create.mockResolvedValue({ id: 1, ...data })
    const result = await service.createRecipe(data)
    generatedData.push(result.id)
    expect(result).toEqual({ id: 1, ...data })
    expect(prisma.create).toHaveBeenCalledWith(
      'recipes',
      expect.objectContaining(data),
    )
  })

  it('should update a recipe', async () => {
    const id = 1
    const data = { nome: 'Updated Test' }
    mockPrisma.update.mockResolvedValue('updatedRecipe')
    const result = await service.updateRecipe(id, data)
    expect(result).toEqual('updatedRecipe')
    expect(prisma.update).toHaveBeenCalledWith('recipes', { id }, data)
  })

  it('should delete a recipe', async () => {
    const id = 1
    mockPrisma.delete.mockResolvedValue(undefined)
    const result = await service.deleteRecipe(id)
    expect(result).toBeUndefined()
    expect(prisma.delete).toHaveBeenCalledWith('recipes', { id })
  })
})
