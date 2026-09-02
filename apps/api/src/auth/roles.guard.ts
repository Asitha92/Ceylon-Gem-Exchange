import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { users } from '../db/schema'
import type { AuthedRequest } from './clerk-auth.guard'
import { ROLES_KEY, type Role } from './roles.decorator'

// Roles live in our own users table, not in Clerk — this must run after
// ClerkAuthGuard (via @UseGuards(ClerkAuthGuard, RolesGuard)) so request.auth
// is already populated.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles?.length) {
      return true
    }

    const request = context.switchToHttp().getRequest<AuthedRequest>()
    if (!request.auth) {
      throw new UnauthorizedException('RolesGuard must run after ClerkAuthGuard')
    }

    const [row] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.clerkId, request.auth.sub))
      .limit(1)

    if (!row || !requiredRoles.includes(row.role)) {
      throw new ForbiddenException('Insufficient role')
    }

    return true
  }
}
