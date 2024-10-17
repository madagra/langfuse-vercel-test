import Langfuse from 'langfuse';

const LANGFUSE_SECRET_KEY = 'changeme';
const LANGFUSE_PUBLIC_KEY = 'changeme';
const LANGFUSE_HOST = 'https://cloud.langfuse.com';

// create the Langfuse client to query traces
export const lfClient = new Langfuse({
  secretKey: LANGFUSE_SECRET_KEY,
  publicKey: LANGFUSE_PUBLIC_KEY,
  baseUrl: LANGFUSE_HOST,
});
