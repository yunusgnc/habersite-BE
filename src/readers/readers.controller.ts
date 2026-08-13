import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ReadersService } from './readers.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { ReaderJwtGuard } from './reader-jwt.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import {
  LoginReaderDto,
  RegisterReaderDto,
  UpdateReaderDto,
} from './dto/reader.dto';

@Controller('api/readers')
@UseGuards(TenantGuard)
export class ReadersController {
  constructor(private readonly service: ReadersService) {}

  // ─── Auth ────────────────────────────────────────────────

  @Post('register')
  // Bot yağmurunu engelle — dakikada 5 kayıt.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  register(
    @CurrentTenant() tenantId: string,
    @Body() dto: RegisterReaderDto,
  ) {
    return this.service.register(tenantId, dto);
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  login(@CurrentTenant() tenantId: string, @Body() dto: LoginReaderDto) {
    return this.service.login(tenantId, dto);
  }

  @Get('me')
  @UseGuards(ReaderJwtGuard)
  me(@CurrentUser() user: { readerId: string }) {
    return this.service.me(user.readerId);
  }

  @Patch('me')
  @UseGuards(ReaderJwtGuard)
  updateMe(
    @CurrentUser() user: { readerId: string },
    @Body() dto: UpdateReaderDto,
  ) {
    return this.service.updateMe(user.readerId, dto);
  }

  // ─── Bookmark ────────────────────────────────────────────

  @Get('bookmarks')
  @UseGuards(ReaderJwtGuard)
  listBookmarks(
    @CurrentUser() user: { readerId: string; tenantId: string },
  ) {
    return this.service.listBookmarks(user.readerId, user.tenantId);
  }

  @Post('bookmarks')
  @UseGuards(ReaderJwtGuard)
  addBookmark(
    @CurrentUser() user: { readerId: string; tenantId: string },
    @Body() body: { articleId: string },
  ) {
    return this.service.addBookmark(
      user.readerId,
      user.tenantId,
      body.articleId,
    );
  }

  @Delete('bookmarks/:articleId')
  @UseGuards(ReaderJwtGuard)
  removeBookmark(
    @CurrentUser() user: { readerId: string },
    @Param('articleId') articleId: string,
  ) {
    return this.service.removeBookmark(user.readerId, articleId);
  }

  @Get('bookmarks/check')
  @UseGuards(ReaderJwtGuard)
  check(
    @CurrentUser() user: { readerId: string },
    @Query('articleId') articleId: string,
  ) {
    return this.service.isBookmarked(user.readerId, articleId);
  }
}
