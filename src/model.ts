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

export async function callModelText(question?: string, traceName?: string, tags?: string[], userId?: string) {

  const { text } = await generateText({
    model: model('gpt-4o-mini'),
    prompt: question || 'Who is Jupiter? Tell me only in one phrase.',
    experimental_telemetry: {
      isEnabled: true,
      functionId: traceName,
      metadata: {
        tags: tags,
        userId: userId,
      },
    },
  });

  await lfExporter.forceFlush();

  return text;
}

export async function callModelStream(question?: string, traceName?: string, tags?: string[], userId?: string) {

  const { text, textStream } = await streamText({
    model: model('gpt-4o-mini'),
    prompt: question || 'Who is Jupiter? Tell me only in one phrase.',
    experimental_telemetry: {
      isEnabled: true,
      functionId: traceName,
      metadata: {
        tags: tags,
        userId: userId,
      },
    },
  });

  for await (const delta of textStream) {
    console.log(delta);
  }

  await lfExporter.forceFlush();

  return text;
}
