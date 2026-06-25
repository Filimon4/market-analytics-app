import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { toBoolean } from 'src/common/utils/transformers/to-boolean.transformer';

export class GetChannelListDto {
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  deleted?: boolean = false;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  strategyId?: number;
}
