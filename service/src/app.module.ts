import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './commons/database/database.module'
import LoggerRequestMiddleware from './system/middlewares/logger.middleware'
import { JwtAuthorizationRequestMiddleware } from './system/middlewares/authorization.middleware'
import { UserModule } from './modules/user/user.module'
import { CryptoModule } from './modules/crypto/crypto.module'
import { AuthModule } from './modules/auth/auth.module'
import { RecipeModule } from './modules/recipe/recipe.module'
import { CategoryModule } from './modules/category/category.module'
import { JwtServiceModule } from './modules/jwt/jwt.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    JwtServiceModule,
    DatabaseModule,
    UserModule,
    CryptoModule,
    AuthModule,
    RecipeModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthorizationRequestMiddleware)
      .exclude(
        { path: 'api-json', method: RequestMethod.GET },
        { path: 'api', method: RequestMethod.GET },
        { path: 'health', method: RequestMethod.GET },
        { path: 'auth', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.POST },
        { path: 'categories', method: RequestMethod.GET },
        { path: 'recipes', method: RequestMethod.GET },
        { path: 'recipes/:id', method: RequestMethod.GET },
      )
      .forRoutes('*')

    consumer
      .apply(LoggerRequestMiddleware)
      .exclude(
        { path: 'api-json', method: RequestMethod.GET },
        { path: 'api', method: RequestMethod.GET },
      )
      .forRoutes('*')
  }
}
