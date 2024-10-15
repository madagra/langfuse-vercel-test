import { generateText, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { lfExporter } from './exporter';

const OPENAI_PROJECT_NAME = 'changeme';
const OPENAI_SECRET_KEY = 'changeme';

// create the OpenAI provider using Vercel
export const model = createOpenAI({
  apiKey: OPENAI_SECRET_KEY,
  project: OPENAI_PROJECT_NAME,
  compatibility: 'strict',
});

export async function callModelText() {
  // create the Langfuse client (for manual tracing)
  // const trace = langfuse.trace({
  //   name: 'test-app-session',
  //   userId: 'user__935d7d1d-8625-4ef4-8651-544613e7bd22',
  //   metadata: { user: 'm@jupi.com' },
  //   tags: ['test', 'manual'],
  // });

  const { text } = await generateText({
    model: model('gpt-4-turbo'),
    prompt: 'What is love? Tell me only in one phrase.',
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'trace-text',
      metadata: {
        tags: ['generation', 'text'],
      },
    },
  });

  await lfExporter.forceFlush();

  return text;
}

export async function callModelStream() {
  // create the Langfuse client (for manual tracing)
  // const trace = langfuse.trace({
  //   name: 'test-app-session',
  //   userId: 'user__935d7d1d-8625-4ef4-8651-544613e7bd22',
  //   metadata: { user: 'm@jupi.com' },
  //   tags: ['test', 'manual'],
  // });

  const { text, textStream } = await streamText({
    model: model('gpt-4-turbo'),
    prompt: 'What is love? Tell me only in one phrase.',
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'trace-stream',
      metadata: {
        tags: ['generation', 'stream'],
      },
    },
  });

  for await (const delta of textStream) {
    console.log(delta);
  }

  await lfExporter.forceFlush();

  return text;
}
