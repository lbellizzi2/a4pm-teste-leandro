import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../commons/database/database.module'
import { RecipeController } from './recipe.controller'
import { RecipeService } from './recipe.service'
import { RecipeUseCase } from './recipe.usecase'

@Module({
  imports: [DatabaseModule],
  controllers: [RecipeController],
  providers: [RecipeService, RecipeUseCase],
})
export class RecipeModule {}
