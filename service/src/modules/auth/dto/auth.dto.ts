import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class AuthenticationDTO  {
  @ApiProperty({
    type: String,
    required: true,
    description: 'E-mail do usuário',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Senha do usuário',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
