import { lfClient } from './langfuse';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { callModelText } from './model';
import { v4 as uuidv4 } from 'uuid';

const datasetName = 'demo-dataset';

@Controller('dataset')
export class DatasetController {
  constructor(private readonly appService: AppService) {}

  @Get('create')
  async create(): Promise<string> {
    const creationTime = new Date();
    lfClient.createDataset({
      name: datasetName,
      // optional description
      description: 'Demo dataset',
      // optional metadata
      metadata: {
        author: 'Mario',
        date: creationTime.toISOString(),
        type: 'benchmark',
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    lfClient.createDatasetItem({
      datasetName: datasetName,

      input: 'What is love? Tell me in one sentence.',
      expectedOutput:
        'Love is a complex emotion that involves a deep feeling of affection, care, and attraction towards someone or something.',

      metadata: {
        author: 'mario',
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    lfClient.createDatasetItem({
      datasetName: datasetName,

      input: 'Who is Jupiter? Tell me only in one sentence.',
      expectedOutput:
        'Jupiter is the largest planet in our solar system, known for its distinctive red color and being a gas giant.',

      metadata: {
        author: 'mario',
      },
    });

    await lfClient.flushAsync();

    return this.appService.displayText('Creation dataset is done');
  }

  @Get('evaluate')
  async evaluate(): Promise<string> {
    const dataset = await lfClient.getDataset(datasetName);

    for (const item of dataset.items) {
      const traceId: string = uuidv4();
      const traceObj = lfClient.trace({ id: traceId });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(item.input);
      const answer: string = await callModelText(
        item.input as string,
        undefined,
        ['evaluation'],
        undefined,
        traceId,
      );

      traceObj.update({
        input: item.input,
        output: answer,
        name: 'evaluation',
        metadata: {
          author: 'mario',
        },
      });

      // link the execution trace to the dataset item and give it a run_name
      await item.link(traceObj, 'my-run', {
        description: 'Demo run',
        metadata: { model: 'openai' },
      });

      const randomScore = Math.random();

      // optionally, evaluate the output to compare different runs more easily
      traceObj.score({
        name: 'exact_match',
        value: item.expectedOutput === answer ? 1 : randomScore,
        comment: 'This is a very useful comment', // optional, useful to add reasoning
      });
    }

    // Flush the langfuse client to ensure all data is sent to the server at the end of the experiment run
    await lfClient.flushAsync();

    return this.appService.displayText('evaluation is done');
  }
}
