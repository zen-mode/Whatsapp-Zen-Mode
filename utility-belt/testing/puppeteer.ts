import type puppeteer from "utility-belt/testing/puppeteer";

/**
 * @description: Waits for selector and clicks it.
 * @exampleInput:  '#foo', Tab | 'FOO', Tab, true .
 * @exampleOutput: void        | void .
 * @isPure: Page interaction.
 * @hasTests: No.
 */
export async function selector_and_click(
  selector: string,
  tab: puppeteer.Page,
  isTestId?: true,
): Promise<void> {
  const finalSelector = isTestId ? `[data-testid="${selector}"]` : selector;

  await tab.waitForSelector(finalSelector);
  await tab.click(finalSelector);
}

/**
 * @description: Waits for element with text and clicks it.
 * @exampleInput:  'FooBar', Tab .
 * @exampleOutput: void    .
 * @isPure: Page interaction.
 * @hasTests: No.
 */
export async function text_and_click(text: string, tab: puppeteer.Page): Promise<void> {
  await tab.waitForXPath(`//*[contains(., '${text}')]`);

  // Explain: Xpath will return an arr of all the parents of text-containing el, ..
  // including <body>. We take the last item in that array - that's the el we need.
  const [el] = (await tab.$x(`//*[contains(., '${text}')]`)).slice(-1);
  await el.click();
}
