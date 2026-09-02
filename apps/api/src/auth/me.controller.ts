import { BadRequestException, Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common'
import { ClerkAuthGuard, AuthedRequest } from './clerk-auth.guard'
import { Roles } from './roles.decorator'
import { RolesGuard } from './roles.guard'
import { db } from '../db/client'
import { users, userLocale } from '../db/schema'

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

  // Lets the client push a detected/chosen locale before the webhook has
  // necessarily synced the user row yet — upserts rather than assuming the
  // row already exists.
  @Patch()
  @UseGuards(ClerkAuthGuard)
  async updateMe(@Req() request: AuthedRequest, @Body() body: { locale?: string }) {
    if (body.locale === undefined) {
      return { updated: false }
    }

    if (!userLocale.enumValues.includes(body.locale as (typeof userLocale.enumValues)[number])) {
      throw new BadRequestException(`locale must be one of: ${userLocale.enumValues.join(', ')}`)
    }
    const locale = body.locale as (typeof userLocale.enumValues)[number]

    await db
      .insert(users)
      .values({ clerkId: request.auth.sub, locale })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: { locale, updatedAt: new Date() },
      })

    return { updated: true }
  }
}
