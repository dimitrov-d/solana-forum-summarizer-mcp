import { ObserveResult, Page, Stagehand } from '@browserbasehq/stagehand';
import boxen from 'boxen';
import chalk from 'chalk';
import fs from 'fs/promises';
import { z } from 'zod';
import StagehandConfig from './stagehand.config';

export function announce(message: string, title?: string) {
  console.log(
    boxen(message, {
      padding: 1,
      margin: 3,
      title: title || 'Stagehand',
    }),
  );
}

/**
 * Get an environment variable and throw an error if it's not found
 * @param name - The name of the environment variable
 * @returns The value of the environment variable
 */
export function getEnvVar(name: string, required = true): string | undefined {
  const value = process.env[name];
  if (!value && required) {
    throw new Error(`${name} not found in environment variables`);
  }
  return value;
}

/**
 * Validate a Zod schema against some data
 * @param schema - The Zod schema to validate against
 * @param data - The data to validate
 * @returns Whether the data is valid against the schema
 */
export function validateZodSchema(schema: z.ZodTypeAny, data: unknown) {
  try {
    schema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export async function drawObserveOverlay(page: Page, results: ObserveResult[]) {
  // Convert single xpath to array for consistent handling
  const xpathList = results.map((result) => result.selector);

  // Filter out empty xpaths
  const validXpaths = xpathList.filter((xpath) => xpath !== 'xpath=');

  await page.evaluate((selectors) => {
    selectors.forEach((selector) => {
      let element;
      if (selector.startsWith('xpath=')) {
        const xpath = selector.substring(6);
        element = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        ).singleNodeValue;
      } else {
        element = document.querySelector(selector);
      }

      if (element instanceof HTMLElement) {
        const overlay = document.createElement('div');
        overlay.setAttribute('stagehandObserve', 'true');
        const rect = element.getBoundingClientRect();
        overlay.style.position = 'absolute';
        overlay.style.left = `${rect.left}px`;
        overlay.style.top = `${rect.top}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
        overlay.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '10000';
        document.body.appendChild(overlay);
      }
    });
  }, validXpaths);
}

export async function clearOverlays(page: Page) {
  // remove existing stagehandObserve attributes
  await page.evaluate(() => {
    const elements = document.querySelectorAll('[stagehandObserve="true"]');
    elements.forEach((el) => {
      const parent = el.parentNode;
      while (el.firstChild) {
        parent?.insertBefore(el.firstChild, el);
      }
      parent?.removeChild(el);
    });
  });
}

const instructionCache: Record<string, ObserveResult> = {};

export function simpleCache(instruction: string, actionToCache: any) {
  try {
    instructionCache[instruction] = actionToCache;
  } catch (error) {
    console.error(chalk.red('Failed to save to cache:'), error);
  }
}

/**
 * This function is used to act with a cacheable action.
 * It will first try to get the action from the cache.
 * If not in cache, it will observe the page and cache the result.
 * Then it will execute the action.
 * @param instruction - The instruction to act with.
 */
export async function actWithCache(
  page: Page,
  instruction: string,
): Promise<void> {
  const cachedAction = instructionCache[instruction];
  if (cachedAction) {
    console.log(chalk.blue('Using cached action for: '), instruction);
    await page.act(cachedAction);
    return;
  }

  // If not in cache, observe the page and cache the result
  const results = await page.observe(instruction);
  console.log(chalk.blue('Got results:'), results);

  // Cache the playwright action
  const actionToCache = results[0];
  console.log(chalk.blue('Taking cacheable action:'), actionToCache);
  simpleCache(instruction, actionToCache);
  // OPTIONAL: Draw an overlay over the relevant xpaths
  await drawObserveOverlay(page, results);
  await page.waitForTimeout(1000); // Can delete this line, just a pause to see the overlay
  await clearOverlays(page);

  // Execute the action
  await page.act(actionToCache);
}

export async function withStagehand(action: (page: Page) => Promise<any>) {
  const stagehand = new Stagehand({ ...StagehandConfig });

  return stagehand
    .init()
    .then(() => action(stagehand.page))
    .then(async (result) => {
      await stagehand.close();
      return result;
    })
    .catch((error) => {
      const message = `Error occurred in executing action: ${error}`;
      console.error(error);
      return { success: false, error: message };
    });
}
