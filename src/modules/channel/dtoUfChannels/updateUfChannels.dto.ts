import { PartialType } from '@nestjs/mapped-types';
import { CreateUfChannelsDto } from './createUfChannels.dto';

export class UpdateUfChannelsDto extends PartialType(CreateUfChannelsDto) {}
