import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class AddPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permissionIds: number[];
}
