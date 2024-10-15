import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { callModelStream, callModelText } from './model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('answer')
  async getAnswer(): Promise<string> {
    const answer = await callModelText();
    return this.appService.displayText(answer);
  }

  @Get('stream')
  async getAnswerStream(): Promise<string> {
    const answer = await callModelStream();
    return this.appService.displayText(answer);
  }

  @Get('loop')
  async loopAnswer(): Promise<string> {
    let answer = '';
    const nReps = 5;
    for (let i = 0; i < nReps; i++) {
      const result = await callModelText();
      answer += ' ' + result;
    }
    return this.appService.displayText(answer);
  }
}
