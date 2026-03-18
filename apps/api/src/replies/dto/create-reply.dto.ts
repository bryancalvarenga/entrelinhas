import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  content: string;
}
