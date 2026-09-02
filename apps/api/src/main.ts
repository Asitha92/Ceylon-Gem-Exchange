import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  // rawBody is needed to verify the Clerk webhook's Svix signature, which is
  // computed over the exact raw bytes — not the JSON-parsed body.
  const app = await NestFactory.create(AppModule, { rawBody: true })
  const port = process.env.PORT ?? 3000
  await app.listen(port)
}

bootstrap()
