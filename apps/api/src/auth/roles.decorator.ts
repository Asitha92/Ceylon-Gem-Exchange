import { SetMetadata } from '@nestjs/common'
import type { userRole } from '../db/schema'

export type Role = (typeof userRole.enumValues)[number]

export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
