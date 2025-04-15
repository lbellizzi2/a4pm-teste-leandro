import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from '../../../src/modules/user/user.controller'
import { UserUseCase } from '../../../src/modules/user/user.usecase'
import {
  CreateUserDto,
  SearchUserDto,
  UpdateUserDto,
} from '../../../src/modules/user/dto'
import { Users } from '@prisma/client'

describe('UserController', () => {
  let controller: UserController
  let userUseCase: UserUseCase
  const createdUserIds: string[] = []

  const mockUserUseCase = {
    findByFilter: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  }

  const mockUsers: Users[] = [
    {
      id: 1,
      nome: 'User One',
      login: 'user1',
      senha: 'pass1',
      criado_em: new Date(),
      alterado_em: new Date(),
    },
    {
      id: 2,
      nome: 'User Two',
      login: 'user2',
      senha: 'pass2',
      criado_em: new Date(),
      alterado_em: new Date(),
    },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserUseCase, useValue: mockUserUseCase }],
    }).compile()

    controller = module.get<UserController>(UserController)
    userUseCase = module.get<UserUseCase>(UserUseCase)
  })

  afterEach(async () => {
    for (const userId of createdUserIds) {
      await mockUserUseCase.deleteUser(userId)
    }
    createdUserIds.length = 0
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should retrieve all users', async () => {
    const filter: SearchUserDto = { page: 1, perPage: 10 }
    jest.spyOn(userUseCase, 'findByFilter').mockResolvedValue(mockUsers)
    const result = await controller.getAllUsers(filter)
    expect(result).toEqual(mockUsers)
    expect(mockUserUseCase.findByFilter).toHaveBeenCalledWith(filter)
  })

  it('should retrieve a user by ID', async () => {
    const userId = '1'
    const mockUser = {
      id: 1,
      nome: 'User One',
      login: 'user1',
      senha: 'pass1',
      criado_em: new Date(),
      alterado_em: new Date(),
    }
    jest.spyOn(userUseCase, 'getUserById').mockResolvedValue(mockUser)
    const result = await controller.getUserById(userId)
    expect(result).toEqual(mockUser)
    expect(mockUserUseCase.getUserById).toHaveBeenCalledWith(userId)
  })

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      nome: 'Test',
      login: 'test',
      senha: '1234',
    }
    const createdUser = { id: '1', ...createUserDto }
    mockUserUseCase.createUser.mockResolvedValue(createdUser)
    const result = await controller.createUser(createUserDto)
    createdUserIds.push(createdUser.id)
    expect(result).toEqual(createdUser)
    expect(mockUserUseCase.createUser).toHaveBeenCalledWith(createUserDto)
  })

  it('should update a user by ID', async () => {
    const userId = '1'
    const updateUserDto: UpdateUserDto = { nome: 'Updated User' }
    const updatedUser = { id: 1, ...updateUserDto }
    mockUserUseCase.updateUser.mockResolvedValue(updatedUser)
    const result = await controller.updateUser(userId, updateUserDto)
    expect(result).toEqual(updatedUser)
    expect(mockUserUseCase.updateUser).toHaveBeenCalledWith(userId, updateUserDto)
  })

  it('should delete a user by ID', async () => {
    const userId = '1'
    mockUserUseCase.deleteUser.mockResolvedValue(undefined)
    const result = await controller.deleteUser(userId)
    expect(result).toBeUndefined()
    expect(mockUserUseCase.deleteUser).toHaveBeenCalledWith(userId)
  })
})
