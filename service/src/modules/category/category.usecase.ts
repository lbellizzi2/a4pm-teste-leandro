import { BadRequestException, Injectable } from '@nestjs/common'
import { Categories } from '@prisma/client'
import { CategoryService } from './category.service'
import { CreateCategoryDto, SearchCategoryDto, UpdateCategoryDto } from './dto'

@Injectable()
export class CategoryUseCase {
  constructor(private readonly categoryService: CategoryService) {}

  async findByFilter(filter: SearchCategoryDto): Promise<Categories[]> {
    return this.categoryService.findByFilters(filter)
  }

  async getCategoryById(id: string): Promise<Categories> {
    return this.categoryService.findCategoryById(Number(id))
  }

  async createCategory(data: CreateCategoryDto): Promise<Categories> {
    const category = await this.categoryService.findByFilters({ nome: data.nome })

    if (category.length > 0) {
      throw new BadRequestException(
        `Category with login ${data.nome} already exists.`,
      )
    }

    return this.categoryService.createCategory(data)
  }

  async updateCategory(id: string, data: UpdateCategoryDto): Promise<Categories> {
    const category = await this.categoryService.findCategoryById(Number(id))
    if (!category) {
      throw new BadRequestException(`Category with ID ${id} does not exist.`)
    }

    return this.categoryService.updateCategory(Number(id), data)
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryService.findCategoryById(Number(id))
    if (!category) {
      throw new BadRequestException(`Category with ID ${id} does not exist.`)
    }
    return this.categoryService.deleteCategory(Number(id))
  }
}
