import {set_el_attributes} from "../../../../../utility-belt/helpers/dom/set-el-attributes";
import {browser} from "webextension-polyfill-ts";

import {Selectors} from "../../../../data/dictionary";
import {setZenMorning, unsetZenMorning} from "../../../user-can/zenmorning/setZenMorning";
import {construct_zen_mode_ctx_menu_item} from "../../../user-can/use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item";

export function construct_zenMorning_contact_ctx_menu_item(contactWithZenMorning: boolean): HTMLLIElement {
  const menuItemEl = construct_zen_mode_ctx_menu_item(
    browser.i18n.getMessage(contactWithZenMorning
      ? "WA_contactCtxMenuItem_cancelZenMorning"
      : "WA_contactCtxMenuItem_zenMorning"
    ),
    contactWithZenMorning
      ? unsetZenMorning
      : setZenMorning
  )
  set_el_attributes(menuItemEl, {
    id: Selectors.ZM_ZENMORNING_CONTACT_CTX_MENU_ITEM.substring(1),
  });

  return menuItemEl;
}
