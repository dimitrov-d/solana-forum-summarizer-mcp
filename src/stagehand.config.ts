import type { ConstructorParams, LogLine } from '@browserbasehq/stagehand';
import dotenv from 'dotenv';

dotenv.config();

const StagehandConfig: ConstructorParams = {
  env: 'LOCAL',
  debugDom: undefined, // Enable DOM debugging features
  headless: false, // Run browser in headless mode
  logger: (message: LogLine) => {}, // Do not log anything
  domSettleTimeoutMs: 30_000,
  modelName: 'claude-3-5-sonnet-latest',
  modelClientOptions: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  localBrowserLaunchOptions: {
    downloadsPath: '/Users/damjand/Downloads',
  }
};