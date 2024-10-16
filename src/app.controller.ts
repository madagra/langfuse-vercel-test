import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { callModelStream, callModelText } from './model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('single_tracing')
  async singleTracing(@Query() query): Promise<string> {

    const userId = query.userId || undefined;
    const traceName = query.traceName || undefined
    const tag = query.tag || undefined;
    
    const tags = ['bulk'];
    if (tag !== undefined) {
      tags.push(tag);
    }
    
    const answer = await callModelText(undefined, traceName, tags, userId);
    return this.appService.displayText(answer);
  }

  @Get('single_tracing_stream')
  async singleTracingStream(@Query() query): Promise<string> {

    const userId = query.userId || undefined;
    const traceName = query.traceName || undefined
    const tag = query.tag || undefined;
    
    const tags = ['stream'];
    if (tag !== undefined) {
      tags.push(tag);
    }
    
    const answer = await callModelStream(undefined, traceName, tags, userId);
    return this.appService.displayText(answer);
  }

  @Get('multi_tracing')
  async multiTracing(@Query() query): Promise<string> {
    let answer = '';

    const nReps = query.nTraces || 5;
    const userId = query.userId || undefined;
    const traceName = query.traceName || undefined
    const tag = query.tag || undefined;

    const tags = ['stream'];
    if (tag !== undefined) {
      tags.push(tag);
    }
    
    for (let i = 0; i < nReps; i++) {
      const result = await callModelText(undefined, traceName, tags, userId);
      answer += '\n' + result;
    }
    return this.appService.displayText(answer);
  }

  @Get('evaluate')
  async evaluate(): Promise<string> {
    const answer = await callModelStream();
    return this.appService.displayText('Evaluation is done');
  }

}
