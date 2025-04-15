import { Test, TestingModule } from '@nestjs/testing'
import { CategoryUseCase } from '../../../src/modules/category/category.usecase'
import { CategoryService } from '../../../src/modules/category/category.service'
import { CryptoUseCase } from '../../../src/modules/crypto/crypto.usecase'
import {
  CreateCategoryDto,
  SearchCategoryDto,
  UpdateCategoryDto,
} from '../../../src/modules/category/dto'
import { Categories } from '@prisma/client'
import { BadRequestException } from '@nestjs/common'

describe('CategoryUseCase', () => {
  let useCase: CategoryUseCase
  const createdCategories: number[] = []
  let categoryService: CategoryService

  const categories: Categories[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    nome: `Category ${i + 1}`,
    criado_em: new Date(),
    alterado_em: new Date(),
  }))

  const mockCategoryService = {
    findByFilters: jest.fn(),
    findCategoryById: jest.fn(),
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  }

  const mockCryptoUseCase = {
    hashPassword: jest.fn(password => `hashed-${password}`),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryUseCase,
        { provide: CategoryService, useValue: mockCategoryService },
        { provide: CryptoUseCase, useValue: mockCryptoUseCase },
      ],
    }).compile()

    useCase = module.get<CategoryUseCase>(CategoryUseCase)
    categoryService = module.get<CategoryService>(CategoryService)
  })

  afterEach(async () => {
    for (const id of createdCategories) {
      await useCase.deleteCategory(id.toString())
    }

    jest.clearAllMocks()
  })

  it('should create a category', async () => {
    const dto: CreateCategoryDto = { nome: 'test' }
    jest.spyOn(categoryService, 'findByFilters').mockResolvedValue([])
    jest
      .spyOn(categoryService, 'createCategory')
      .mockResolvedValue({
        id: 1,
        nome: dto.nome,
        criado_em: new Date(),
        alterado_em: new Date(),
      } as Categories)
    const result = await useCase.createCategory(dto)
    expect(result).toHaveProperty('id')
    expect(result.nome).toEqual(dto.nome)
    expect(categoryService.createCategory).toHaveBeenCalledWith(dto)
    expect(categoryService.createCategory).toHaveBeenCalledTimes(1)
  })

  it('should not create a category if it already exists', async () => {
    const dto: CreateCategoryDto = { nome: 'test' }
    jest.spyOn(categoryService, 'findByFilters').mockResolvedValue([categories[0]])

    try {
      await useCase.createCategory(dto)
    } catch (error: any) {
      expect(error).toBeInstanceOf(BadRequestException)
      expect(error.message).toEqual(
        `Category with login ${dto.nome} already exists.`,
      )
      expect(categoryService.findByFilters).toHaveBeenCalledWith({ nome: dto.nome })
      expect(categoryService.findByFilters).toHaveBeenCalledTimes(1)
      expect(categoryService.createCategory).not.toHaveBeenCalled()
    }
  })

  it('should retrieve categories by filter', async () => {
    const filter: SearchCategoryDto = {
      page: 1,
      perPage: 10,
      orderBy: 'nome',
      order: 'asc',
    }
    const filteredCategories = categories
      .filter(category => category.nome.includes('Category'))
      .slice(0, 10)
      .sort((a, b) => a.nome.localeCompare(b.nome))

    jest
      .spyOn(categoryService, 'findByFilters')
      .mockResolvedValue(filteredCategories)

    const result = await useCase.findByFilter(filter)
    expect(result.length).toBe(10)
    expect(result[0]).toEqual(filteredCategories[0])
    expect(categoryService.findByFilters).toHaveBeenCalledWith(filter)
    expect(categoryService.findByFilters).toHaveBeenCalledTimes(1)
  })
  it('should retrieve categories by filter containing category`s name', async () => {
    const filter: SearchCategoryDto = {
      page: 1,
      perPage: 10,
      orderBy: 'nome',
      order: 'asc',
      nome: 'Category 5',
    }
    const filteredCategories = categories.filter(category =>
      category.nome.includes(filter.nome),
    )
    jest
      .spyOn(categoryService, 'findByFilters')
      .mockResolvedValue(filteredCategories)

    const result = await useCase.findByFilter(filter)
    expect(result.length).toBe(1)
    expect(result[0]).toEqual(filteredCategories[0])
    expect(categoryService.findByFilters).toHaveBeenCalledWith(filter)
    expect(categoryService.findByFilters).toHaveBeenCalledTimes(1)
  })

  it('should retrieve a category by ID', async () => {
    const id = '1'
    jest.spyOn(categoryService, 'findCategoryById').mockResolvedValue(categories[0])
    const result = await useCase.getCategoryById(id)

    expect(categoryService.findCategoryById).toHaveBeenCalledWith(Number(id))
    expect(categoryService.findCategoryById).toHaveBeenCalledTimes(1)
    expect(result).toEqual(categories[0])
    expect(result).toHaveProperty('id', 1)
    expect(result).toHaveProperty('nome', 'Category 1')
    expect(result).toHaveProperty('criado_em')
    expect(result).toHaveProperty('alterado_em')
  })

  it('should update a category', async () => {
    const id = '1'
    const dto: UpdateCategoryDto = { nome: 'Updated Name' }

    const updatedCategory = {
      id: Number(id),
      nome: dto.nome,
      criado_em: new Date(),
      alterado_em: new Date(),
    }

    jest.spyOn(categoryService, 'updateCategory').mockResolvedValue(updatedCategory)
    jest.spyOn(categoryService, 'findCategoryById').mockResolvedValue(categories[0])

    const result = await useCase.updateCategory(id, dto)
    expect(categoryService.updateCategory).toHaveBeenCalledWith(Number(id), dto)
    expect(categoryService.updateCategory).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      id: Number(id),
      nome: dto.nome,
      criado_em: expect.any(Date),
      alterado_em: expect.any(Date),
    })
  })

  it('should not update a category if it does not exist', async () => {
    const id = '999'
    const dto: UpdateCategoryDto = { nome: 'Non-existent Category' }

    jest.spyOn(categoryService, 'findCategoryById').mockResolvedValue(null)

    try {
      await useCase.updateCategory(id, dto)
    } catch (error: any) {
      expect(error).toBeInstanceOf(BadRequestException)
      expect(error.message).toEqual(`Category with ID ${id} does not exist.`)
      expect(categoryService.findCategoryById).toHaveBeenCalledWith(Number(id))
      expect(categoryService.updateCategory).not.toHaveBeenCalled()
      expect(categoryService.findCategoryById).toHaveBeenCalledTimes(1)
    }
  })

  it('should delete a category', async () => {
    const id = 1
    jest.spyOn(categoryService, 'findCategoryById').mockResolvedValue(categories[0])
    jest.spyOn(categoryService, 'deleteCategory').mockResolvedValue(undefined)
    await useCase.deleteCategory(id.toString())
    expect(categoryService.deleteCategory).toHaveBeenCalledWith(Number(id))
  })
})
