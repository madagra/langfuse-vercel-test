import { sdk } from './exporter';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runCustomEvaluation } from './evaluation';

async function bootstrap() {
  // try out
  await runCustomEvaluation();

  // start the NestJS app
  const app = await NestFactory.create(AppModule);

  // start the node for Opentelemetry
  await sdk.start();

  await app.listen(3000);
}
bootstrap();
