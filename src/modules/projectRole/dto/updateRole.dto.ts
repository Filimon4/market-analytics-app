import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TreeNode } from 'src/common/utils/treeBuilder/interfaces';

export class TreeDto implements Pick<TreeNode, 'key' | 'disabled' | 'checked'> {
  @IsNotEmpty()
  key: string | number;

  @ValidateNested({ each: true })
  @Type(() => TreeDto)
  children: TreeDto[];

  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  checked: boolean;
}

export class UpdateRoleDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TreeDto)
  tree?: TreeDto[];
}
