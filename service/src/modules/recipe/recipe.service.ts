import { Injectable } from '@nestjs/common'
import { PrismaDatabase } from '../../commons/database/prisma.database'
import { CreateRecipeDto, SearchRecipeDto, UpdateRecipeDto } from './dto'
import { Prisma, Recipes } from '@prisma/client'

@Injectable()
export class RecipeService {
  constructor(private readonly prisma: PrismaDatabase) {}

  private serializeBigInt(data: any): any {
    return JSON.parse(
      JSON.stringify(data, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    )
  }

  async findByFilter(filter: SearchRecipeDto): Promise<Recipes[]> {
    const page = filter.page || 1
    const perPage = filter.perPage || 10
    const orderBy = filter.orderBy || 'nome'
    const order = filter.order || 'asc'

    delete filter.page
    delete filter.perPage
    delete filter.orderBy
    delete filter.order

    if (filter.searchQuery)
      return this.searchRecipes(filter.searchQuery, page, perPage)

    const recipes = await this.prisma.findByFilter('recipes', filter, {
      select: {
        id: true,
        nome: true,
        tempo_preparo_minutos: true,
        porcoes: true,
        modo_preparo: true,
        ingredientes: true,
        criado_em: true,
        alterado_em: true,
        user: { select: { id: true, nome: true } },
        categoria: { select: { id: true, nome: true } },
      },
      page,
      pageSize: perPage,
      orderBy,
      order,
    })
    return this.serializeBigInt(recipes)
  }

  async findRecipeById(id: number): Promise<Recipes> {
    const recipe = await this.prisma.findById('recipes', id, {
      select: {
        id: true,
        nome: true,
        tempo_preparo_minutos: true,
        porcoes: true,
        modo_preparo: true,
        ingredientes: true,
        criado_em: true,
        alterado_em: true,
        user: { select: { id: true, nome: true } },
        categoria: { select: { id: true, nome: true } },
      },
    })
    return this.serializeBigInt(recipe)
  }

  async createRecipe(data: CreateRecipeDto): Promise<Recipes> {
    const recipe = await this.prisma.create('recipes', {
      nome: data.nome,
      tempo_preparo_minutos: data.tempo_preparo_minutos,
      porcoes: data.porcoes,
      modo_preparo: data.modo_preparo,
      ingredientes: data.ingredientes,
      id_usuarios: data.id_usuarios,
      id_categorias: data.id_categorias,
      criado_em: new Date(),
      alterado_em: new Date(),
    })
    return this.serializeBigInt(recipe)
  }

  async updateRecipe(id: number, data: UpdateRecipeDto): Promise<Recipes> {
    const recipe = await this.prisma.update('recipes', { id }, data)
    return this.serializeBigInt(recipe)
  }

  async deleteRecipe(id: number): Promise<void> {
    return this.prisma.delete('recipes', { id })
  }

  async searchRecipes(
    query: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<Recipes[]> {
    const sanitizedQuery = query.replace(/[^\w\s]/gi, '')
    const offset = (page - 1) * perPage

    const recipes = await this.prisma.$queryRaw<Recipes[]>(Prisma.sql`
      SELECT r.*,
             c.nome AS categoria_nome
      FROM receitas r
      LEFT JOIN categorias c ON r.id_categorias = c.id
      WHERE LOWER(r.nome) LIKE LOWER(${`%${sanitizedQuery}%`})
         OR LOWER(r.ingredientes) LIKE LOWER(${`%${sanitizedQuery}%`})
         OR LOWER(r.modo_preparo) LIKE LOWER(${`%${sanitizedQuery}%`})
         OR LOWER(c.nome) LIKE LOWER(${`%${sanitizedQuery}%`})
      LIMIT ${perPage} OFFSET ${offset}
    `)
    return this.serializeBigInt(recipes)
  }
}
