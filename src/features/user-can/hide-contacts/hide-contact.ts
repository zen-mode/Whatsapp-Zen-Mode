import {hide_WA_context_menu} from "../../../api/hide-wa-context-menu";
import {addHiddenChats, removeHiddenChats} from "../../../whatsapp/Storage";
import {process_error} from "../../extension-can/process-errors/process-error";
import {lastHoveredChat} from "../../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import {browser} from "webextension-polyfill-ts";
import {Selectors} from "../../../data/dictionary";

export function hide_contact(): void {
  hide_WA_context_menu();
  set_hide_contact(true);
  // lastHoveredChat = null;
}

export function unhide_contact(): void {
  hide_WA_context_menu();
  set_hide_contact(false);
  // lastHoveredChat = null;
}

function set_hide_contact(hide: boolean): void {
  if (!lastHoveredChat) {
    process_error("Hover chat not define")
    return;
  }
  if (hide) {
    addHiddenChats(lastHoveredChat);
  } else {
    removeHiddenChats(lastHoveredChat);
  }
}

export function renderHiddenLabel(chatEl: HTMLElement) {
  const span = chatEl.querySelector(Selectors.WA_HIDDEN_LABEL_CONTAINER);
  if (!span) return;
  span.innerHTML = browser.i18n.getMessage('ZM_hidden');
}
