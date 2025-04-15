import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsString,
  IsOptional,
  MaxLength,
  IsInt,
  IsPositive,
  Min,
} from 'class-validator'

export class SearchUserDto {
  @ApiProperty({ description: 'User name', maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string

  @ApiProperty({ description: 'User login', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  login?: string

  @ApiProperty({ description: 'User ID', required: false })
  @IsOptional()
  @IsInt()
  id?: number

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
