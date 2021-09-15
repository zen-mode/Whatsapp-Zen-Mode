import browser from "webextension-polyfill";
import {unhide_contact} from "../../../user-can/hide-contacts/hide-contact";

import {Selectors} from "../../../../data/dictionary";
import {constructFakeCtxMenuItem} from "../../../user-can/use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item";

export function construct_Unhide_contact_ctx_menu_item(): HTMLLIElement {
  const menuItemEl = constructFakeCtxMenuItem(
    [browser.i18n.getMessage("WA_contactCtxMenuItem_unhide")],
    unhide_contact
  );
  menuItemEl.id = Selectors.ZM_UNHIDE_CONTACT_CTX_MENU_ITEM.substring(1);

  return menuItemEl;
}
