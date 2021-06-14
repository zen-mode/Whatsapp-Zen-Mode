/* eslint-env webextensions */

import {get_extn_URL} from ".get-extn-data";
import Tab = chrome.tabs.Tab;

/**
 * @description: Returns extn tabs. Requires 'tabs' permission.
 * @exampleInput:  none
 * @exampleOutput: Tab[]
 * @sideEffects: chrome API
 * @hasTests: no
 */
export async function get_extn_tabs(): Promise<Tab[]> {
  return chrome.tabs.query({url: `${get_extn_URL()}*`});
}
