import { Test, TestingModule } from '@nestjs/testing'
import { UserUseCase } from '../../../src/modules/user/user.usecase'
import { UserService } from '../../../src/modules/user/user.service'
import { CryptoUseCase } from '../../../src/modules/crypto/crypto.usecase'
import {
  CreateUserDto,
  UpdateUserDto,
} from '../../../src/modules/user/dto'
import { Users } from '@prisma/client'
import { BadRequestException } from '@nestjs/common'

const users: Users[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  nome: `User ${i + 1}`,
  login: `user${i + 1}`,
  senha: '123' + i,
  criado_em: new Date(),
  alterado_em: new Date(),
}))

describe('UserUseCase', () => {
  let useCase: UserUseCase
  let userService: UserService
  let cryptoUseCase: CryptoUseCase
  const createdUserIds: number[] = []


  const mockUserService = {
    findByFilter: jest.fn().mockResolvedValue([]),
    findUserById: jest.fn().mockResolvedValue(null),
    createUser: jest.fn().mockResolvedValue(null),
    updateUser: jest.fn().mockResolvedValue(null),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  }

  const mockCryptoUseCase = {
    hashPassword: jest.fn().mockResolvedValue('hashed_password'),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUseCase,
        { provide: UserService, useValue: mockUserService },
        { provide: CryptoUseCase, useValue: mockCryptoUseCase },
      ],
    }).compile()

    useCase = module.get<UserUseCase>(UserUseCase)
    userService = module.get<UserService>(UserService)
    cryptoUseCase = module.get<CryptoUseCase>(CryptoUseCase)

    jest.spyOn(mockUserService, 'findByFilter')
    jest.spyOn(mockUserService, 'findUserById')
    jest.spyOn(mockUserService, 'createUser')
    jest.spyOn(mockUserService, 'updateUser')
    jest.spyOn(mockUserService, 'deleteUser')
    jest.spyOn(mockCryptoUseCase, 'hashPassword')
  })

  afterEach(async () => {
    for (const userId of createdUserIds) {
      await mockUserService.deleteUser(userId)
    }
    createdUserIds.length = 0
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should retrieve a user by ID', async () => {
    const user = users[0]
    const userId = '1'
    jest.spyOn(userService, 'findUserById').mockResolvedValue(user)

    const result = await useCase.getUserById(userId)
    expect(result).toEqual(user)
    expect(userService.findUserById).toHaveBeenCalledTimes(1)
    expect(userService.findUserById).toHaveBeenCalledWith(Number(userId))
  })

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      nome: 'Test',
      login: 'test',
      senha: '1234',
    }

    const newUser = {
      id: 1,
      nome: createUserDto.nome,
      login: createUserDto.login,
      criado_em: new Date(),
      alterado_em: new Date(),
    }

    jest.spyOn(userService, 'findByFilter').mockResolvedValue([])
    jest.spyOn(cryptoUseCase, 'hashPassword').mockResolvedValue('hashed_password')
    jest.spyOn(userService, 'createUser').mockResolvedValue(newUser)

    const createdUser = await useCase.createUser(createUserDto)

    expect(userService.findByFilter).toHaveBeenCalledTimes(1)
    expect(userService.findByFilter).toHaveBeenCalledWith({
      login: createUserDto.login,
    })
    expect(cryptoUseCase.hashPassword).toHaveBeenCalledTimes(1)
    expect(cryptoUseCase.hashPassword).toHaveBeenCalledWith(createUserDto.senha)
    expect(userService.createUser).toHaveBeenCalledTimes(1)
    expect(userService.createUser).toHaveBeenCalledWith({
      ...createUserDto,
      senha: 'hashed_password',
    })
    expect(createdUser).toEqual(newUser)
  })

  it('should not create a user if login already exists', async () => {
    const createUserDto: CreateUserDto = {
      nome: 'Test',
      login: 'existing_user',
      senha: '1234',
    }

    jest.spyOn(userService, 'findByFilter').mockResolvedValue([users[0]])

    try {
      await useCase.createUser(createUserDto)
    } catch (error: any) {
      expect(error).toBeInstanceOf(BadRequestException)
      expect(error.message).toEqual("User with login existing_user already exists.")
      expect(userService.findByFilter).toHaveBeenCalledTimes(1)
      expect(userService.findByFilter).toHaveBeenCalledWith({
        login: createUserDto.login,
      })
      expect(userService.updateUser).not.toHaveBeenCalled()
    }
  })

  it('should update a user by ID', async () => {
    const userId = '1'

    const user: Users = {
      id: 1,
      nome: 'Update User',
      login: 'update_user',
      senha: 'hashed_password',
      criado_em: new Date(),
      alterado_em: new Date(),
    }
    const updateUserDto: UpdateUserDto = { nome: 'Updated User Test' }

    jest.spyOn(userService, 'findUserById').mockResolvedValue(user)
    jest
      .spyOn(userService, 'updateUser')
      .mockResolvedValue({ ...user, ...updateUserDto })

    const updatedUser = await useCase.updateUser(userId, updateUserDto)

    expect(userService.findUserById).toHaveBeenCalledTimes(1)
    expect(userService.findUserById).toHaveBeenCalledWith(Number(userId))
    expect(userService.updateUser).toHaveBeenCalledTimes(1)
    expect(userService.updateUser).toHaveBeenCalledWith(Number(userId), {
      nome: updateUserDto.nome,
    })
    expect(updatedUser.nome).toEqual(updateUserDto.nome)
    expect(updatedUser.login).toEqual(user.login)
  })

  it('should not update a user if user does not exist', async () => {
    const userId = '999'
    const updateUserDto: UpdateUserDto = { nome: 'Nonexistent User' }

    jest.spyOn(userService, 'findUserById').mockResolvedValue(null)

    try {
      await useCase.updateUser(userId, updateUserDto)
    } catch (error: any) {
      expect(error).toBeInstanceOf(BadRequestException)
      expect(error.message).toEqual('User with ID 999 does not exist.')
      expect(userService.findUserById).toHaveBeenCalledTimes(1)
      expect(userService.findUserById).toHaveBeenCalledWith(Number(userId))
      expect(userService.updateUser).not.toHaveBeenCalled()
    }
  })

  it('should delete a user by ID', async () => {
    const userId = '1'
    mockUserService.findUserById.mockResolvedValue({ id: 1 })
    mockUserService.deleteUser.mockResolvedValue(undefined)
    const result = await useCase.deleteUser(userId)
    expect(result).toBeUndefined()
    expect(mockUserService.findUserById).toHaveBeenCalledWith(Number(userId))
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(Number(userId))
  })
})
