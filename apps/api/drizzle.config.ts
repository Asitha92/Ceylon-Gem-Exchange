import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// drizzle-kit runs standalone (outside Nest's ConfigModule), so it needs its
// own load of the root .env shared with docker-compose.yml.
config({ path: '../../.env' })

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER ?? 'ceylon_gems',
    password: process.env.POSTGRES_PASSWORD ?? 'ceylon_gems_dev',
    database: process.env.POSTGRES_DB ?? 'ceylon_gems',
    ssl: false,
  },
})
