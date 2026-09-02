import { BadRequestException, Controller, Post, Req } from '@nestjs/common'
import type { RawBodyRequest } from '@nestjs/common'
import type { Request } from 'express'
import { Webhook, WebhookVerificationError } from 'svix'
import type { UserJSON, WebhookEvent } from '@clerk/backend'
import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { users, userLocale } from '../db/schema'

@Controller('webhooks/clerk')
export class ClerkWebhookController {
  @Post()
  async handle(@Req() request: RawBodyRequest<Request>) {
    const event = this.verify(request)

    switch (event.type) {
      case 'user.created':
      case 'user.updated':
        await this.upsertUser(event.data)
        break
      case 'user.deleted':
        if (event.data.id) {
          await db.delete(users).where(eq(users.clerkId, event.data.id))
        }
        break
      default:
        break
    }

    return { received: true }
  }

  private verify(request: RawBodyRequest<Request>): WebhookEvent {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET
    if (!signingSecret) {
      throw new BadRequestException('CLERK_WEBHOOK_SIGNING_SECRET is not set')
    }
    if (!request.rawBody) {
      throw new BadRequestException('Missing raw body — is rawBody enabled in main.ts?')
    }

    const headers = {
      'svix-id': request.headers['svix-id'],
      'svix-timestamp': request.headers['svix-timestamp'],
      'svix-signature': request.headers['svix-signature'],
    }

    try {
      new Webhook(signingSecret).verify(request.rawBody, headers as Record<string, string>)
    } catch (error) {
      if (error instanceof WebhookVerificationError) {
        throw new BadRequestException('Invalid webhook signature')
      }
      throw error
    }

    return request.body as WebhookEvent
  }

  private async upsertUser(data: UserJSON) {
    const email = data.email_addresses.find((e) => e.id === data.primary_email_address_id)
    const phoneEntry = data.phone_numbers.find((p) => p.id === data.primary_phone_number_id)
    const displayName = [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username

    await db
      .insert(users)
      .values({
        clerkId: data.id,
        email: email?.email_address ?? null,
        phone: phoneEntry?.phone_number ?? null,
        phoneVerifiedAt: phoneEntry?.verification?.status === 'verified' ? new Date() : null,
        displayName: displayName || null,
        locale: normalizeLocale(data.locale),
      })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: {
          email: email?.email_address ?? null,
          phone: phoneEntry?.phone_number ?? null,
          phoneVerifiedAt: phoneEntry?.verification?.status === 'verified' ? new Date() : null,
          displayName: displayName || null,
          locale: normalizeLocale(data.locale),
          updatedAt: new Date(),
        },
      })
  }
}

function normalizeLocale(locale: string | null): (typeof userLocale.enumValues)[number] {
  if (locale?.startsWith('si')) return 'si'
  if (locale?.startsWith('ta')) return 'ta'
  return 'en'
}
