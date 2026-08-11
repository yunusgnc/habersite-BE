import { PartialType } from '@nestjs/mapped-types';
import { CreateOfficialNoticeDto } from './create-official-notice.dto';

export class UpdateOfficialNoticeDto extends PartialType(CreateOfficialNoticeDto) {}
