import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { ReadersService } from './readers.service';
import { ReadersController } from './readers.controller';
import { ReaderJwtStrategy } from './reader-jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'changeme'),
        // Default; issueToken içinde 30d override edilir.
        signOptions: { expiresIn: '30d' },
      }),
    }),
  ],
  controllers: [ReadersController],
  providers: [ReadersService, ReaderJwtStrategy],
})
export class ReadersModule {}
