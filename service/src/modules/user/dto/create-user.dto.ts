import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ description: 'User name', maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string

  @ApiProperty({ description: 'User login', maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  login: string

  @ApiProperty({ description: 'User password', maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  senha: string
}
