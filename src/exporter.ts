import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseExporter } from 'langfuse-vercel';

const LANGFUSE_SECRET_KEY = 'changeme';
const LANGFUSE_PUBLIC_KEY = 'changeme'; 
const LANGFUSE_HOST = 'https://cloud.langfuse.com';

// create the Langfuse export (for OpenTelemetry)
export const lfExporter = new LangfuseExporter({
  secretKey: LANGFUSE_SECRET_KEY,
  publicKey: LANGFUSE_PUBLIC_KEY,
  baseUrl: LANGFUSE_HOST,
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
