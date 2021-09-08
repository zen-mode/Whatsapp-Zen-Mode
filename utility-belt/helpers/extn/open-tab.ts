import browser, {Tabs} from "webextension-polyfill";

/**
 * @description: Opens new tab with a given URL.
 * @exampleInput: 'alkatsa.com' .
 * @exampleOutput: void .
 * @sideEffects: browser API.
 * @hasTests: No.
 */
export async function open_tab(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({url});
}
