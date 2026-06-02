import { Body, Controller, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '@src/shared/tenant/guards/tenant.guard';
import { CurrentTenant } from '@src/shared/tenant/decorators/current-tenant.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ProjectUserService } from './projectUser.service';

@Controller({ path: 'project/user', version: '1' })
@UseGuards(JwtAuthGuard, TenantGuard)
export class ProjectUserController {
  constructor(protected readonly projectUserService: ProjectUserService) {}

  @Patch()
  @HttpCode(HttpStatus.OK)
  async updateUser(@CurrentTenant() projectId: number, @Body() dto: UpdateUserDto) {
    const updatedUser = await this.projectUserService.updateUser(projectId, dto);

    return { result: updatedUser };
  }
}
