import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateWellbeingDto {
  @IsOptional()
  @IsBoolean()
  reducedNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  hideInteractions?: boolean;

  @IsOptional()
  @IsBoolean()
  limitedFeed?: boolean;

  @IsOptional()
  @IsBoolean()
  silentMode?: boolean;

  @IsOptional()
  @IsBoolean()
  darkMode?: boolean;
}
