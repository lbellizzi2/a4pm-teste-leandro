import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  MaxLength,
  IsInt,
  IsPositive,
  Min,
} from 'class-validator'
import { Transform } from 'class-transformer'

export class SearchRecipeDto {
  @ApiProperty({ description: 'Text for search recipes', required: false })
  @IsOptional()
  @IsString()
  searchQuery?: string

  @ApiProperty({ description: 'Recipe name', maxLength: 45, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  nome?: string

  @ApiProperty({ description: 'Preparation time in minutes', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  tempo_preparo_minutos?: number

  @ApiProperty({ description: 'Number of portions', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  porcoes?: number

  @ApiProperty({ description: 'Preparation method', required: false })
  @IsOptional()
  @IsString()
  modo_preparo?: string

  @ApiProperty({ description: 'Ingredients', required: false })
  @IsOptional()
  @IsString()
  ingredientes?: string

  @ApiProperty({ description: 'User ID', required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsPositive()
  id_usuarios?: number

  @ApiProperty({ description: 'Category ID', required: false })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsPositive()
  id_categorias?: number

  @ApiProperty({ description: 'Creation date', required: false })
  @IsOptional()
  @IsString()
  criado_em?: string

  @ApiProperty({ description: 'Last update date', required: false })
  @IsOptional()
  @IsString()
  alterado_em?: string

  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @IsPositive()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  page?: number

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  perPage?: number

  @ApiProperty({ description: 'Field to sort by', required: false, default: 'nome' })
  @IsOptional()
  @IsString()
  orderBy?: string = 'nome'

  @ApiProperty({
    description: 'Sort order',
    required: false,
    default: 'asc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'asc'
}
