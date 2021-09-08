import browser from "webextension-polyfill";

/**
 * @description: Gets active tab id. Requires either 'tabs' or 'activeTab' permission.
 * @exampleInput: 'some page name'
 * @exampleOutput: 2378
 * @sideEffects: browser API
 * @hasTests: false
 */

export async function get_active_tab_id(
  initiatorName?: string,
): Promise<number | undefined> {
  const tabs = await browser.tabs.query({
    // Explain: Return the tab from which extension was launched.
    active: true,
    currentWindow: true,
  });
  const [activeTab] = tabs;

  if (!activeTab || activeTab.id === undefined) {
    // eslint-disable-next-line no-console
    console.error(
      `${initiatorName ?? "No initiatorName provided"}: could not get active tab id`,
    );
    return;
  }

  return activeTab.id;
}
