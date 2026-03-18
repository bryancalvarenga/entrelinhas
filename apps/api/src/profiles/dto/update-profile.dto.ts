import { IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string;

  // null é permitido (remover avatar); string deve ser validada como string
  @IsOptional()
  @ValidateIf((o) => o.avatarUrl !== null)
  @IsString()
  @MaxLength(500)
  avatarUrl?: string | null;
}
