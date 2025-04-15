import { Test, TestingModule } from '@nestjs/testing'
import { CategoryController } from '../../../src/modules/category/category.controller'
import { CategoryUseCase } from '../../../src/modules/category/category.usecase'
import {
  CreateCategoryDto,
  SearchCategoryDto,
  UpdateCategoryDto,
} from '../../../src/modules/category/dto'
import { Categories } from '@prisma/client'

describe('CategoryController', () => {
  let controller: CategoryController
  let useCase: CategoryUseCase
  const createdCategories: number[] = []

  const categoriesMock: Categories[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    nome: `Category ${i + 1}`,
    criado_em: new Date(),
    alterado_em: new Date(),
  }))

  const mockCategoryUseCase = {
    findByFilter: jest.fn(),
    getCategoryById: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [{ provide: CategoryUseCase, useValue: mockCategoryUseCase }],
    }).compile()

    controller = module.get<CategoryController>(CategoryController)
    useCase = module.get<CategoryUseCase>(CategoryUseCase)
  })

  afterEach(async () => {
    for (const id of createdCategories) {
      await useCase.deleteCategory(id.toString())
    }
  })

  it('should create a category', async () => {
    const dto: CreateCategoryDto = { nome: 'test' }
    jest.spyOn(useCase, 'createCategory').mockResolvedValue({
      id: 1,
      nome: dto.nome,
      criado_em: new Date(),
      alterado_em: new Date(),
    } as Categories)
    const result = await controller.createCategory(dto)
    expect(result).toHaveProperty('id')
    expect(result.nome).toBe(dto.nome)
  })

  it('should retrieve all categories', async () => {
    const filter: SearchCategoryDto = {
      nome: 'Category',
      page: 1,
      perPage: 10,
      orderBy: 'id',
      order: 'asc',
    }
    jest
      .spyOn(useCase, 'findByFilter')
      .mockResolvedValue(categoriesMock.slice(0, 10).sort((a, b) => a.nome.localeCompare(b.nome)))

    const result = await controller.getAllCategories(filter)
    expect(useCase.findByFilter).toHaveBeenCalledWith(filter)
    expect(useCase.findByFilter).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(10)
    expect(result[0]).toHaveProperty('id', categoriesMock[0].id)
    expect(result[0]).toHaveProperty('nome', categoriesMock[0].nome)
  })

  it('should retrieve a category by ID', async () => {
    const id = '1'
    jest.spyOn(useCase, 'getCategoryById').mockResolvedValue(categoriesMock[0])
    const result = await controller.getCategoryById(id)
    expect(useCase.getCategoryById).toHaveBeenCalledWith(id)
    expect(useCase.getCategoryById).toHaveBeenCalledTimes(1)
    expect(result).toHaveProperty('id', Number(id))
    expect(result).toHaveProperty('nome', categoriesMock[0].nome)
  })

  it('should update a category', async () => {
    const id = '1'
    const dto: UpdateCategoryDto = { nome: 'Updated Name' }

    const updatedCategory: Categories = { id: Number(id), nome: dto.nome }

    jest.spyOn(useCase, 'updateCategory').mockResolvedValue(updatedCategory)

    const result = await controller.updateCategory(id, dto)
    expect(result).toEqual(updatedCategory)
    expect(useCase.updateCategory).toHaveBeenCalledWith(id, dto)
    expect(useCase.updateCategory).toHaveBeenCalledTimes(1)
  })

  it('should delete a category', async () => {
    const id = 1
    jest.spyOn(useCase, 'deleteCategory').mockResolvedValue(undefined)
    const result = await controller.deleteCategory(id.toString())
    expect(useCase.deleteCategory).toHaveBeenCalledTimes(1)
    expect(useCase.deleteCategory).toHaveBeenCalledWith(id.toString())
    expect(result).toBeUndefined()
  })
})
