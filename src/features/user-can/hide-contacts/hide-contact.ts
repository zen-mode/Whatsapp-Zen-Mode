import {hide_WA_context_menu} from "../../../api/hide-wa-context-menu";
import {addHiddenChats, removeHiddenChats} from "../../../whatsapp/Storage";
import {process_error} from "../../extension-can/process-errors/process-error";
import {lastHoveredChat} from "../../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";

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
