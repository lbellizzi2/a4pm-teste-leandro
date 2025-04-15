import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../../../src/modules/user/user.service'
import { PrismaDatabase } from '../../../src/commons/database/prisma.database'
import { SearchUserDto } from '../../../src/modules/user/dto'
import { Users } from '@prisma/client'

describe('UserService', () => {
  let service: UserService
  const createdUserIds: number[] = []

  const mockPrismaDatabase = {
    findByFilter: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaDatabase, useValue: mockPrismaDatabase },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  afterEach(async () => {
    for (const userId of createdUserIds) {
      await mockPrismaDatabase.delete('users', { id: userId })
    }
    createdUserIds.length = 0
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should find users by filter', async () => {
    const filter: SearchUserDto = {
      page: 1,
      perPage: 10,
      orderBy: 'name',
      order: 'asc',
    }
    const users: Users[] = [
      ...Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        nome: `User ${i + 1}`,
        login: `user${i + 1}`,
        senha: '',
        criado_em: new Date(),
        alterado_em: new Date(),
      })),
    ]
    mockPrismaDatabase.findByFilter.mockResolvedValue(users.slice(0, 10))
    const result = await service.findByFilter(filter)
    expect(result).toEqual(users.slice(0, 10))
    expect(mockPrismaDatabase.findByFilter).toHaveBeenCalledWith(
      'users',
      {},
      {
        order: 'asc',
        orderBy: 'name',
        page: 1,
        pageSize: 10,
        select: {
          alterado_em: true,
          criado_em: true,
          id: true,
          login: true,
          nome: true,
          senha: false,
          receitas: {
            select: {
              alterado_em: true,
              categoria: true,
              criado_em: true,
              id: true,
              ingredientes: true,
              modo_preparo: true,
              nome: true,
              porcoes: true,
              tempo_preparo_minutos: true,
            },
          },
        },
      },
    )
  })

  it('should find a user by ID', async () => {
    const userId = 1
    const user = { id: userId, nome: 'Test User', login: 'test' }
    mockPrismaDatabase.findById.mockResolvedValue(user)

    const result = await service.findUserById(userId)
    expect(result).toEqual(user)
    expect(mockPrismaDatabase.findById).toHaveBeenCalledWith(
      'users',
      userId,
      expect.objectContaining({ select: expect.any(Object) }),
    )
  })

  it('should create a user', async () => {
    const userData = { nome: 'New User', login: 'newuser', senha: '1234' }
    const createdUser = { id: 1, ...userData }
    mockPrismaDatabase.create.mockResolvedValue(createdUser)

    const result = await service.createUser(userData)
    createdUserIds.push(createdUser.id)
    expect(result).toEqual(createdUser)
    expect(mockPrismaDatabase.create).toHaveBeenCalledWith('users', {...userData, criado_em: expect.any(Date), alterado_em: expect.any(Date)})
  })

  it('should update a user', async () => {
    const userId = 1
    const updateData = { nome: 'Updated User' }
    const updatedUser = { id: userId, ...updateData }
    mockPrismaDatabase.update.mockResolvedValue(updatedUser)

    const result = await service.updateUser(userId, updateData)
    expect(result).toEqual(updatedUser)
  })

  it('should delete a user', async () => {
    const userId = 1
    mockPrismaDatabase.delete.mockResolvedValue(undefined)

    const result = await service.deleteUser(userId)
    expect(result).toBeUndefined()
    expect(mockPrismaDatabase.delete).toHaveBeenCalledWith('users', { id: userId })
  })
})
