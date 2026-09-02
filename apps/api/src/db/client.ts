import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

export const pool = new Pool({
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  user: process.env.POSTGRES_USER ?? 'ceylon_gems',
  password: process.env.POSTGRES_PASSWORD ?? 'ceylon_gems_dev',
  database: process.env.POSTGRES_DB ?? 'ceylon_gems',
})

export const db = drizzle(pool, { schema })
