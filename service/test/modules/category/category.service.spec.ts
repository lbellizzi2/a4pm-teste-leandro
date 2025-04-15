import { Test, TestingModule } from '@nestjs/testing'
import { CategoryService } from '../../../src/modules/category/category.service'
import { PrismaDatabase } from '../../../src/commons/database/prisma.database'
import { Categories } from '@prisma/client'
import { SearchCategoryDto } from '@/modules/category/dto'

describe('CategoryService', () => {
  let service: CategoryService
  let prisma: PrismaDatabase

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: PrismaDatabase,
          useValue: {
            findByFilter: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<CategoryService>(CategoryService)
    prisma = module.get<PrismaDatabase>(PrismaDatabase)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await prisma.delete('categories', { id: 1 })
  })

  it('should find categories by filter', async () => {
    const mockFilter: SearchCategoryDto = {
      page: 1,
      perPage: 10,
      orderBy: 'nome',
      order: 'asc',
    }
    const mockResult = [{ id: 1, nome: 'Category 1' }]
    jest.spyOn(prisma, 'findByFilter').mockResolvedValue(mockResult)

    const result = await service.findByFilters(mockFilter)

    expect(prisma.findByFilter).toHaveBeenCalledWith(
      'categories',
      {},
      { page: 1, pageSize: 10, orderBy: 'nome', order: 'asc' },
    )
    expect(result).toEqual(mockResult)
  })

  it('should find a category by ID', async () => {
    const mockCategory: Categories = { id: 1, nome: 'Category 1' }
    jest.spyOn(prisma, 'findById').mockResolvedValue(mockCategory)

    const result = await service.findCategoryById(1)

    expect(prisma.findById).toHaveBeenCalledWith('categories', 1)
    expect(result).toEqual(mockCategory)
  })

  it('should create a category', async () => {
    const mockData = { nome: 'New Category' }
    const mockCategory: Categories = { id: 1, nome: 'New Category' }
    jest.spyOn(prisma, 'create').mockResolvedValue(mockCategory)

    const result = await service.createCategory(mockData)

    expect(prisma.create).toHaveBeenCalledWith('categories', mockData)
    expect(result).toEqual(mockCategory)
  })

  it('should update a category', async () => {
    const mockData = { nome: 'Updated Category' }
    const mockCategory: Categories = { id: 1, nome: 'Updated Category' }
    jest.spyOn(prisma, 'update').mockResolvedValue(mockCategory)

    const result = await service.updateCategory(1, mockData)

    expect(prisma.update).toHaveBeenCalledWith('categories', { id: 1 }, mockData)
    expect(result).toEqual(mockCategory)
  })

  it('should delete a category', async () => {
    jest.spyOn(prisma, 'delete').mockResolvedValue(undefined)

    await service.deleteCategory(1)

    expect(prisma.delete).toHaveBeenCalledWith('categories', { id: 1 })
  })
})
