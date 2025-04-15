import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaDatabase extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaDatabase.name)

  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: PrismaDatabase.buildConnectionString(configService),
        },
      },
    })
  }

  async onModuleInit() {
    try {
      this.logger.debug('Iniciando conexão com o banco de dados...')
      await this.$connect()
      this.logger.debug('Conexão com o banco de dados estabelecida com sucesso.')
    } catch (error) {
      this.logger.error('Erro ao conectar ao banco de dados:', error)
    }
  }

  // Método para construir a string de conexão dinamicamente
  private static buildConnectionString(configService: ConfigService): string {
    const dbUser = configService.get('DB_USERNAME')
    const dbPassword = configService.get('DB_PASSWORD')
    const dbHost = configService.get('DB_HOST')
    const dbPort = configService.get('DATABASE_PORT')
    const dbName = configService.get('DB_DATABASE')

    return `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
  }

  async findByFilter<
    TModel extends keyof Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$use' | '$transaction' | '$extends'
    >,
  >(
    model: TModel,
    data: PrismaClient[TModel] extends { findMany: (args: any) => any }
      ? Parameters<PrismaClient[TModel]['findMany']>[0]['where']
      : never,
    options?: PrismaClient[TModel] extends {
      findMany: (args: { select?: any; include?: any }) => any
    }
      ? {
          select?: Parameters<PrismaClient[TModel]['findMany']>[0]['select']
          include?: Parameters<PrismaClient[TModel]['findMany']>[0] extends {
            include?: any
          }
            ? Parameters<PrismaClient[TModel]['findMany']>[0]['include']
            : never
          page?: number
          pageSize?: number
          orderBy?: string
          order?: 'asc' | 'desc'
        }
      : never,
  ): Promise<any[]> {
    const where = Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (!value && value !== 0 && value !== false) return acc

        // Filtros para campos de data
        if (['criado_em', 'atualizado_em'].includes(key)) {
          return { ...acc, [key]: { equals: value } }
        }

        // Filtro para campos de data em string (ISO)
        if (['birthdate', 'date', 'startTime', 'endTime'].includes(key)) {
          return { ...acc, [key]: { equals: new Date(value as string) } }
        }

        // Filtro para campos numéricos
        if (typeof value === 'number') {
          return { ...acc, [key]: { equals: value } }
        }

        // Filtro para booleanos
        if (typeof value === 'boolean') {
          return { ...acc, [key]: { equals: value } }
        }

        // Filtro padrão para strings (case-insensitive)
        return {
          ...acc,
          [key]:
            typeof value === 'string'
              ? {
                  contains: value,
                }
              : { equals: value },
        }
      },
      {} as PrismaClient[TModel] extends { findMany: (args: any) => any }
        ? Parameters<PrismaClient[TModel]['findMany']>[0]['where']
        : never,
    )

    const page = options?.page ?? 1
    const pageSize = options?.pageSize ?? 10
    const skip = (page - 1) * pageSize
    const take = pageSize

    const orderBy = options?.orderBy
      ? { [options.orderBy]: options.order ?? 'asc' }
      : undefined

    const findManyOptions = { ...options }
    delete findManyOptions.page
    delete findManyOptions.pageSize
    delete findManyOptions.order
    delete findManyOptions.orderBy

    return (this[model] as any).findMany({
      where,
      skip,
      take,
      orderBy,
      ...findManyOptions,
    })
  }

  async findById<
    TModel extends keyof Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$use' | '$transaction' | '$extends'
    >,
  >(
    model: TModel,
    id: number | string,
    options?: {
      select?: any
      include?: any
    },
  ): Promise<any | null> {
    return (this[model] as any).findUnique({
      where: { id },
      select: options?.select ? { ...options.select } : undefined,
      include: options?.include ? { ...options.include } : undefined,
    })
  }

  async create<
    TModel extends keyof Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$use' | '$transaction' | '$extends'
    >,
  >(
    model: TModel,
    data: PrismaClient[TModel] extends { create: (args: any) => any }
      ? Parameters<PrismaClient[TModel]['create']>[0]['data']
      : never,
  ): Promise<any> {
    return (this[model] as any).create({ data })
  }

  async update<
    TModel extends keyof Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$use' | '$transaction' | '$extends'
    >,
  >(
    model: TModel,
    where: PrismaClient[TModel] extends { update: (args: any) => any }
      ? Parameters<PrismaClient[TModel]['update']>[0]['where']
      : never,
    data: PrismaClient[TModel] extends { update: (args: any) => any }
      ? Parameters<PrismaClient[TModel]['update']>[0]['data']
      : never,
    options?: {
      select?: any
    },
  ): Promise<any> {
    const updateOptions = {
      where,
      data,
      select: options?.select ? { ...options?.select } : undefined,
    }
    return (this[model] as any).update(updateOptions)
  }

  async delete<
    TModel extends keyof Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$use' | '$transaction' | '$extends'
    >,
  >(
    model: TModel,
    where: PrismaClient[TModel] extends { delete: (args: any) => any }
      ? Parameters<PrismaClient[TModel]['delete']>[0]['where']
      : never,
  ): Promise<any> {
    return (this[model] as any).delete({
      where,
    })
  }
}
