import moment from "moment";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";

import {Selectors, StateItemNames, ZenModeStatuses} from "../../../data/dictionary";
import {
  get_extn_storage_item_value,
  remove_extn_storage_item,
  set_extn_storage_item
} from "../../../../utility-belt/helpers/extn/storage";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";
import {construct_zenmorning_area} from "./construct-zenmorning-area";
import {Chat} from "../../../whatsapp/model/Chat";
import {lastHoveredChat} from "../../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import {isZenMorningTime} from "../../../api/isZenMorningTime";
import {openChat} from "../../../whatsapp/ExtensionConnector";
import {
  apply_Zen_mode_status, get_Zen_mode_status,
  set_Zen_mode_status,
} from "../toggle-zen-mode/cs/toggle-zen-mode";

export function setZenMorning(): void {
  let zenMorningAreaEl = DOM.get_el(Selectors.ZM_ZENMORNING_AREA);
  if (!zenMorningAreaEl) {
    zenMorningAreaEl = construct_zenmorning_area();
    document.body.appendChild(zenMorningAreaEl);
  }
  set_el_style(zenMorningAreaEl, {
    display: 'unset'
  });
  zenMorningAreaEl?.addEventListener('click', function listener(e: MouseEvent) {
    // @ts-ignore
    const buttonWithAction = e.target.closest('[data-action]');
    if (!buttonWithAction) return;
    switch (buttonWithAction.dataset.action) {
      case 'ok': {
        set_el_style(zenMorningAreaEl, {display: "none"});
        toggleZenMorningForHoveredChat(true);
      }
      break;

      case 'cancel': {
        set_el_style(zenMorningAreaEl, {display: "none"});
      }
    }
    zenMorningAreaEl?.removeEventListener('click', listener);
  });
}

export function unsetZenMorning(): void {
  if (lastHoveredChat)
    toggleZenMorningForHoveredChat(false);
    remove_extn_storage_item(StateItemNames.ZEN_MORNING_CHAT);
}

async function toggleZenMorning(chat: Chat, turnZenMorning: boolean) {
  if (turnZenMorning && await isZenMorningChat(chat)) {
    return;
  }
  const oldZenMorningChat = await getZenMorningChat();

  if (turnZenMorning) {
    await set_extn_storage_item({
      [StateItemNames.ZEN_MORNING_CHAT]: chat
    });
  } else {
    await remove_extn_storage_item(StateItemNames.ZEN_MORNING_CHAT);
  }
}

async function toggleZenMorningForHoveredChat(turnZenMorning: boolean) {
  if (lastHoveredChat) {
    toggleZenMorning(lastHoveredChat, turnZenMorning);
  }
}

export async function isZenMorningChat(chat: Chat): Promise<boolean> {
  const zenMorningChat = await getZenMorningChat();
  if (zenMorningChat) {
    return zenMorningChat.name === chat.name;
  } else {
    return false;
  }
}

export async function getZenMorningChat(): Promise<Chat | undefined> {
  return (await get_extn_storage_item_value(StateItemNames.ZEN_MORNING_CHAT)) as Chat | undefined;
}

export async function checkZenMorningChatState(zenMorningChat?: Chat): Promise<void> {
  zenMorningChat = zenMorningChat || await getZenMorningChat();
  if (zenMorningChat) {
    if (await isZenMorningTime()) {
      await set_extn_storage_item({
        [StateItemNames.LAST_ACTIVITY_DATE]: moment().toJSON(),
        [StateItemNames.ZEN_MODE_FORCE_BY_ZEN_MORNING]: true
      });
      openChat(zenMorningChat, () => {
        apply_Zen_mode_status(ZenModeStatuses.ON);
      });
    }
  }
}

async function resetForcedZenMorning() {
  const zenModeStatus = await get_Zen_mode_status();
  const zenForcedByZMorning = await get_extn_storage_item_value(StateItemNames.ZEN_MODE_FORCE_BY_ZEN_MORNING);
  if (zenModeStatus === ZenModeStatuses.ON
    && zenForcedByZMorning) {
    await set_Zen_mode_status(ZenModeStatuses.OFF)
    await set_extn_storage_item({
      [StateItemNames.ZEN_MODE_FORCE_BY_ZEN_MORNING]: false,
    });
  }
}

void resetForcedZenMorning();
