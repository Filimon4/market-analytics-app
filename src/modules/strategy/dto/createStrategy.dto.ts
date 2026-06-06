import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateStrategyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  description: string;
}
