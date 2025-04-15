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
import { RecipeUseCase } from './recipe.usecase'
import { CreateRecipeDto, SearchRecipeDto, UpdateRecipeDto } from './dto'

@ApiTags('Recipes')
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeUseCase: RecipeUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all recipes' })
  @ApiResponse({ status: 200, description: 'Recipes retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAllRecipes(@Query() filter: SearchRecipeDto) {
    return this.recipeUseCase.findByFilter(filter)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a recipe by ID' })
  @ApiResponse({ status: 200, description: 'Recipe retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getRecipeById(@Param('id') id: string) {
    return this.recipeUseCase.getRecipeById(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiResponse({ status: 201, description: 'Recipe created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createRecipe(@Body() data: CreateRecipeDto) {
    return this.recipeUseCase.createRecipe(data)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a recipe by ID' })
  @ApiResponse({ status: 200, description: 'Recipe updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data or recipe ID.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateRecipe(@Param('id') id: string, @Body() data: UpdateRecipeDto) {
    return this.recipeUseCase.updateRecipe(id, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recipe by ID' })
  @ApiResponse({ status: 200, description: 'Recipe deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid recipe ID.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async deleteRecipe(@Param('id') id: string) {
    return this.recipeUseCase.deleteRecipe(id)
  }
}
