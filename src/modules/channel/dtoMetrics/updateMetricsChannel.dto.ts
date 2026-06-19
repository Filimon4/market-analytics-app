import { IsArray, IsNotEmpty } from 'class-validator';
import { CreateMetricsChannelDto } from './createMetricsChannel.dto';
import { PartialType } from '@nestjs/swagger';
import { FormulaPaletteItem } from '@src/shared/formula/formula.helpers';

export class UpdateMetricsChannelDto extends PartialType(CreateMetricsChannelDto) {
  @IsNotEmpty()
  @IsArray()
  formula: FormulaPaletteItem[];
}
