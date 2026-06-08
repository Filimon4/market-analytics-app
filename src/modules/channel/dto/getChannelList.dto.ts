import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { toBoolean } from 'src/common/utils/transformers/to-boolean.transformer';

export class GetChannelListDto {
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  deleted?: boolean = false;
}
