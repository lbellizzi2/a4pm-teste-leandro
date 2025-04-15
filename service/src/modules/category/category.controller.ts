import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { CategoryUseCase } from './category.usecase'
import { CreateCategoryDto, SearchCategoryDto, UpdateCategoryDto } from './dto'

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryUseCase: CategoryUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllCategories(@Query() filter: SearchCategoryDto) {
    return this.categoryUseCase.findByFilter(filter)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getCategoryById(@Param('id') id: string) {
    return this.categoryUseCase.getCategoryById(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createCategory(@Body() data: CreateCategoryDto) {
    return this.categoryUseCase.createCategory(data)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data or category ID.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateCategory(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.categoryUseCase.updateCategory(id, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid category ID.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteCategory(@Param('id') id: string) {
    return this.categoryUseCase.deleteCategory(id)
  }
}
