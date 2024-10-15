import { Langfuse } from 'langfuse';

const LANGFUSE_SECRET_KEY = 'sk-lf-68cbd79d-b4d4-46f5-9e05-9dcdd6507c35';
const LANGFUSE_PUBLIC_KEY = 'pk-lf-739e1cf8-7537-45c9-94d0-d25e905a8623';
const LANGFUSE_HOST = 'https://cloud.langfuse.com';

// create the Langfuse client to query traces
export const lfClient = new Langfuse({
  secretKey: LANGFUSE_SECRET_KEY,
  publicKey: LANGFUSE_PUBLIC_KEY,
  baseUrl: LANGFUSE_HOST,
});

export async function runCustomEvaluation() {
  // time-range
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - 2 * 60 * 60 * 1000);

  // fetch traces
  const queryParams = {
    limit: 10,
    tags: ['stream'], // use tags to filter
    createdAt: { gte: startTime.toISOString(), lte: endTime.toISOString() }, // Fetch traces created after this date
  };
  const traces = await lfClient.fetchTraces(queryParams);

  // upload a random score just for fun
  traces.data.forEach((element) => {
    // here implement the overall evaluation of the trace
    // and publish a score

    const res = element.output as string;
    if (res && res.includes('Love')) {
      const score = Math.random();

      lfClient.score({
        traceId: element.id,
        name: 'my-custom-evaluation',
        value: score,
        dataType: 'NUMERIC',
        comment: 'This is created by me!',
      });
    }
  });
}
