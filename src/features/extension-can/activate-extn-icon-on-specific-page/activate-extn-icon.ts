/* Background script */

// Description:
// 1. Makes extn icon active on https://web.whatsapp.com/; disabled otherwise.

import {browser} from "webextension-polyfill-ts";

// 1. Makes extn icon active on https://web.whatsapp.com/; disabled otherwise.

const reloadReasons = new Set(["install", "update"])
browser.runtime.onInstalled.addListener(function ({reason}) {
  // Reload WhatsApp tab
  if (reloadReasons.has(reason)) {
    browser.tabs.create({
      url: 'onboarding.html'
    });
  }
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
