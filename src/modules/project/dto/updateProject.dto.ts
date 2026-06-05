import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateProjectDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: 'Project name should be at least 4 character long',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
