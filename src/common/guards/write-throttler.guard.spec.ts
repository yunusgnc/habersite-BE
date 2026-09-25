import { ExecutionContext } from '@nestjs/common';
import { WriteThrottlerGuard } from './write-throttler.guard';

class TestableWriteThrottlerGuard extends WriteThrottlerGuard {
  public isSkipped(context: ExecutionContext) {
    return this.shouldSkip(context);
  }
}

function httpContext(method: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ method }),
    }),
  } as ExecutionContext;
}

describe('WriteThrottlerGuard', () => {
  const guard = new TestableWriteThrottlerGuard(
    [] as never,
    {} as never,
    {} as never,
  );

  it.each(['GET', 'HEAD', 'OPTIONS', 'get'])(
    '%s okuma isteğini ortak hız kotasından çıkarır',
    async (method) => {
      await expect(guard.isSkipped(httpContext(method))).resolves.toBe(true);
    },
  );

  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])(
    '%s yazma isteğinde hız sınırını çalıştırır',
    async (method) => {
      await expect(guard.isSkipped(httpContext(method))).resolves.toBe(false);
    },
  );
});
