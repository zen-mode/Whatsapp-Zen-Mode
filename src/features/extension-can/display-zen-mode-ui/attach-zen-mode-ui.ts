// Explain: Since we use process_error if an el is not found - we always have guards..
// and dont need to check for undefined.
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// Description:
// 1. Sets an interval timer to attach Zen mode UI in case of:
// 1.1. It is not already attached.
// 1.2. User navbar el is present (meaning WA has loaded and User clicked into any chat).
// 2. Attaches Zen mode UI to the page.
// 2.1. Constructs the UI.
// 2.2. Sets ZM UI in accordance with current ZM state (activated\disactivated).

import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {devprint} from "../../../../utility-belt/helpers/debug/devprint";
import {construct_Zen_mode_UI} from "./construct-zen-mode-ui/construct-zen-mode-ui";

import {Selectors} from "../../../data/dictionary";
import {TIME} from "../../../../utility-belt/constants/time";

// 1. Sets an interval timer to attach Zen mode UI in case of:
keep_Zen_mode_UI_attached();

function keep_Zen_mode_UI_attached(): void {
  setInterval(attach_Zen_mode_UI, TIME.TENTH_OF_A_SECOND);
  devprint("STATUS: Waiting for user to log in and open any chat.");
}

async function attach_Zen_mode_UI(): Promise<void> {
  // 1.1. It is not already attached.
  // Explain: If the icon is already present - exit.
  if (DOM.get_el(Selectors.ZM_TOGGLE_BUTTON)) return;

  // 1.2. User navbar el is present (meaning WA has loaded and User clicked into any chat).
  // Explain: If WA user navbar not present - means either User is not yet logged in;
  // or not not a particular chat. In both cases - exit.
  const leftHeaderButtonsEl = DOM.get_el(Selectors.WA_LEFT_HEADER_BUTTONS);
  if (!leftHeaderButtonsEl) return;

  // 2. Attaches Zen mode UI to the page.
  // 2.1. Constructs the UI.
  const [
    debugVersionInfoEl,  
    ZenModeBtnEl,
    releaseNotesAreaEl,
    visibilityShedulerAreaEl,
    offlineModeInfoEl
  ] = construct_Zen_mode_UI();

  leftHeaderButtonsEl.prepend(ZenModeBtnEl);

  leftHeaderButtonsEl.prepend(offlineModeInfoEl);
  
  leftHeaderButtonsEl.prepend(debugVersionInfoEl);
  
  const permanentZM_elsAreNotYetAttached =
    DOM.get_el(Selectors.ZM_RELEASE_NOTES_AREA) === null;
  if (permanentZM_elsAreNotYetAttached) {
    document.body.appendChild(releaseNotesAreaEl);
  }

  const permanentZM_visibilityShedulerAreaElNotYetAttached =
    DOM.get_el(Selectors.ZM_VISIBILITY_SHEDULER_POPUP) === null;
  if (permanentZM_visibilityShedulerAreaElNotYetAttached) {
    document.body.appendChild(visibilityShedulerAreaEl);
  }

  devprint("STATUS: UI attached.");
}
