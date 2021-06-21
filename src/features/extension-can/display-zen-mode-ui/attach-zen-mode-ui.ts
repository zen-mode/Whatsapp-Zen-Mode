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
import {process_error} from "../process-errors/process-error";
import {devprint} from "../../../../utility-belt/helpers/debug/devprint";
import {construct_Zen_mode_UI} from "./construct-zen-mode-ui/construct-zen-mode-ui";
import {
  get_Zen_mode_status,
  toggle_Zen_mode_on_page
} from "../../user-can/toggle-zen-mode/cs/toggle-zen-mode";

import {Selectors, StateItemNames, ZenModeStatuses} from "../../../data/dictionary";
import {TIME} from "../../../../utility-belt/constants/time";
import {getSmartMuteStatus, setSmartMuteStatus} from "../../user-can/SmartMute/SmartMute";

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
  const userNavbarEl = DOM.get_el(Selectors.WA_USER_NAVBAR);
  if (!userNavbarEl) return;

  // 2. Attaches Zen mode UI to the page.
  const WA_rightBtnGroupEl = userNavbarEl.children[userNavbarEl.children.length - 1]!
    .firstElementChild;
  if (!WA_rightBtnGroupEl) process_error(Error(`rightBtnGroupEl not found`));

  // 2.1. Constructs the UI.
  const [
    toggleZenModeBtnEl,
    ZenModeBtnCtxMenuEl,
    releaseNotesAreaEl,
  ] = construct_Zen_mode_UI();

  WA_rightBtnGroupEl!.prepend(toggleZenModeBtnEl);

  const permanentZM_elsAreNotYetAttached =
    DOM.get_el(Selectors.ZM_RELEASE_NOTES_AREA) === null;
  if (permanentZM_elsAreNotYetAttached) {
    document.body.appendChild(ZenModeBtnCtxMenuEl);
    document.body.appendChild(releaseNotesAreaEl);
  }

  devprint("STATUS: UI attached.");

  // 2.2. Sets ZM UI in accordance with current ZM state (activated\deactivated).
  const zenModeStatus = await get_Zen_mode_status();
  toggle_Zen_mode_on_page(zenModeStatus);

  // 2.3. Sets Smart Mute
  const smartMuteStatus = await getSmartMuteStatus();
  await setSmartMuteStatus(smartMuteStatus);
}
