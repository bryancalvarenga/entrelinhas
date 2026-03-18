import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsArray,
  ArrayMinSize,
  IsEnum,
  Matches,
} from 'class-validator';
import { Interest, OnboardingIntention } from '@prisma/client';

export class OnboardingDto {
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9_]+$/, {
    message: 'username deve conter apenas letras minúsculas, números e _',
  })
  username: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(Interest, { each: true })
  interests: Interest[];

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(OnboardingIntention, { each: true })
  intentions: OnboardingIntention[];
}
