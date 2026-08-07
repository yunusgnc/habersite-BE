import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = ctx.switchToHttp().getRequest();
    if (!user?.role) return false;

    // Role hierarchy — higher roles satisfy lower role requirements.
    //   SUPER_ADMIN > ADMIN > EDITOR > REPORTER > COLUMNIST
    // e.g. an endpoint decorated @Roles('EDITOR') accepts ADMIN + EDITOR.
    const HIERARCHY: Record<string, number> = {
      SUPER_ADMIN: 100,
      ADMIN: 80,
      EDITOR: 60,
      REPORTER: 40,
      COLUMNIST: 20,
    };
    const userLevel = HIERARCHY[user.role] ?? 0;
    const minRequired = Math.min(
      ...requiredRoles.map((r) => HIERARCHY[r] ?? 0),
    );
    return userLevel >= minRequired;
  }
}
