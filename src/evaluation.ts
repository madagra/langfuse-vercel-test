import { lfClient } from './langfuse';

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
