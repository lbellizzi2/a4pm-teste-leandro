import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../commons/database/database.module'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { CategoryUseCase } from './category.usecase'

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryUseCase],
})
export class CategoryModule {}
