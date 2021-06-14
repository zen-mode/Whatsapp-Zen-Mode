/* Background Script */

/* eslint-env webextensions */

import "chrome-extension-async";

import {get_extn_URL} from ".get-extn-data";
import {focus_tab} from ".focus-tab";
import {get_extn_tabs} from ".get-extn-tabs";
import Tab = chrome.tabs.Tab;

//todo-tests: make sure focuses if BA tab is in another window; make sure doesn't creat new if: open new BA tab, then swithc to other tab then try to focus BA tab by pressing the icon (in failed test it will create new BA tab instead of focusing).

export async function focus_extn_tab_or_create_new_on(url: string): Promise<void> {
  const ownTabs: Tab[] = await get_extn_tabs();

  const tab = ownTabs.find((tab) => tab.url === `${get_extn_URL()}${url}`);
  if (tab) {
    await focus_tab(tab.id as number);
  } else {
    await chrome.tabs.create({url});
  }
}
export const focus_extn_tab_or_create_new = focus_extn_tab_or_create_new_on;

// Explain: Buggy: open new BA tab, then swithc to other tab then try to focus BA tab by pressing the icon (it will create new BA tab instead of focusing). Keep for ref until 01.02.21..
// async function get_extn_tabs(): Promise<Tab[]> {
//   // todo-team: ts error is due to getCurrent() being imported from @types/chrome; whereas it needs to be imported from..
//   // "chrome-extension-async".
//   return Promise.all(
//     chrome.extension
//       .getViews({type: "tab"})
//       .map(
//         (view: Window) => new Promise((resolve) => view.chrome.tabs.getCurrent(resolve)),
//       ),
//   );
// }
