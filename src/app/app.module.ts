import { Module } from '@nestjs/common';
import { DbModule } from 'src/common/db/db.module';

@Module({
  imports: [DbModule],
})
export class AppModule {}
