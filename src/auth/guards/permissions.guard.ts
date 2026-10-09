import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { hasPermission, type UserPermission } from '../permissions';

export const PERMISSIONS_KEY = 'user-permissions';
export const RequirePermissions = (...permissions: UserPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<UserPermission[]>(
      PERMISSIONS_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!required?.length) return true;

    const request = ctx.switchToHttp().getRequest();
    const authUser = request.user;
    if (!authUser?.userId || !authUser?.tenantId) return false;

    // DB'den okunur: Adminin yaptığı değişiklik yeni oturum açmayı beklemeden
    // sonraki istekte yürürlüğe girer. Pasif hesap da eski tokenla devam edemez.
    const user = await this.prisma.user.findFirst({
      where: {
        id: authUser.userId,
        tenantId: authUser.tenantId,
        active: true,
      },
      select: { role: true, permissions: true },
    });
    if (!user) return false;

    const allowed = required.every((permission) =>
      hasPermission(user.role, user.permissions, permission),
    );
    if (!allowed) {
      throw new ForbiddenException('Bu işlem için yetkiniz bulunmuyor');
    }
    return true;
  }
}
