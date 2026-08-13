import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ReaderJwtGuard extends AuthGuard('reader-jwt') {}
