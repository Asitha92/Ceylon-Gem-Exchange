import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// This module is reached via a static import chain (webhook controller ->
// db/client) that gets evaluated before Nest's ConfigModule.forRoot() runs
// (which only fires once app.module.ts's own decorator body executes) — so
// process.env can't be relied on here without loading it ourselves. In
// staging/prod this is a harmless no-op since there's no .env file and the
// real env vars are already set by the platform.
config({ path: '../../.env' })

export const pool = new Pool({
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  user: process.env.POSTGRES_USER ?? 'ceylon_gems',
  password: process.env.POSTGRES_PASSWORD ?? 'ceylon_gems_dev',
  database: process.env.POSTGRES_DB ?? 'ceylon_gems',
})

export const db = drizzle(pool, { schema })
