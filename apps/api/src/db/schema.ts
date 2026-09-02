import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const userRole = pgEnum('user_role', ['user', 'admin', 'moderator'])
export const userLocale = pgEnum('user_locale', ['en', 'si', 'ta'])
export const userStatus = pgEnum('user_status', ['active', 'suspended'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email'),
  phone: text('phone'),
  phoneVerifiedAt: timestamp('phone_verified_at', { withTimezone: true }),
  displayName: text('display_name'),
  role: userRole('role').notNull().default('user'),
  locale: userLocale('locale').notNull().default('en'),
  status: userStatus('status').notNull().default('active'),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
