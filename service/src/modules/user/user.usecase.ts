import { BadRequestException, Injectable } from '@nestjs/common'
import { Users } from '@prisma/client'
import { UserService } from './user.service'
import { CreateUserDto, SearchUserDto, UpdateUserDto } from './dto'
import { CryptoUseCase } from '../crypto/crypto.usecase'

@Injectable()
export class UserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoUseCase: CryptoUseCase,
  ) {}

  async findByFilter(filter: SearchUserDto, password?: boolean): Promise<Users[]> {
    return this.userService.findByFilter(filter, password)
  }

  async getUserById(id: string): Promise<Users> {
    return this.userService.findUserById(Number(id))
  }

  async createUser(data: CreateUserDto): Promise<{
    id: number
    nome: string | null
    login: string
    criado_em: Date
    alterado_em: Date
  }> {
    const user = await this.userService.findByFilter({ login: data.login })

    if (user.length > 0) {
      throw new BadRequestException(`User with login ${data.login} already exists.`)
    }

    const hashedPassword = await this.cryptoUseCase.hashPassword(data.senha)

    return this.userService.createUser({ ...data, senha: hashedPassword })
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<Users> {
    const user = await this.userService.findUserById(Number(id))
    if (!user) {
      throw new BadRequestException(`User with ID ${id} does not exist.`)
    }

    if (data.senha) {
      const hashedPassword = await this.cryptoUseCase.hashPassword(data.senha)
      data.senha = hashedPassword
    }

    return this.userService.updateUser(Number(id), data)
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userService.findUserById(Number(id))
    if (!user) {
      throw new BadRequestException(`User with ID ${id} does not exist.`)
    }
    return this.userService.deleteUser(Number(id))
  }
}
