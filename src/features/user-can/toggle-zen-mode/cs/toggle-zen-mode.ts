// Description:
// 1. Toggles Zen mode State.
// 2. Toggles Zen mode UI on the page.

import {devprint} from "../../../../../utility-belt/helpers/debug/devprint";
import {
  get_extn_storage_item_value,
  remove_extn_storage_item,
  set_extn_storage_item
} from "../../../../../utility-belt/helpers/extn/storage";
import {DOM} from "../../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../../utility-belt/helpers/dom/set-el-style";
import {process_error, throw_DOM_error} from "../../../extension-can/process-errors/process-error";

import {Selectors, StateItemNames, ZenModeStatuses} from "../../../../data/dictionary";
import {getOpenedChat, muteNonMutedChatsExceptChat, openChat, unmuteChatsLocally} from "../../../../whatsapp/ExtensionConnector";
import {Chat} from "../../../../whatsapp/model/Chat";
import {bindChatsToTitleUnread, unbindAllChatsToTitle} from "../../../../api/bind-title-to-value";
import {getZenModeLogoUrlByState} from "../../../../api/getZenModeIcon";

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
  await storeZenModeChat(status);
  await set_Zen_mode_status(status);
  await toggle_Zen_mode_on_page(status);
}

export async function storeZenModeChat(status: ZenModeStatuses): Promise<void> {
  if (status === ZenModeStatuses.ON) {
    const openedChat = await new Promise(resolve => getOpenedChat(resolve));
    if (!openedChat) {
      return process_error(new Error('Opened chat is required'));
    }
    await set_extn_storage_item({
      [StateItemNames.ZEN_MODE_CHAT]: openedChat
    });
  } else {
    await remove_extn_storage_item(StateItemNames.ZEN_MODE_CHAT);
  }
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
let zenMutedChats: Chat[] = [];

export async function toggle_Zen_mode_on_page(mode: ZenModeStatuses): Promise<void> {
  const logoUrl = await getZenModeLogoUrlByState(mode);
  document.querySelectorAll('.ZenModeLogo').forEach(node => {
    set_el_style(node, {
      "background-image": `url('${logoUrl}')`
    });
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
    const chat = (await get_extn_storage_item_value(StateItemNames.ZEN_MODE_CHAT)) as Chat;
    muteNonMutedChatsExceptChat(chat, (mutedChats: Chat[]) => {
      zenMutedChats = mutedChats
    });
    getOpenedChat(async openedChat => {
      if (!openedChat || openedChat.id !== chat.id) {
        openedChat = await new Promise(resolve => openChat(chat, resolve));
        if (!openedChat) {
          return process_error(new Error('Opened chat is missed' + JSON.stringify(openedChat)));
        }
      }
      if (mode === lastZenModeState) {
        bindChatsToTitleUnread(openedChat);
        lastTargetedChat = openedChat;
      }
    });
  } else if (mode === ZenModeStatuses.OFF) {
    if (lastTargetedChat) {
      unbindAllChatsToTitle();
    }
    if (zenMutedChats) {
      unmuteChatsLocally(zenMutedChats)
    }
  }
}
