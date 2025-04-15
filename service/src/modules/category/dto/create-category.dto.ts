import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, MaxLength } from 'class-validator'

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', maxLength: 100, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string
}
