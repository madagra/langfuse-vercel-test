import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { callModelStream, callModelText } from './model';

@Controller('traces')
export class TracesController {
  constructor(private readonly appService: AppService) {}

  @Get('single')
  async singleTracing(@Query() query): Promise<string> {
    const userId = query.userId || undefined;
    const traceName = query.traceName || undefined;
    const tag = query.tag || undefined;

    const tags = ['bulk'];
    if (tag !== undefined) {
      tags.push(tag);
    }

    const answer = await callModelText(undefined, traceName, tags, userId);
    return this.appService.displayText(answer);
  }

  @Get('stream')
  async singleTracingStream(@Query() query): Promise<string> {
    const userId = query.userId || undefined;
    const traceName = query.traceName || undefined;
    const tag = query.tag || undefined;

    const tags = ['stream'];
    if (tag !== undefined) {
      tags.push(tag);
    }

    const answer = await callModelStream(undefined, traceName, tags, userId);
    return this.appService.displayText(answer);
  }

  @Get('multi')
  async multiTracing(@Query() query): Promise<string> {
    let answer = '';

    const nTraces = query.nTraces || 2;
    const userId = query.userId || undefined;
    const traceName = query.traceName || undefined;
    const tag = query.tag || undefined;
    const sessionId = query.sessionId || undefined;

    const tags = ['stream'];
    if (tag !== undefined) {
      tags.push(tag);
    }

    // group 1
    for (let i = 0; i < nTraces; i++) {
      const result = await callModelText(
        undefined,
        traceName,
        tags,
        userId,
        sessionId,
      );
      answer += '\n' + result;
    }
    answer += '\n \n \n';

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // group 2
    for (let i = 0; i < nTraces; i++) {
      const result = await callModelText(
        'What is love? Use only a single sentence.',
        traceName,
        tags,
        userId,
        sessionId,
      );
      answer += '\n' + result;
    }

    return this.appService.displayText(answer);
  }

  @Get('evaluate')
  async evaluate(): Promise<string> {
    const answer = await callModelStream();
    console.log(answer);
    return this.appService.displayText('Evaluation is done');
  }
}
