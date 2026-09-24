import { PartialType } from '@nestjs/mapped-types';
import { CreateCartoonDto } from './create-cartoon.dto';

export class UpdateCartoonDto extends PartialType(CreateCartoonDto) {}
