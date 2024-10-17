import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseExporter } from 'langfuse-vercel';

const LANGFUSE_SECRET_KEY = 'sk-lf-68cbd79d-b4d4-46f5-9e05-9dcdd6507c35';
const LANGFUSE_PUBLIC_KEY = 'pk-lf-739e1cf8-7537-45c9-94d0-d25e905a8623';
const LANGFUSE_HOST = 'https://cloud.langfuse.com';

// create the Langfuse export (for OpenTelemetry)
export const lfExporter = new LangfuseExporter({
  secretKey: LANGFUSE_SECRET_KEY,
  publicKey: LANGFUSE_PUBLIC_KEY,
  baseUrl: LANGFUSE_HOST,
  release: 'v0.0.1',
});

export const sdk = new NodeSDK({
  traceExporter: lfExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// make sure it exits gracefully
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('SDK shut down successfully'))
    .catch((error) => console.log('Error shutting down SDK', error))
    .finally(() => process.exit(0));
});
