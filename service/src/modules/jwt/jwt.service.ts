import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtTokenDTO } from './jwt.dto'
import { TokenExpiredError } from 'jsonwebtoken'

@Injectable()
export class JwtAuthService {
  private secret: string = this.configService.get<string>('SECRET_KEY')

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public async generateAuthToken(data: JwtTokenDTO): Promise<JwtTokenDTO> {
    const token = await this.jwtService.sign(data, { secret: this.secret })

    const session: JwtTokenDTO = {
      id: data?.id,
      access_token: token,
      login: data?.login,
    }

    return session
  }

  public async decodeAuthToken(token: string): Promise<JwtTokenDTO> {
    try {
      const decodedToken = await this.jwtService.verifyAsync<JwtTokenDTO>(token, {
        ignoreExpiration: false,
        secret: this.secret,
      })
      return decodedToken
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          `Token expirado. Realize novo login para continuar`,
        )
      }
      return null
    }
  }
}
