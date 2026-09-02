import { Module } from '@nestjs/common'
import { ClerkAuthGuard } from './clerk-auth.guard'
import { MeController } from './me.controller'

@Module({
  controllers: [MeController],
  providers: [ClerkAuthGuard],
  exports: [ClerkAuthGuard],
})
export class AuthModule {}
