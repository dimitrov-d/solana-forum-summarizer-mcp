import type { ConstructorParams } from '@browserbasehq/stagehand';
import 'dotenv/config';

export const StagehandConfig: ConstructorParams = {
  env: 'LOCAL',
  debugDom: false, // To enable DOM debugging features
  headless: true, // To run browser in headless mode
  logger: () => {}, // Do not log anything
  domSettleTimeoutMs: 30_000,
  modelName: 'claude-3-5-sonnet-latest',
  modelClientOptions: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  localBrowserLaunchOptions: {
    downloadsPath: '/Users/<your_username>/Downloads',
  },
};
