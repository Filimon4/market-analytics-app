import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetChannelSourceListDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return false;
    if (value === true || value === 'true' || value === '1') return true;

    return false;
  })
  @IsBoolean()
  includeDeleted?: boolean = false;
}
