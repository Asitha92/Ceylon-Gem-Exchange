import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { ClerkAuthGuard, AuthedRequest } from './clerk-auth.guard'
import { Roles } from './roles.decorator'
import { RolesGuard } from './roles.guard'

@Controller('me')
export class MeController {
  @Get()
  @UseGuards(ClerkAuthGuard)
  getMe(@Req() request: AuthedRequest) {
    return { clerkUserId: request.auth.sub }
  }

  @Get('admin-check')
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  getAdminCheck(@Req() request: AuthedRequest) {
    return { clerkUserId: request.auth.sub, ok: true }
  }
}
