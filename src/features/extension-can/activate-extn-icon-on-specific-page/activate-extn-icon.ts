/* Background script */

// Description:
// 1. Makes extn icon active on https://web.whatsapp.com/; disabled otherwise.

import browser, { Notifications } from "webextension-polyfill";

// 1. Makes extn icon active on https://web.whatsapp.com/; disabled otherwise.

const reloadReasons = new Set(["install", "update"])
browser.runtime.onInstalled.addListener(async function ({reason}) {
  if (reloadReasons.has(reason)) {
    const level = await ((
      browser.notifications as any
    ).getPermissionLevel() as Promise<Notifications.PermissionLevel>);
    const manifest = browser.runtime.getManifest();
    const name = manifest.name;
    const version = manifest.version;
    Notification.requestPermission();
    if (level === "granted") {
      browser.notifications.create({
        title: `${name} ${version}`,
        message: browser.i18n.getMessage("ZM_update_notification_message"),
        iconUrl: (browser.extension as any).getURL("assets/logo/logo.png"),
        type: "basic",
        buttons: [
          { title: `${String.fromCharCode(0x200F)}${browser.i18n.getMessage("ZM_update_notification_ok_button_label")}` }
        ],
      } as Notifications.CreateNotificationOptions);
    } else {
      browser.tabs.create({
        url: "onboarding.html",
      });
    }
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
