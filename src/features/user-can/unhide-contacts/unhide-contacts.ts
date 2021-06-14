import {construct_zen_mode_ctx_menu_item} from "../use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item";
import {browser} from "webextension-polyfill-ts";

import {clearHiddenChats} from "../../../whatsapp/Storage";

export function construct_unhide_contacts_menu_item(): HTMLLIElement {
  const text = browser.i18n.getMessage("ZM_ctxMenuItem_unhideAll");
  return construct_zen_mode_ctx_menu_item(text, action);
}

async function action(): Promise<void> {
  clearHiddenChats();
}
