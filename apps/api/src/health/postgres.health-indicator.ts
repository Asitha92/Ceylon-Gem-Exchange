import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { HealthIndicatorService } from '@nestjs/terminus'
import { Pool } from 'pg'

@Injectable()
export class PostgresHealthIndicator implements OnModuleDestroy {
  private readonly pool = new Pool({
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER ?? 'ceylon_gems',
    password: process.env.POSTGRES_PASSWORD ?? 'ceylon_gems_dev',
    database: process.env.POSTGRES_DB ?? 'ceylon_gems',
    max: 1,
  })

  constructor(private readonly healthIndicatorService: HealthIndicatorService) {}

  check() {
    return this.healthIndicatorService
      .check('postgres')
      .attempt(async () => {
        await this.pool.query('SELECT 1')
      })
      .withTimeout(2000)
  }

  onModuleDestroy() {
    void this.pool.end()
  }
}
