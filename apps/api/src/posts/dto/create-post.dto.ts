import { IsEnum, IsString, MinLength, MaxLength } from 'class-validator';
import { PostIntention } from '@prisma/client';

export class CreatePostDto {
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  content: string;

  @IsEnum(PostIntention)
  intention: PostIntention;
}
