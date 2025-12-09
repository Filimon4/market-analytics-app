import { PartialType } from '@nestjs/mapped-types';
import { CreateStrategyDto } from './createStrategy.dto';

export class UpdateStrategyDto extends PartialType(CreateStrategyDto) {}
