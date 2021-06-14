import moment from "moment";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";

import {Selectors, StateItemNames, ZenDomDataAttributes} from "../../../data/dictionary";
import {
  get_extn_storage_item_value,
  remove_extn_storage_item,
  set_extn_storage_item
} from "../../../../utility-belt/helpers/extn/storage";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";
import {construct_zenmorning_area} from "./construct-zenmorning-area";
import {renderZenMorningSunIcon} from "../../../api/renderZenMorningSunIcon";
import {Chat} from "../../../whatsapp/model/Chat";
import {lastHoveredChat} from "../../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import {isZenMorningTime} from "../../../api/isZenMorningTime";
import {openChat} from "../../../whatsapp/ExtensionConnector";

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
  // Render sun icon
  if (oldZenMorningChat) {
    renderZenMorningSunIcon(false, oldZenMorningChat);
  }
  renderZenMorningSunIcon(turnZenMorning, chat);
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
    renderZenMorningSunIcon(true, zenMorningChat);
    if (await isZenMorningTime()) {
      set_extn_storage_item({
        [StateItemNames.LAST_ACTIVITY_DATE]: moment().toJSON(),
        [StateItemNames.ZEN_MODE_STATUS]: true
      });
      openChat(zenMorningChat)
    }
  }
}
