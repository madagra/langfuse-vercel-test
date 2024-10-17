import { Module } from '@nestjs/common';
import { TracesController } from './traces.controller';
import { AppService } from './app.service';
import { DatasetController } from './datasets.controller';

@Module({
  imports: [],
  controllers: [TracesController, DatasetController],
  providers: [AppService],
})
export class AppModule {}
