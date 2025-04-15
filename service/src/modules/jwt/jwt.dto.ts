import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { Transform } from 'class-transformer'



export class JwtTokenDTO {
  @ApiProperty({
    description: 'Id do usuário',
  })
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : value))
  id: number

  @ApiProperty({
    description: 'Token JWT de autenticação',
    example: '<KEY>',
  })
  @IsString()
  access_token: string

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'example@domain.com',
  })
  @IsString()
  login: string
}
