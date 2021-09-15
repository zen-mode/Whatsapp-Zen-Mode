/* Content script */

// Description:
// 1. Waits for a command to toggle Zen mode to arrive from SM.
// 2. Toggles Zen mode.

import browser from "webextension-polyfill";
import {devprint} from "../../../utility-belt/helpers/debug/devprint";
import {toggle_Zen_mode} from "../user-can/toggle-zen-mode/cs/toggle-zen-mode";

import {Commands} from "../../data/dictionary";
import {checkZenMorningChatState} from "../user-can/zenmorning/setZenMorning";

devprint("STATUS: Waiting for TOGGLE_ZEN_MODE command.");

// 1. Waits for a command to take orders from the BGS SM.
browser.runtime.onMessage.addListener(async (command: {action: string}) => {
  // 2. Take action.
  switch (command.action) {
    case Commands.TOGGLE_ZEN_MODE: {
      toggle_Zen_mode();
    } break;

    case Commands.CHECK_ZENMORNING: {
      checkZenMorningChatState();
    } break;
  }
});
