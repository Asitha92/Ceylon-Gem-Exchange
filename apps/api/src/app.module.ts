import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    // Shared with docker-compose.yml at the monorepo root — one source of
    // truth for local dev credentials.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    HealthModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
