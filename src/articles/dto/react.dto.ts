import { IsEnum, IsOptional } from 'class-validator';
import { ReactionType } from '@prisma/client';

/**
 * "Habere Tepki Ver" isteği. `previous` tarayıcının daha önce verdiği
 * tepki — değiştirmede eski sayaç azaltılır (bkz. articles.service.react).
 */
export class ReactDto {
  @IsEnum(ReactionType)
  type: ReactionType;

  @IsOptional()
  @IsEnum(ReactionType)
  previous?: ReactionType;
}

export class UnreactDto {
  @IsEnum(ReactionType)
  type: ReactionType;
}
