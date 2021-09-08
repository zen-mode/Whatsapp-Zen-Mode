/* Background script */

// Description:
// 0. Sets default state for state items that are undefined.
// 1. Waits for a command to toggle Zen mode to arrive either from:
// 1.1. Kb shortcut.
// 1.2. Extn icon click.
// 2. Sends the command to CS toggle Zen mode.

import browser from "webextension-polyfill";
import {devprint} from "../../../utility-belt/helpers/debug/devprint";
import {set_default_state} from "./default-state";

import {Commands} from "../../data/dictionary";

devprint("STATUS: State machine running.");

// 0. Sets default state for state items that are undefined.
set_default_state();

// 1.1. Kb shortcut.
browser.commands.onCommand.addListener((command: string) => {
  devprint(`STATUS: ${command} command received from keyboard`);
  void check_message_AND_run_procedure(command);
});

// 1.2. Extn icon click.
browser.pageAction.onClicked.addListener(() => {
  devprint(`STATUS: page action click received`);
  void check_message_AND_run_procedure(Commands.TOGGLE_ZEN_MODE);
});

// 1.3. Edle state listeners.
browser.idle.onStateChanged.addListener(idleState => {
  switch (idleState) {
    case "active": {
      check_message_AND_run_procedure(Commands.CHECK_ZENMORNING);
    } break;
  }
});

async function check_message_AND_run_procedure(commandOrMessage: string): Promise<void> {
  // @ts-ignore
  if (!Object.values(Commands).includes(commandOrMessage)) return;

  const tabs = await browser.tabs.query({
    url: '*://web.whatsapp.com/*'
  });
  tabs.forEach(tab => {
    if (!tab.id) return;
    // 2. Sends the command to CS toggle Zen mode.
    browser.tabs.sendMessage(tab.id, {
      action: commandOrMessage
    });
  });

  devprint(
    `STATUS: ${JSON.stringify({action: commandOrMessage})} msg sent to the page`,
  );
}
