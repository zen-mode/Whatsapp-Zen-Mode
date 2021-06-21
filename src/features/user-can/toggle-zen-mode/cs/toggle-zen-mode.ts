// Description:
// 1. Toggles Zen mode State.
// 2. Toggles Zen mode UI on the page.

import {devprint} from "../../../../../utility-belt/helpers/debug/devprint";
import {get_extn_storage_item_value, set_extn_storage_item} from "../../../../../utility-belt/helpers/extn/storage";
import {DOM} from "../../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../../utility-belt/helpers/dom/set-el-style";
import {browser} from "webextension-polyfill-ts";
import {throw_DOM_error} from "../../../extension-can/process-errors/process-error";

import {Selectors, StateItemNames, ZenModeStatuses} from "../../../../data/dictionary";
import {findChatByTitle} from "../../../../whatsapp/ExtensionConnector";
import {Chat} from "../../../../whatsapp/model/Chat";
import {get_targeted_chat_raw_title} from "../../../../api/get-targeted-chat-title";
import {bindChatsToTitleUnread, unbindAllChatsToTitle} from "../../../../api/bind-title-to-value";

devprint("STATUS: Waiting for TOGGLE_ZEN_MODE command.");

export async function toggle_Zen_mode(): Promise<void> {
  const zenModeStatus = await get_Zen_mode_status();
  const newZenModeStatus = toggle_Zen_mode_status(zenModeStatus);
  await apply_Zen_mode_status(newZenModeStatus);
}

function toggle_Zen_mode_status(status: ZenModeStatuses): ZenModeStatuses {
  return status === ZenModeStatuses.ON
    ? ZenModeStatuses.OFF
    : ZenModeStatuses.ON;
}

export async function apply_Zen_mode_status(status: ZenModeStatuses): Promise<void> {
  await set_Zen_mode_status(status);
  await toggle_Zen_mode_on_page(status);
}

export async function set_Zen_mode_status(status: ZenModeStatuses): Promise<void> {
  await set_extn_storage_item({
    [StateItemNames.ZEN_MODE_STATUS]: status === ZenModeStatuses.ON
  });
  lastZenModeState = status;
  devprint(
    `STATUS: Zen Mode is ${status}`,
  );
}

export async function get_Zen_mode_status(): Promise<ZenModeStatuses> {
  const isZenModeON = await get_extn_storage_item_value(StateItemNames.ZEN_MODE_STATUS);
  return isZenModeON
    ? ZenModeStatuses.ON
    : ZenModeStatuses.OFF;
}

let lastTargetedChat: Chat | null;
let lastZenModeState: ZenModeStatuses | null;

export function toggle_Zen_mode_on_page(mode: ZenModeStatuses): void {
  set_el_style(DOM.get_el(Selectors.ZM_TOGGLE_BUTTON), {
    "background-image":
      'url("' +
      browser.runtime.getURL(
        `assets/logo/${mode === ZenModeStatuses.ON ? "logo-off.png" : "logo.png"}` + '")',
      ),
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const sidebarEl = DOM.get_el(Selectors.WA_SIDEBAR)!;
  set_el_style(sidebarEl.parentElement, {
    display: mode === ZenModeStatuses.ON ? "none" : "initial",
  });

  // Note: That one's invisible by def, but still present in DOM.
  const contactInfoPanelEl = DOM.get_el(Selectors.WA_CONTACT_INFO_PANEL);
  if (!contactInfoPanelEl) {
    throw_DOM_error(Selectors.WA_CONTACT_INFO_PANEL, "WA_CONTACT_INFO_PANEL");
    return;
  }
  set_el_style(contactInfoPanelEl, {
    display: mode === ZenModeStatuses.ON ? "none" : "initial",
  });

  if (mode === ZenModeStatuses.ON) {
    const targetedChatTitle = get_targeted_chat_raw_title();
    if (targetedChatTitle) {
      findChatByTitle(targetedChatTitle, (chat: Chat) => {
        if (targetedChatTitle === get_targeted_chat_raw_title()
        && mode === lastZenModeState) {
          bindChatsToTitleUnread(chat);
          lastTargetedChat = chat;
        }
      });
    } else {
      throw Error("Targeted chat title not found");
    }
  } else if (mode === ZenModeStatuses.OFF) {
    if (lastTargetedChat) {
      unbindAllChatsToTitle();
    }
  }
}
