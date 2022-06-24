import browser from "webextension-polyfill";
import {Selectors} from "../../../../data/dictionary";
import {constructFakeCtxMenuItem} from "../../../user-can/use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item";
import { DOM } from "../../../../../utility-belt/helpers/dom/DOM-shortcuts";
import { set_el_style } from "../../../../../utility-belt/helpers/dom/set-el-style";
import { construct_hide_popup_area } from "../../../user-can/hide-chat-form-popup/construct-chat-popup";

export function construct_Hide_contact_ctx_menu_item(): HTMLLIElement {
  const iconUrl = browser.runtime.getURL('assets/whatsapp/hide-snooze-chat.png');
  const img = DOM.create_el({
    tag: "img",
    attributes: {src: iconUrl, id: "WA_contactCtxMenuItem_hide_id"}
  });
  const menuItemEl = constructFakeCtxMenuItem(
    [img, browser.i18n.getMessage("WA_contactCtxMenuItem_hide")],
    hidePopup
  );
  menuItemEl.id = Selectors.ZM_HIDE_CONTACT_CTX_MENU_ITEM.substring(1);

  return menuItemEl;
}

function hidePopup() {
  const hideChatAreaEl = construct_hide_popup_area();
  document.body.appendChild(hideChatAreaEl);
    // set_el_style(DOM.get_el(Selectors.ZM_HIDE_POPUP), {display: "initial"});
}