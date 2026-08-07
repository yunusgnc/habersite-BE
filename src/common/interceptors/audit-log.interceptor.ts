import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest();
    const method = request.method?.toUpperCase();

    if (!WRITE_METHODS.has(method)) {
      return next.handle();
    }

    const tenantId = request.tenant?.id;
    const userId = request.user?.id;
    const entity = ctx.getClass().name;
    const action = method;

    return next.handle().pipe(
      tap(async () => {
        try {
          await this.prisma.auditLog.create({
            data: {
              tenantId,
              userId,
              action,
              entity,
              entityId: request.params?.id ?? null,
              changes: request.body ? JSON.parse(JSON.stringify(request.body)) : null,
              ipAddress: request.ip ?? null,
            },
          });
        } catch {
          // Audit log failure should not break the request
        }
      }),
    );
  }
}
