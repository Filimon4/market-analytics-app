import { IsArray, IsNotEmpty } from 'class-validator';
import { CreateMetricsChannelDto } from './createMetricsChannel.dto';
import { PartialType } from '@nestjs/swagger';
import { FormulaPaletteItem } from '@src/shared/formula/formula.helpers';
import { IsValidFormula } from '@src/common/utils/classValidator/IsValidFormula';

export class UpdateMetricsChannelDto extends PartialType(CreateMetricsChannelDto) {
  @IsNotEmpty()
  @IsArray()
  @IsValidFormula()
  formula: FormulaPaletteItem[];
}
