import { Module } from '@nestjs/common';
import { AuthorCategoriesController } from './author-categories.controller';
import { AuthorCategoriesService } from './author-categories.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthorCategoriesController],
  providers: [AuthorCategoriesService],
  exports: [AuthorCategoriesService],
})
export class AuthorCategoriesModule {}
