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
  // 1. Toggles Zen mode State.
  const showZenModeUI = await toggle_Zen_mode_State_AND_get_value();

  // 2. Toggles Zen mode UI on the page.
  if (showZenModeUI) toggle_Zen_mode_on_page(ZenModeStatuses.ON);
  else toggle_Zen_mode_on_page(ZenModeStatuses.OFF);

  devprint(
    `STATUS: Zen Mode is ${showZenModeUI ? ZenModeStatuses.ON : ZenModeStatuses.OFF}`,
  );
}

async function toggle_Zen_mode_State_AND_get_value(): Promise<boolean> {
  const oldState = (await get_extn_storage_item_value(
    StateItemNames.ZEN_MODE_STATUS,
  )) as boolean;
  await set_extn_storage_item({[StateItemNames.ZEN_MODE_STATUS]: !oldState});

  devprint(`STATUS: Set ${StateItemNames.ZEN_MODE_STATUS} State to:`, !oldState);

  lastZenModeState = !oldState ? ZenModeStatuses.ON : ZenModeStatuses.OFF;

  return !oldState;
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
          lastTargetedChat = chat;
          bindChatsToTitleUnread(lastTargetedChat);
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
