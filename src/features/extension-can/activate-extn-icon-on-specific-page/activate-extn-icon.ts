/* Background script */

// Description:
// 1. Makes extn icon active on https://web.whatsapp.com/; disabled otherwise.

import {browser} from "webextension-polyfill-ts";

// 1. Makes extn icon active on https://web.whatsapp.com/; disabled otherwise.
browser.runtime.onInstalled.addListener(function (reason) {
  // Reload WhatsApp tab
  if (reason.reason === "install") {
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
