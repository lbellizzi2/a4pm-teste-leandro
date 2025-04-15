import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsInt,
  IsPositive,
} from 'class-validator'

export class CreateRecipeDto {
  @ApiProperty({ description: 'Recipe name', maxLength: 45, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  nome?: string

  @ApiProperty({
    description: 'Preparation time in minutes',
    required: false,
    example: 30,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => (value ? parseInt(value, 10) : null))
  tempo_preparo_minutos?: number

  @ApiProperty({ description: 'Number of portions', required: false, example: 4 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => (value ? parseInt(value, 10) : null))
  porcoes?: number

  @ApiProperty({ description: 'Preparation method', required: true })
  @IsNotEmpty()
  @IsString()
  modo_preparo: string

  @ApiProperty({ description: 'Ingredients', required: false })
  @IsOptional()
  @IsString()
  ingredientes?: string

  @ApiProperty({
    description: 'User ID who created the recipe',
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : null))
  id_usuarios: number

  @ApiProperty({
    description: 'Category ID of the recipe',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : null))
  id_categorias?: number
}
