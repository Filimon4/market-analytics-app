import { IsNotEmpty, IsString, IsEmail, IsNumber } from "class-validator";

export class GenerateTokensDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  id: string;
}