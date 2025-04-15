import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../../../src/modules/auth/auth.controller'
import { AuthUseCase } from '../../../src/modules/auth/auth.usecase'
import { JwtService } from '@nestjs/jwt'
import { ThrottlerStorage } from '@nestjs/throttler'

describe('AuthController', () => {
  let authController: AuthController
  let authUseCase: AuthUseCase

  beforeEach(async () => {
    const mockAuthUseCase = {
      authenticate: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthUseCase, useValue: mockAuthUseCase },
        { provide: JwtService, useValue: { sign: jest.fn(() => 'mockToken') } },
        { provide: 'THROTTLER:MODULE_OPTIONS', useValue: {} }, // Mock Throttler options
        {
          provide: ThrottlerStorage,
          useValue: { getRecord: jest.fn(), addRecord: jest.fn() },
        },
      ],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authUseCase = module.get<AuthUseCase>(AuthUseCase)
  })

  it('should return access token on login', async () => {
    const mockUser = { id: 1, login: 'testuser', senha: '123456' }
    jest
      .spyOn(authUseCase, 'authenticate')
      .mockResolvedValue({ access_token: 'mockToken', id: 1, login: 'testuser' })
    const result = await authController.userAuth({
      login: mockUser.login,
      password: mockUser.senha,
    })
    expect(authUseCase.authenticate).toHaveBeenCalledTimes(1)
    expect(authUseCase.authenticate).toHaveBeenCalledWith({
      login: mockUser.login,
      password: mockUser.senha,
    })
    expect(result).toEqual({ id: 1, login: 'testuser', access_token: 'mockToken' })
  })
})
