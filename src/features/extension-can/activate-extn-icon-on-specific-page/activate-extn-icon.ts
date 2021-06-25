/* Background script */

// Description:
// 1. Makes extn icon active on https://web.whatsapp.com/; disabled otherwise.

import {browser} from "webextension-polyfill-ts";

// 1. Makes extn icon active on https://web.whatsapp.com/; disabled otherwise.
browser.runtime.onInstalled.addListener(function () {
  // Reload WhatsApp tab
  browser.tabs.query({}).then((tabs: any) => {
    if (tabs && tabs.length) {
      tabs.map((tab: any) => {
        if (tab.url.includes("web.whatsapp.com"))  browser.tabs.reload(tab.id);
      })
    }
  });
  browser.declarativeContent.onPageChanged.removeRules(undefined, function () {
    browser.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new browser.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: "web.whatsapp.com", schemes: ["https"]},
          }),
        ],
        actions: [new browser.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
