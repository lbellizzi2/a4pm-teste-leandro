import { BadRequestException, Injectable } from '@nestjs/common'
import { RecipeService } from './recipe.service'
import { CreateRecipeDto, SearchRecipeDto, UpdateRecipeDto } from './dto'

@Injectable()
export class RecipeUseCase {
  constructor(private readonly recipeService: RecipeService) {}

  async findByFilter(filter: SearchRecipeDto): Promise<any[]> {
    return this.recipeService.findByFilter(filter)
  }

  async getRecipeById(id: string): Promise<any> {
    return this.recipeService.findRecipeById(Number(id))
  }

  async createRecipe(data: CreateRecipeDto): Promise<any> {
    return this.recipeService.createRecipe({ ...data })
  }

  async updateRecipe(id: string, data: UpdateRecipeDto): Promise<any> {
    const recipe = await this.recipeService.findRecipeById(Number(id))
    if (!recipe) {
      throw new BadRequestException(`Recipe with ID ${id} does not exist.`)
    }

    return this.recipeService.updateRecipe(Number(id), data)
  }

  async deleteRecipe(id: string): Promise<void> {
    const recipe = await this.recipeService.findRecipeById(Number(id))
    if (!recipe) {
      throw new BadRequestException(`Recipe with ID ${id} does not exist.`)
    }
    return this.recipeService.deleteRecipe(Number(id))
  }
}
