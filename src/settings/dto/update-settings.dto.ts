import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateSettingDto {
  @IsNotEmpty()
  value: any;
}

export class BulkUpdateSettingsDto {
  @IsObject()
  @IsNotEmpty()
  settings: Record<string, any>;
}
