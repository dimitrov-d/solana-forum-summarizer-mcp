import { Stagehand } from '@browserbasehq/stagehand';
import { main } from './main.js';
import StagehandConfig from './stagehand.config.js';

const stagehand = new Stagehand({
  ...StagehandConfig,
});

stagehand
  .init()
  .then(() =>
    main({ page: stagehand.page, context: stagehand.context, stagehand }),
  )
  .then(() => stagehand.close())
  .catch((error) => console.error(`Error occurred in main function: ${error}`));
