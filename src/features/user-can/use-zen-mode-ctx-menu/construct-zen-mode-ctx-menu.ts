import {set_el_attributes} from "../../../../utility-belt/helpers/dom/set-el-attributes";
import {construct_send_feedback_menu_item} from "../send-feedback/send-feedback";
import {construct_unhide_contacts_menu_item} from "../unhide-contacts/unhide-contacts";
import {construct_read_release_notes_menu_item} from "../read-release-notes/read-release-notes-cs";

import {Selectors} from "../../../data/dictionary";
import {construct_hidden_chats_menu_item} from "../hide-contacts/hidden-chats-menu-item";
import {construct_smartMute_menu_item} from "../SmartMute/SmartMute";

export function construct_zen_mode_ctx_menu(): HTMLDivElement {
  const ctxMenuEl = document.createElement("div");
  set_el_attributes(ctxMenuEl, {
    id: Selectors.ZM_CTX_MENU.substring(1),
    class: [Selectors.WA_CONTACT_CTX_MENU.substring(1)],
  });

  const menuListEl = document.createElement("ul");
  set_el_attributes(menuListEl, {
    class: [Selectors.WA_CONTACT_CTX_MENU_LIST.substring(1)],
  });
  ctxMenuEl.appendChild(menuListEl);

  [
    construct_smartMute_menu_item(),
    construct_hidden_chats_menu_item(),
    construct_unhide_contacts_menu_item(),
    construct_read_release_notes_menu_item(),
    construct_send_feedback_menu_item(),
  ].forEach((menuItemEl) => menuListEl.appendChild(menuItemEl));

  return ctxMenuEl;
}
