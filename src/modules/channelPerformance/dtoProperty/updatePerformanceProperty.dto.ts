import { IsNotEmpty } from 'class-validator';

export class UpdatePerformancePropertyDto {
  @IsNotEmpty()
  value: string;
}
