import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './createChannel.dto.js';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
