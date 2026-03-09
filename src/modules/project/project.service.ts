import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/db/prisma.service";

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

}