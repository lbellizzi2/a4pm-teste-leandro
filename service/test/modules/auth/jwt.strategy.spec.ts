import { Test, TestingModule } from '@nestjs/testing'
import { JwtStrategy } from '../../../src/modules/jwt/jwt.strategy'
import { UserUseCase } from '../../../src/modules/user/user.usecase'
import { UserService } from '../../../src/modules/user/user.service'
import { CryptoUseCase } from '../../../src/modules/crypto/crypto.usecase'
import { PrismaDatabase } from '../../../src/commons/database/prisma.database'


describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy
  let userUseCase: UserUseCase

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
        JwtStrategy,
        UserUseCase,
        {
          provide: 'JwtService',
          useValue: {
            verify: jest.fn(),
          },
        },
        UserService,
        CryptoUseCase,
        { provide: PrismaDatabase, useValue: mockPrismaDatabase },
      ],
    }).compile()

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy)
    userUseCase = module.get<UserUseCase>(UserUseCase)
  })

  it('should call getUserById with correct user ID', async () => {
    const payload = { sub: 1, username: 'testuser' }
    const getUserByIdSpy = jest.spyOn(userUseCase, 'getUserById').mockResolvedValue({
      id: 1,
      nome: 'Test User',
      login: 'testuser',
      senha: 'hashed_pass',
      criado_em: new Date(),
      alterado_em: new Date(),
    })

    await jwtStrategy.validate(payload)
    expect(getUserByIdSpy).toHaveBeenCalledWith(payload.sub)
  })
})
