import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthenticationDTO } from './dto/auth.dto'
import { CryptoUseCase } from '../crypto/crypto.usecase'
import { JwtAuthService } from '../jwt/jwt.service'
import { JwtTokenDTO } from '../jwt/jwt.dto'
import { UserUseCase } from '../user/user.usecase'

@Injectable()
export class AuthUseCase {
  constructor(
    private userUseCase: UserUseCase,
    private cryptoUsecase: CryptoUseCase,
    private jwtService: JwtAuthService,
  ) {}

  async authenticate(data: AuthenticationDTO): Promise<JwtTokenDTO> {
    const user = await this.userUseCase.findByFilter({ login: data.login }, true)

    if (user.length === 0)
      throw new UnauthorizedException(`User ${data.login} was not found`)

    const isValid = await this.verifyPassword(data.password, user[0].senha)

    if (!isValid)
      throw new UnauthorizedException(`Invalid password for user ${data.login}`)

    const jwt = await this.jwtService.generateAuthToken({
      id: user[0].id,
      login: user[0].login,
      access_token: null,
    })

    return { access_token: jwt.access_token, id: user[0].id, login: user[0].login }
  }

  verifyPassword(password: string, hash: string): Promise<boolean> {
    return this.cryptoUsecase.comparePasswords(password, hash)
  }
}
