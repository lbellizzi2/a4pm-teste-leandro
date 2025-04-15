import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthenticationDTO } from './dto/auth.dto';
import { AuthUseCase } from './auth.usecase';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtTokenDTO } from '../jwt/jwt.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Autentication')
@ApiInternalServerErrorResponse({
  description: 'Sorry we are experiencing technical problems',
})
@Controller('auth')
export class AuthController {
  constructor(private authUseCase: AuthUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Efetua a autenticação do usuário com email e senha',
  })
  @ApiCreatedResponse({
    description: 'Login efetuado com sucesso',
    type: JwtTokenDTO,
  })
  @UseGuards(ThrottlerGuard)
  async userAuth(@Body() data: AuthenticationDTO): Promise<JwtTokenDTO> {
    return this.authUseCase.authenticate(data);
  }
}
