import {hide_WA_context_menu} from "../../../api/hide-wa-context-menu";
import {addHiddenChats, removeHiddenChats} from "../../../whatsapp/Storage";
import {process_error} from "../../extension-can/process-errors/process-error";
import {lastHoveredChat} from "../../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import browser from "webextension-polyfill";
import {Selectors} from "../../../data/dictionary";

export function hide_contact(chosenDelay?: number): void {
  set_hide_contact(true, chosenDelay);
  // lastHoveredChat = null;
}

export function unhide_contact(): void {
  hide_WA_context_menu();
  set_hide_contact(false);
  // lastHoveredChat = null;
}

function set_hide_contact(hide: boolean, chosenDelay?: number): void {
  if (!lastHoveredChat) {
    process_error("Hover chat not define")
    return;
  }
  if (hide) {
    if (chosenDelay) {
      browser.runtime.sendMessage({type: 'setAlarm', payload: {
        chat: lastHoveredChat, 
        delay: chosenDelay
      }})
    }
    addHiddenChats(lastHoveredChat);
  } else {
    removeHiddenChats(lastHoveredChat);
    browser.runtime.sendMessage({type: 'deleteShedule', payload: {chat: [lastHoveredChat.id]}});
  }
}

export function renderHiddenLabel(chatEl: HTMLElement) {
  const span = chatEl.querySelector(Selectors.WA_HIDDEN_LABEL_CONTAINER);
  if (!span) return;
  span.innerHTML = browser.i18n.getMessage('ZM_hidden');
}

browser.runtime.onMessage.addListener(function(message) {
  const { type, payload } = message;
  if (type === "unhideChat") {
    removeHiddenChats(payload.chat);
  }
})