import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getStatus() {
    return {
      service: 'ceylon-gems-api',
      status: 'ok',
    }
  }
}
