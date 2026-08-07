import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonProfileDto } from './create-person-profile.dto';

export class UpdatePersonProfileDto extends PartialType(CreatePersonProfileDto) {}
