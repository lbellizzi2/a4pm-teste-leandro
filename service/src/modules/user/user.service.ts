import { Injectable } from '@nestjs/common'
import { Users } from '@prisma/client'
import { PrismaDatabase } from '../../commons/database/prisma.database'
import { SearchUserDto } from './dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaDatabase) {}

  async findByFilter(filter: SearchUserDto, password?: boolean): Promise<any[]> {
    const page = filter.page || 1
    const perPage = filter.perPage || 10
    const orderBy = filter.orderBy || 'nome'
    const order = filter.order || 'asc'

    delete filter.page
    delete filter.perPage
    delete filter.orderBy
    delete filter.order

    return this.prisma.findByFilter('users', filter, {
      select: {
        nome: true,
        login: true,
        id: true,
        senha: password || false,
        criado_em: true,
        alterado_em: true,
        receitas: {
          select: {
            id: true,
            nome: true,
            criado_em: true,
            alterado_em: true,
            tempo_preparo_minutos: true,
            porcoes: true,
            modo_preparo: true,
            categoria: true,
            ingredientes: true,
          },
        },
      },
      page,
      pageSize: perPage,
      orderBy,
      order,
    })
  }

  async findUserById(id: number): Promise<Users> {
    return this.prisma.findById('users', id, {
      select: {
        nome: true,
        login: true,
        id: true,
        criado_em: true,
        alterado_em: true,
        receitas: true,
      },
    })
  }

  async createUser(data: any): Promise<{
    id: number
    nome: string | null
    login: string
    criado_em: Date
    alterado_em: Date
  }> {
    const user = await this.prisma.create('users', {
      ...data,
      criado_em: new Date(),
      alterado_em: new Date(),
    })
    delete user.senha
    return user
  }

  async updateUser(id: number, data: any): Promise<Users> {
    return this.prisma.update('users', { id }, data, {
      select: {
        id: true,
        nome: true,
        login: true,
        criado_em: true,
        alterado_em: true,
        senha: false
      },
    })
  }

  async deleteUser(id: number): Promise<void> {
    return this.prisma.delete('users', { id })
  }
}
