/* eslint-env webextensions */

import "chrome-extension-async";

/**
 * @description: Focuses a tab with a given id.
 * @exampleInput: 356
 * @exampleOutput: void
 * @sideEffects: chrome API
 * @hasTests: no
 */
export async function focus_tab(tabId: number): Promise<void> {
  const tab = await chrome.tabs.get(tabId, () => {});

  await chrome.tabs.update(tabId, {active: true});
  await chrome.windows.update(tab.windowId, {focused: true});

  // Explain: Doesnt focus if in another window. Keep for ref until 01.02.21.
  // return chrome.tabs.highlight({windowId: tab.windowId, tabs: tab.index});
}
