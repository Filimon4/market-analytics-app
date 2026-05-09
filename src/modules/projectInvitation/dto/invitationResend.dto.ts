import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { IsBigInt } from 'src/common/utils/classValidator/IsBigInt';

export class InvitationResendDto {
  @IsNotEmpty()
  @Type(() => BigInt)
  @IsBigInt()
  id: number;
}
