import { Module } from '@nestjs/common'
import { ClerkAuthGuard } from './clerk-auth.guard'
import { MeController } from './me.controller'
import { RolesGuard } from './roles.guard'

@Module({
  controllers: [MeController],
  providers: [ClerkAuthGuard, RolesGuard],
  exports: [ClerkAuthGuard, RolesGuard],
})
export class AuthModule {}
