import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { HealthIndicatorService } from '@nestjs/terminus'
import Redis from 'ioredis'

@Injectable()
export class RedisHealthIndicator implements OnModuleDestroy {
  private readonly client = new Redis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  })

  constructor(private readonly healthIndicatorService: HealthIndicatorService) {}

  check() {
    return this.healthIndicatorService
      .check('redis')
      .attempt(async () => {
        await this.client.ping()
      })
      .withTimeout(2000)
  }

  onModuleDestroy() {
    this.client.disconnect()
  }
}
