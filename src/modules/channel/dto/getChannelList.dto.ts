import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetChannelListDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return false;
    if (value === true || value === 'true' || value === '1') return true;

    return false;
  })
  @IsBoolean()
  deleted?: boolean = false;
}
