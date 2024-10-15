import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  displayText(text: string): string {
    return text;
  }
}
