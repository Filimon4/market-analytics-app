import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class InvitationSendDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform((params) => (params.value as string).trim())
  email: string;
}
