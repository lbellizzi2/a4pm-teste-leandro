import { Injectable } from '@nestjs/common'
import { Categories } from '@prisma/client'
import { PrismaDatabase } from '../../commons/database/prisma.database'
import { SearchCategoryDto } from './dto'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaDatabase) {}

  async findByFilters(filter: SearchCategoryDto): Promise<any[]> {
    const page = filter.page || 1
    const perPage = filter.perPage || 10
    const orderBy = filter.orderBy || 'nome'
    const order = filter.order || 'asc'

    delete filter.page
    delete filter.perPage
    delete filter.orderBy
    delete filter.order

    return this.prisma.findByFilter('categories', filter, {
      page,
      pageSize: perPage,
      orderBy,
      order,
    })
  }

  async findCategoryById(id: number): Promise<Categories> {
    return this.prisma.findById('categories', id)
  }

  async createCategory(data: any): Promise<Categories> {
    return this.prisma.create('categories', data)
  }

  async updateCategory(id: number, data: any): Promise<Categories> {
    return this.prisma.update('categories', { id }, data)
  }

  async deleteCategory(id: number): Promise<void> {
    return this.prisma.delete('categories', { id })
  }
}
