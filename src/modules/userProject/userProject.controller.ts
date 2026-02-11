import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";


@Controller()
export class UserProjectController {

  // получить всех пользователей
  // добавить пользователя
  // заблокировать пользотеля
  // получить данные подключённого пользователя

  @Get()
  @UseGuards(JwtAuthGuard)
  all() {

  }


}