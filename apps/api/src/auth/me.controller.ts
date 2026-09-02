import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { ClerkAuthGuard, AuthedRequest } from './clerk-auth.guard'

@Controller('me')
export class MeController {
  @Get()
  @UseGuards(ClerkAuthGuard)
  getMe(@Req() request: AuthedRequest) {
    return { clerkUserId: request.auth.sub }
  }
}
